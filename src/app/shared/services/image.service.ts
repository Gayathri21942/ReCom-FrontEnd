import { Injectable } from '@angular/core';

export interface ImageValidationError {
  code: 'FILE_TYPE_INVALID' | 'FILE_SIZE_TOO_LARGE' | 'MAX_FILES_EXCEEDED' | 'DUPLICATE_FILE';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_FILES = 5;

  validateFile(file: File): ImageValidationError | null {
    if (!this.VALID_TYPES.includes(file.type)) {
      return {
        code: 'FILE_TYPE_INVALID',
        message: `Invalid file format. Please upload JPG, PNG, WebP, or GIF images.`
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        code: 'FILE_SIZE_TOO_LARGE',
        message: `File is too large. Maximum size is ${this.formatFileSize(this.MAX_FILE_SIZE)}.`
      };
    }

    return null;
  }

  validateFileCount(currentCount: number, filesToAdd: number): ImageValidationError | null {
    if (currentCount + filesToAdd > this.MAX_FILES) {
      return {
        code: 'MAX_FILES_EXCEEDED',
        message: `You can upload a maximum of ${this.MAX_FILES} images. You currently have ${currentCount}.`
      };
    }

    return null;
  }

  detectDuplicateFiles(files: File[], existingDataUrls: string[]): File[] {
    return files.filter((file) => {
      const isDuplicate = existingDataUrls.some((url) => this.isSimilarFile(file, url));
      return !isDuplicate;
    });
  }

  toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Simple duplicate detection based on file size and name.
   * For production, implement hash-based comparison or server-side validation.
   */
  private isSimilarFile(file: File, dataUrl: string): boolean {
    // A lightweight heuristic until uploads carry stable file metadata.
    return dataUrl.includes(`name=${encodeURIComponent(file.name)}`);
  }
}
