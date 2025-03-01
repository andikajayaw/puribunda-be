import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule untuk akses database
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
