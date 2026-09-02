import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsValidMongoId } from '../shared/is-valid-mongo-id.dto';
import { IsAuthGuard } from '../guards/isAuth.guard';
import { UserId } from './decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(IsAuthGuard)
  getMyProfile(
    @UserId() userId
  ){
    return this.usersService.findOne(userId)
  }

  @Get(':id')
  findOne(
    @Param('id') {id}: IsValidMongoId
  ) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(IsAuthGuard)
  update(
    @Param('id') {id}: IsValidMongoId, 
    @Body() updateUserDto: UpdateUserDto,
    @UserId() userId
  ) {
    if(id !== userId?.toString()){
      throw new ForbiddenException("No permission")
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(IsAuthGuard)
  remove(
    @Param('id') {id}: IsValidMongoId,
    @UserId() userId
  ) {
    if(id !== userId?.toString()){
      throw new ForbiddenException("No permission")
    }
    return this.usersService.remove(id);
  }
}
