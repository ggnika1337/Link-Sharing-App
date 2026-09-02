import { forwardRef, Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { linkSchema } from './schemas/link.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: "link", schema: linkSchema}
    ]),
    forwardRef(() => UsersModule)
  ],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService, MongooseModule]
})
export class LinksModule {}
