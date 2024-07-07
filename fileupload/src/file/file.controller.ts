
import { Controller, Post, UseInterceptors, UploadedFiles, Get,HttpStatus, HttpException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { MulterFile } from './multer-file.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: diskStorage({
      destination: './uploads',   // Directory to store uploaded files
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);// Generate a unique suffix
        const ext = extname(file.originalname); // Get the file extension
        callback(null, `${uniqueSuffix}${ext}`); // Combine unique suffix with file extension for the filename
      },
    }),
  }))
  async uploadFiles(@UploadedFiles() files: MulterFile[]) {
    try {
        if (!files || files.length === 0) { // Check if files are provided
          throw new HttpException('No files provided', HttpStatus.BAD_REQUEST);
        }
        console.log('Files received:', files);
        const savedFiles = await this.fileService.saveFiles(files);// Save the files using the FileService
        console.log('Files saved:', savedFiles);
        if (savedFiles.length > 0) {
          return { message: 'Upload successful', files: savedFiles };
        } else {
          throw new HttpException('No files were saved', HttpStatus.BAD_REQUEST);
        }
      } catch (error) {
        console.error('Upload error:', error);
        throw new HttpException('Invalid upload', HttpStatus.BAD_REQUEST);
      }
    }
    
  @Get('all')
  async getAllFiles() {
    return this.fileService.findAll();// Return all files stored in the database
  }
}
