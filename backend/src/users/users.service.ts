import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from "bcrypt"
import { Link } from '../links/schemas/link.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel("user") private userModel: Model<User>,
    @InjectModel("link") private linkModel: Model<Link>
  ){}

  async findOne(id: string) {
    const desiredUser = await this.userModel.findById(id).populate("links")
    if(!desiredUser){
      throw new NotFoundException("User not found")
    }
    return desiredUser
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id)
    if(!deletedUser){
      throw new NotFoundException("User not found")
    }
    await this.linkModel.deleteMany({linkOwner: id})
    return deletedUser
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email){
      const existingEmail = await this.userModel.findOne({email: updateUserDto.email})
      if(existingEmail){
        throw new BadRequestException("This email is already used")
      }
    }

    if(updateUserDto.password){
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }
    
    const updatedUser = await this.userModel.findByIdAndUpdate(id, {
      ...updateUserDto,
      $inc: { __v: 1 }
    },
    {new: true})
    if(!updatedUser){
      throw new NotFoundException("User not found")
    }
    return updatedUser
  }
}
