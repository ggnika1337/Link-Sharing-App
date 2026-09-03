import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsValidMongoId } from '../shared/is-valid-mongo-id.dto';
import { IsAuthGuard } from '../guards/isAuth.guard';
import { UserId } from './decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get("me")
  @UseGuards(IsAuthGuard)
  getMyProfile(
    @UserId() userId
  ){
    return this.usersService.findOne(userId)
  }

  @Patch("avatar")
  @UseGuards(IsAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  uploadAvatar(
    @UserId() userId,
    @UploadedFile(
      new ParseFilePipe(
        {validators: [
          new MaxFileSizeValidator({maxSize: 2* 1024 * 1024}),
          new FileTypeValidator({fileType: ".(png|jpg|jpeg)"})
        ]}
      )
    )
    file: Express.Multer.File
  ){
    return this.usersService.uploadAvatar(userId, file)
  }

  @Delete("avatar")
  @UseGuards(IsAuthGuard)
  removeAvatar(
    @UserId() userId
  ){
    return this.usersService.removeAvatar(userId)
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
