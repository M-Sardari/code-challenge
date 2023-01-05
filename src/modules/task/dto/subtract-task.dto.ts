import {ApiProperty, PickType} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";
import {AddTaskDto} from "./add-task.dto";

export class SubtractTaskDto extends PickType(AddTaskDto, ['number1','number2']) {}
