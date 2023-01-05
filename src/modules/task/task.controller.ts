import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {TaskService} from "./task.service";
import {AddTaskDto} from "./dto/add-task.dto";
import {MultiplyTaskDto} from "./dto/multiply-task.dto";
import {SubtractTaskDto} from "./dto/subtract-task.dto";
import {DivideTaskDto} from "./dto/divide-task.dto";
import {RoleEnum} from "../../auth/role/role.enum";
import {Role} from "../../auth/decorator/role.decorator";
import {JwtGuard} from "../../auth/guard";

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('task')
@ApiTags('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Role(RoleEnum.ADD)
    @Post('add')
    async add(@Body() body: AddTaskDto) {
        return await this.taskService.add(body);
    }

    @Role(RoleEnum.MULTIPLY)
    @Post('multiply')
    async multiply(@Body() body: MultiplyTaskDto) {
        return await this.taskService.multiply(body);
    }


    @Role(RoleEnum.SUBTRACT)
    @Post('subtract')
    async subtract(@Body() body: SubtractTaskDto) {
        return await this.taskService.subtract(body);
    }

    @Role(RoleEnum.DIVIDE)
    @Post('divide')
    async divide(@Body() body: DivideTaskDto) {
        return await this.taskService.divide(body);
    }
}
