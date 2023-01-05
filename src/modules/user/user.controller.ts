import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {LoginUserDto} from "./dto/login-user.dto";
import {LogoutUserDto} from "./dto/logoutUserDto";

@ApiBearerAuth()
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'create new user' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'update user' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'User Id' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'remove user' })
  @ApiParam({ name: 'id', type: String, required: true, description: 'User Id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @ApiOperation({ summary: 'login user' })
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.userService.login(body);
  }

  @ApiOperation({ summary: 'logout user' })
  @Post('logout')
  async logout(@Body() body: LogoutUserDto) {
    return this.userService.logout(body);
  }
}
