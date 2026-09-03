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
    type: [Types.ObjectId],
    default: [],
    ref: "link"
  })
  links!: Types.ObjectId[];

  @Prop({
    type: {
      url: {type: String, default: ""},
      publicId: {type: String, default: ""}
    },
    default: {url: "", publicId: ""},
    required: false,
  })
  avatar!: {
    url: string,
    publicId: string
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
