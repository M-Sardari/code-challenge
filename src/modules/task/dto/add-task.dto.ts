import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class AddTaskDto {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    number1: number;

    @ApiProperty({
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    number2: number;

}
