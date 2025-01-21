import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UnitModule } from './unit/unit.module';
import { PositionModule } from './position/position.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, UnitModule, PositionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
