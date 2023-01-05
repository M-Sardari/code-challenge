import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsEnum, IsIn, IsNotEmpty, IsString} from "class-validator";
import {RoleEnum} from "../../../auth/role/role.enum";
import {UserEntity} from "../../../database/entity";

export class CreateUserDto {
    @ApiProperty({
        example: 'msardari',
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'admin',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: [RoleEnum.ADD, RoleEnum.DIVIDE],
        isArray: true,
        enum: Object.keys(RoleEnum)
    })
    @IsArray()
    @IsEnum(RoleEnum, {each: true})
    @IsNotEmpty()
    roles: RoleEnum[]
}

export class CreateUserRs {
    id: number;
    username: string;
    roles: RoleEnum[];

    constructor(result: UserEntity) {
        this.id = result.id;
        this.username = result.username;
        this.roles = result.roles;
    }
}
