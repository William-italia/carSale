import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import accessConfig from './config/access.config';
import refreshConfig from './config/refresh.config';

@Module({
  imports: [
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(accessConfig),
    JwtModule.register({}),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard, ConfigModule, JwtModule],
})
export class SecurityModule {}
