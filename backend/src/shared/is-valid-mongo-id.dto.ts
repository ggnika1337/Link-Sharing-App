import { IsMongoId } from "class-validator";


export class IsValidMongoId {
    @IsMongoId({message: "Use MongoDB ID"})
    id!: string
}