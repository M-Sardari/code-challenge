import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import {JwtService} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../database/entity";

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [TaskController],
  providers: [TaskService,JwtService]
})
export class TaskModule {}
