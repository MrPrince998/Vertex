import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConverterModule } from "./modules/converter/converter.module";
import { FilesModule } from './modules/files/files.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [ConverterModule, FilesModule, JobsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
