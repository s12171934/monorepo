import { Module } from '@nestjs/common';
import { RepositoryModule } from '@repo/repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RepositoryModule.forRootFromEnv()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
