
import { Injectable,HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { MulterFile } from './multer-file.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)    // Inject the File repository to interact with the database
    private readonly fileRepository: Repository<File>,
  ) {}

  async saveFiles(files: MulterFile[]): Promise<File[]> {  // Save multiple files to the database
    try {
      // Map each Multer file to a File entity
    const savedFiles = files.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    }));
    console.log('Saving files:', savedFiles);
    return this.fileRepository.save(savedFiles);
  }catch (error) {
    console.error('Error saving files:', error);
    throw error;
  }
 }

  async findAll(): Promise<File[]> { // Retrieve all files from the database
    return this.fileRepository.find();
  }

  async findByFilename(filename: string): Promise<File> {
    return this.fileRepository.findOne({ where: { filename } });
  }
  
}
