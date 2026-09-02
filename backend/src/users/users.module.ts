import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { LinksModule } from '../links/links.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: "user", schema: UserSchema},
    ]),
    forwardRef(() => LinksModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule]
})
export class UsersModule {}
