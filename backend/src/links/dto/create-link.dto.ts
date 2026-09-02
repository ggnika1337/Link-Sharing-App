import { IsNotEmpty, IsString, IsUrl } from "class-validator";


export class CreateLinkDto {
    
    @IsNotEmpty()
    @IsUrl()
    url!: string

    @IsNotEmpty()
    @IsString()
    platform!: string
}
