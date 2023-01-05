import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from "../../database/entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService,JwtService]
})
export class UserModule {}
