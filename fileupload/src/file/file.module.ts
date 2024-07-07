
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([File])],// Register the File entity with TypeORM for dependency injection in this module
  providers: [FileService],                   // Register the FileService as a provider (injectable service)
  controllers: [FileController],              // Register the FileController to handle incoming requests
})
export class FileModule {}
