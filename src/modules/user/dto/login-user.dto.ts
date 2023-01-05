import { CreateUserDto } from './create-user.dto';
import {PickType} from "@nestjs/swagger";

export class LoginUserDto extends PickType(CreateUserDto, ['username','password']) {}
