import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  fullName!: string;

  @Prop({ type: String, unique: true })
  email!: string;

  @Prop({ type: String })
  password: string;

  @Prop({
    type: [String],
    default: [],
  })
  links!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
