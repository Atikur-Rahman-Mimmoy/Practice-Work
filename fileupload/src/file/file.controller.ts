
import { Controller, Post, UseInterceptors, UploadedFiles, Get,HttpStatus, HttpException, Res, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { MulterFile } from './multer-file.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { File } from './file.entity';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as FormData from 'form-data';

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


    fileFilter: (req, file, callback) => {
      // Accept images only
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
      }
      callback(null, true);
    },
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

  
  // @Get('all')
  // async getAllFiles(@Res() res: Response) {
  //   const files = await this.fileService.findAll();

  //   const imagePromises = files.map(async (file) => {
  //     return new Promise<void>((resolve, reject) => {
  //       res.write('<img src="data:image/jpeg;base64,' + fs.readFileSync(file.path, { encoding: 'base64' }) + '" />');
  //       resolve();
  //     });
  //   });

  //   await Promise.all(imagePromises);
  //   res.end();
  // }


  @Get('view/:filename')
  async viewImage(@Param('filename') filename: string, @Res() res: Response) {
    const file: File = await this.fileService.findByFilename(filename);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(file.path, { root: './' });
  } 


}
