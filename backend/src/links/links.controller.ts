import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { IsAuthGuard } from '../guards/isAuth.guard';
import { UserId } from '../users/decorators/user.decorator';

@Controller('links')
@UseGuards(IsAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(
    @Body() createLinkDto: CreateLinkDto,
    @UserId() userId
  ) {
    return this.linksService.create(createLinkDto, userId);
  }

  @Get()
  findAll(
    @UserId() userId
  ) {
    return this.linksService.findAll(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateLinkDto: UpdateLinkDto,
    @UserId() userId
  ) {
    return this.linksService.update(id, updateLinkDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserId() userId
  ) {
    return this.linksService.remove(id, userId);
  }
}
