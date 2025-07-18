// File upload utility for handling cloud storage uploads
export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

// Price categories for content
export const priceCategories = [
  { value: 'free', label: 'Free', price: 0 },
  { value: 'bdt_150', label: 'BDT 150', price: 150 },
  { value: 'bdt_250', label: 'BDT 250', price: 250 },
  { value: 'bdt_500', label: 'BDT 500', price: 500 },
  { value: 'bdt_1000', label: 'BDT 1000', price: 1000 },
  { value: 'bdt_2000', label: 'BDT 2000', price: 2000 },
];

export function getPriceLabelFromCategory(category: string): string {
  const found = priceCategories.find(c => c.value === category);
  return found ? found.label : 'Free';
}

export function getPriceFromCategory(category: string): number {
  const found = priceCategories.find(c => c.value === category);
  return found ? found.price : 0;
}

// Simulated cloud upload function
export async function uploadToCloud(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileUploadResult> {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}_${file.name}`;
    let progress = 0;
    
    const simulateProgress = () => {
      progress += Math.random() * 20 + 10;
      if (progress > 100) progress = 100;
      
      if (onProgress) {
        onProgress({
          fileName: file.name,
          progress,
          status: progress === 100 ? 'completed' : 'uploading'
        });
      }
      
      if (progress >= 100) {
        // Simulate successful upload by creating a blob URL
        const url = URL.createObjectURL(file);
        resolve({
          url,
          fileName,
          fileSize: file.size,
          fileType: file.type
        });
      } else {
        setTimeout(simulateProgress, 100 + Math.random() * 200);
      }
    };
    
    // Start upload simulation
    setTimeout(simulateProgress, 100);
  });
}

export async function uploadMultipleFiles(
  files: File[],
  onProgress?: (progress: UploadProgress) => void
): Promise<FileUploadResult[]> {
  const results: FileUploadResult[] = [];
  
  for (const file of files) {
    try {
      const result = await uploadToCloud(file, onProgress);
      results.push(result);
    } catch (error) {
      console.error('Upload failed for file:', file.name, error);
      if (onProgress) {
        onProgress({
          fileName: file.name,
          progress: 100,
          status: 'error'
        });
      }
    }
  }
  
  return results;
}

// File validation utilities
export function validateFile(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some(type => {
    if (type === 'image') {
      return file.type.startsWith('image/');
    }
    if (type === 'video') {
      return file.type.startsWith('video/');
    }
    if (type === 'audio') {
      return file.type.startsWith('audio/');
    }
    return file.type === type;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Content type constants
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ACCEPTED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB