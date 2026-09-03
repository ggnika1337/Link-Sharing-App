import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { LinksModule } from '../links/links.module';
import { CloudinaryService } from '../shared/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: "user", schema: UserSchema},
    ]),
    forwardRef(() => LinksModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService, MongooseModule]
})
export class UsersModule {}
