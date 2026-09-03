import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Link } from './schemas/link.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel("link") private linkModel: Model<Link>,
    @InjectModel("user") private userModel: Model<User>
  ){}

  async create(createLinkDto: CreateLinkDto, userId: Types.ObjectId) {
    const newLink = await this.linkModel.create({
      ...createLinkDto,
      linkOwner: userId
    })

    await this.userModel.findByIdAndUpdate(userId, {
      $push: {links: newLink._id}
    })
    return newLink
  }

  async findAll(userId: Types.ObjectId) {
    const links = await this.linkModel.find({linkOwner: userId})

    return links
  }

  async update(id: string, updateLinkDto: UpdateLinkDto, userId: Types.ObjectId) {
    const targettedLink = await this.linkModel.findById(id)
    if(!targettedLink){
      throw new NotFoundException("Link not found")
    }

    if(targettedLink.linkOwner.toString() !== userId.toString()){
      throw new ForbiddenException("No permission")
    }

    const updatedLink = await this.linkModel.findByIdAndUpdate(id, {
      ...updateLinkDto,
      $inc: { __v: 1 }
    }, 
    {new: true})

    return updatedLink
  }

  async remove(id: string, userId: Types.ObjectId) {
    const targettedLink = await this.linkModel.findById(id)
    if(!targettedLink){
      throw new NotFoundException("Link not found")
    }

    if(targettedLink.linkOwner.toString() !== userId.toString()){
      throw new ForbiddenException("No permission")
    }

    const deletedLink = await this.linkModel.findByIdAndDelete(id)
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: {links: targettedLink._id}
    })

    return deletedLink
  }
}
