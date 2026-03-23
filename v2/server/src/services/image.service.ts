import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';

export class ImageService {
  private static readonly UPLOADS_DIR = 'uploads/photos';
  private static readonly THUMBNAILS_DIR = 'uploads/photos/thumbnails';

  static async validateImage(buffer: Buffer): Promise<boolean> {
    const type = await fileTypeFromBuffer(buffer);
    if (!type) return false;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    return allowedTypes.includes(type.mime);
  }

  static async processImage(buffer: Buffer, originalFilename: string): Promise<{ url: string; thumbnail: string }> {
    // Ensure directories exist
    await fs.mkdir(this.UPLOADS_DIR, { recursive: true });
    await fs.mkdir(this.THUMBNAILS_DIR, { recursive: true });

    const filename = `${path.parse(originalFilename).name}-${Date.now()}.webp`;
    const fullPath = path.join(this.UPLOADS_DIR, filename);
    const thumbPath = path.join(this.THUMBNAILS_DIR, filename);

    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Check minimum resolution (900x900)
    if ((metadata.width || 0) < 900 || (metadata.height || 0) < 900) {
      throw new Error('Низкое качество изображения. Минимум 900x900 px.');
    }

    // Process original: Clean EXIF, resize if too large, convert to WEBP
    await image
      .rotate() // Auto-rotate based on EXIF before stripping it
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fullPath);

    // Process thumbnail: 400x300
    await sharp(buffer)
      .rotate()
      .resize(400, 300, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    return {
      url: `/uploads/photos/${filename}`,
      thumbnail: `/uploads/photos/thumbnails/${filename}`
    };
  }

  static async deleteImage(url: string): Promise<void> {
    try {
      const filename = path.basename(url);
      const fullPath = path.join(this.UPLOADS_DIR, filename);
      const thumbPath = path.join(this.THUMBNAILS_DIR, filename);

      await fs.unlink(fullPath).catch(() => {});
      await fs.unlink(thumbPath).catch(() => {});
    } catch (error) {
           console.error('Delete image error:', error);
    }
  }
}
