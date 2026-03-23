import imageCompression from 'browser-image-compression';

/**
 * Utility for client-side image compression using browser-image-compression.
 * Standardizes images to max 1MB and 1920px width/height.
 */
export const compressImage = async (file: File): Promise<File> => {
  // Only compress images
  if (!file.type.startsWith('image/')) return file;
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`[Compression] ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return file;
  }
};

/**
 * Converts a File object to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Combined utility to compress and convert to base64.
 */
export const compressAndConvertImage = async (file: File): Promise<string> => {
  const compressed = await compressImage(file);
  return await fileToBase64(compressed);
};
