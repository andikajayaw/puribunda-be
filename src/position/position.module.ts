import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule untuk akses database
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
