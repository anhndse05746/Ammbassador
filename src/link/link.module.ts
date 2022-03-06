import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [SharedModule, AuthModule, TypeOrmModule.forFeature([Link])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
