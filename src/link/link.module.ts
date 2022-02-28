import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Link])],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
