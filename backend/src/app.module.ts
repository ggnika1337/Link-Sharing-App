import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'pino-nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LinksModule } from './links/links.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {singleLine: true}
        }
      }
    }),
    ThrottlerModule.forRoot([
      {ttl: 1 * 60 * 1000, limit: 20}
    ]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET")
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI")
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: 
  [AppService,
    {provide: APP_GUARD, useClass: ThrottlerGuard}
  ],
})
export class AppModule {}
