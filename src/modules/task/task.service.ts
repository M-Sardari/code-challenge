import { Injectable } from '@nestjs/common';
import {AddTaskDto} from "./dto/add-task.dto";
import {MultiplyTaskDto} from "./dto/multiply-task.dto";
import {SubtractTaskDto} from "./dto/subtract-task.dto";
import {DivideTaskDto} from "./dto/divide-task.dto";

@Injectable()
export class TaskService {
    async add(body: AddTaskDto) {
        return body.number1 + body.number2
    }

    async multiply(body: MultiplyTaskDto) {
        return body.number1 * body.number2;
    }

    async subtract(body: SubtractTaskDto) {
        return body.number1 - body.number2;
    }

    async divide(body: DivideTaskDto) {
        return body.number1 / body.number2;
    }
}
