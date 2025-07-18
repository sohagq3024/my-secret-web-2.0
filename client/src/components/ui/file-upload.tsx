import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileImage, 
  FileVideo, 
  FileAudio,
  File,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  uploadMultipleFiles,
  validateFile,
  formatFileSize,
  FileUploadResult,
  UploadProgress,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  ACCEPTED_AUDIO_TYPES,
  MAX_FILE_SIZE
} from '@/lib/fileUpload';

interface FileUploadProps {
  accept?: 'image' | 'video' | 'audio' | 'all';
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onUpload: (files: FileUploadResult[]) => void;
  onRemove?: (index: number) => void;
  currentFiles?: FileUploadResult[];
  className?: string;
}

export function FileUpload({
  accept = 'all',
  multiple = false,
  maxFiles = 5,
  maxSize = MAX_FILE_SIZE,
  onUpload,
  onRemove,
  currentFiles = [],
  className = ''
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getAcceptedTypes = () => {
    switch (accept) {
      case 'image':
        return ACCEPTED_IMAGE_TYPES;
      case 'video':
        return ACCEPTED_VIDEO_TYPES;
      case 'audio':
        return ACCEPTED_AUDIO_TYPES;
      default:
        return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES, ...ACCEPTED_AUDIO_TYPES];
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const types = getAcceptedTypes();
      const isValidType = validateFile(file, types);
      const isValidSize = file.size <= maxSize;
      
      if (!isValidType) {
        console.warn(`File ${file.name} has invalid type`);
        return false;
      }
      
      if (!isValidSize) {
        console.warn(`File ${file.name} exceeds size limit`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Limit files based on maxFiles and current files
    const remainingSlots = maxFiles - currentFiles.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    setIsUploading(true);
    setUploadProgress([]);

    try {
      const results = await uploadMultipleFiles(filesToUpload, (progress) => {
        setUploadProgress(prev => {
          const existing = prev.find(p => p.fileName === progress.fileName);
          if (existing) {
            return prev.map(p => 
              p.fileName === progress.fileName ? progress : p
            );
          } else {
            return [...prev, progress];
          }
        });
      });

      onUpload(results);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
    }
  }, [accept, maxSize, maxFiles, currentFiles.length, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedTypes().reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple,
    maxFiles,
    maxSize,
    disabled: isUploading
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="w-8 h-8" />;
    if (fileType.startsWith('video/')) return <FileVideo className="w-8 h-8" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const getProgressIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <div className="rounded-full bg-muted p-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">
              {isDragActive ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop files here, or click to select files
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">
                {accept === 'all' ? 'All files' : accept}
              </Badge>
              <Badge variant="outline">
                Max {formatFileSize(maxSize)}
              </Badge>
              <Badge variant="outline">
                Up to {maxFiles} files
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploadProgress.map((progress, index) => (
              <Card key={progress.fileName} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {getProgressIcon(progress.status)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{progress.fileName}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(progress.progress)}%
                        </span>
                      </div>
                      <Progress value={progress.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({currentFiles.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentFiles.map((file, index) => (
              <motion.div
                key={`${file.fileName}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="relative overflow-hidden group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {file.fileType.startsWith('image/') ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={file.url} 
                            alt={file.fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          {getFileIcon(file.fileType)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.fileSize)}
                        </p>
                      </div>
                      {onRemove && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemove(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}