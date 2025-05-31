import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  async deleteFile(filename: string): Promise<void> {
    if (!filename) return;

    try {
      const filePath = join('./uploads/events', filename);
      await unlink(filePath);
      this.logger.log(`Successfully deleted file: ${filename}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${filename}`, error.stack);
      // Don't throw error as file deletion is not critical
    }
  }

  getFileUrl(filename: string): string | null {
    if (!filename) return null;
    return `/uploads/events/${filename}`;
  }
}
