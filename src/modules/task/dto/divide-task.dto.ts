import {ApiProperty, PickType} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {CreateUserDto} from "../../user/dto/create-user.dto";
import {AddTaskDto} from "./add-task.dto";

export class DivideTaskDto extends PickType(AddTaskDto, ['number1','number2']) {}
