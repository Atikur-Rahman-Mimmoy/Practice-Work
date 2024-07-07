import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() //store the original filename
  filename: string;

  @Column() //store the file path
  path: string;

  @Column() //store the file's MIME type
  mimetype: string;
}