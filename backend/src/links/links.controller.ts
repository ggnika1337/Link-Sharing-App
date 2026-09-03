import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { IsAuthGuard } from '../guards/isAuth.guard';
import { UserId } from '../users/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';
import { IsValidMongoId } from '../shared/is-valid-mongo-id.dto';

@Controller('links')
@UseGuards(IsAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @Throttle({default: {ttl: 60 * 1000, limit: 5, blockDuration: 30 * 1000}})
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
  @Throttle({default: {ttl: 60 * 1000, limit: 5, blockDuration: 30 * 1000}})
  update(
    @Param() {id}: IsValidMongoId, 
    @Body() updateLinkDto: UpdateLinkDto,
    @UserId() userId
  ) {
    return this.linksService.update(id, updateLinkDto, userId);
  }

  @Delete(':id')
  remove(
    @Param() {id}: IsValidMongoId,
    @UserId() userId
  ) {
    return this.linksService.remove(id, userId);
  }
}
