import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  fullName!: string;

  @Prop({ type: String, required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ type: String, required: true, select: false})
  password!: string;

  @Prop({
    type: [String],
    default: [],
  })
  links!: string[];

  @Prop({
    type: String,
    required: false,
    default: ""
  })
  avatar!: string
}

export const UserSchema = SchemaFactory.createForClass(User);
