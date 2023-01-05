import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateUserDto, CreateUserRs} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {compare, hash} from 'bcrypt';
import {PostgresErrorCode} from "../../database/enum/postgres-error-code.enum";
import {Repository} from "typeorm";
import {UserEntity} from "../../database/entity";
import {InjectRepository} from "@nestjs/typeorm";
import {JwtService} from "@nestjs/jwt";
import {RoleEnum} from "../../auth/role/role.enum";
import {LoginUserDto} from "./dto/login-user.dto";
import * as process from "process";
import {REDIS, RedisClient} from "gadin-redis";
import {LogoutUserDto} from "./dto/logoutUserDto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        @Inject(REDIS) private readonly redisService: RedisClient
    ) {
    }

    async create(body: CreateUserDto) {
        const hashedPassword = await hash(body.password, 10);
        try {
            const createdUser = await this.usersRepository.create({
                ...body,
                password: hashedPassword,
            });

            await this.usersRepository.save(createdUser)

            return new CreateUserRs(createdUser);
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException(
                    'User already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: number, body: UpdateUserDto) {
        const user = await this.usersRepository.findOneBy({id})
        if (!user) throw new HttpException(
            'User Not Found',
            HttpStatus.NOT_FOUND,
        );

        user.roles = body.roles;
        await this.usersRepository.save(user)
        return new CreateUserRs(user)
    }

    async remove(id: number) {
        const user = await this.usersRepository.findOneBy({id})
        if (!user) throw new HttpException(
            'User Not Found',
            HttpStatus.NOT_FOUND,
        );

        user.deleted_at = new Date();
        await this.usersRepository.save(user)
        return new CreateUserRs(user)
    }

    async login(body: LoginUserDto) {
        try {
            const user = await this.usersRepository.findOneBy({username: body.username});
            console.log({user})
            const isPasswordMatching = await compare(body.password, user.password);
            console.log({isPasswordMatching})
            if (!isPasswordMatching) {
                throw new HttpException(
                    'Wrong credentials provided',
                    HttpStatus.BAD_REQUEST,
                );
            }
            return await this.createAccessToken(user.id, user.username, user.roles);
        } catch (error) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async logout(body: LogoutUserDto) {
        await this.redisService.del(body.token);
        return {};
    }

    private async createAccessToken(
        id: number,
        username: string,
        roles: RoleEnum[],
    ): Promise<{ accessToken: string; }> {
        // const AFTER_ONE_DAY = 24 * 60 * 60;
        const AFTER_ONE_DAY = 1 * 60;
        const accessToken = this.jwtService.sign({id, username, roles}, {secret: process.env.JWT_SECRET_KEY});
        await this.redisService.setEx(accessToken, AFTER_ONE_DAY, id.toString());
        return {accessToken};
    }
}
