import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { rejects } from 'assert';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Express } from 'express';
import multer from "multer"

@Injectable()
export class CloudinaryService {
    constructor(
        private readonly configService: ConfigService
    ){
        cloudinary.config({
            cloud_name: this.configService.get<string>("CLOUDINARY_NAME"),
            api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
            api_secret: this.configService.get<string>("CLOUDINARY_API_SECRET")
        })
    }

    async uploadFile(
        file: Express.Multer.File,
        folder = "avatars"
    ): Promise<UploadApiResponse | UploadApiErrorResponse>
    {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({folder, resource_type: "image"}, 
                (error, result) => {
                    if(error) return reject(error)
                    if(!result) return reject(new Error("Upload failed"))
                    resolve(result)
                }
            )
            uploadStream.end(file.buffer)
        })
    }

    async deleteFile(publicId: string): Promise<any> {
        if(!publicId) return
        return await cloudinary.uploader.destroy(publicId)
    }
}
