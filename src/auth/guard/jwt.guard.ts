import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Reflector} from "@nestjs/core";
import * as process from "process";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../database/entity";
import {Repository} from "typeorm";
import {REDIS, RedisClient} from "gadin-redis";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
                private reflector: Reflector,
                @InjectRepository(UserEntity)
                private usersRepository: Repository<UserEntity>,
                @Inject(REDIS) private readonly redisService: RedisClient
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];
        if (!authorization || Array.isArray(authorization)) {
            throw new UnauthorizedException()
        }
        const token = authorization.replace('Bearer', '').trim();
        const checkTokenInRedis = await this.redisService.get(token);

        const user = await this.jwtService.verify(token, {secret: process.env.JWT_SECRET_KEY});
        if (!user) return false;

        if (checkTokenInRedis != user.id) throw new UnauthorizedException()

        request.user = user;

        const userEntity = await this.usersRepository.findOneBy({id: user.id});
        if (!userEntity) return false

        const role = this.reflector.get<string>('role', context.getHandler());

        if (!user.roles.includes(role))
            throw new HttpException(
            'You do not have the required access.',
            HttpStatus.FORBIDDEN,
        );


        if (userEntity.operationCount >= +process.env.OPERATION_COUNT)
            throw new HttpException(
                'Too many request.',
                HttpStatus.TOO_MANY_REQUESTS,
            );

        userEntity.operationCount++;
        await this.usersRepository.save(userEntity)

        return true;
    }
}
