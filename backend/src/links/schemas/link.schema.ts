import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema(
    {timestamps: true}
)
export class Link {
    @Prop({
        type: String,
        required: true
    })
    url!: string

    @Prop({
        type: String,
        required: true
    })
    platform!: string

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: "user"
    })
    linkOwner!: Types.ObjectId
}

export const linkSchema = SchemaFactory.createForClass(Link)