import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.heic']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  return (
    <motion.div 
      className="h-[30vh] m-4 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        {...getRootProps()}
        className={`
          w-full max-w-2xl p-8 rounded-xl border-2 border-dashed 
          border-[#00F0FF] bg-black/20 cursor-pointer
          transition-all duration-300 relative overflow-hidden
          ${isDragActive ? 'border-opacity-100 scale-105' : 'border-opacity-50 hover:border-opacity-100'}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={preview} 
              alt="Car preview" 
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))' }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-xl font-orbitron text-white">
                Click or drop to change image
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Upload 
              size={64}
              className={`
                mb-4 text-[#00F0FF]
                ${isDragActive ? 'animate-bounce' : 'animate-pulse'}
              `}
            />
            <p className="text-xl font-orbitron text-white mb-2">
              {isDragActive ? 'Drop your car image here' : 'Drop your car image here or click to upload'}
            </p>
            <p className="text-sm text-gray-400">
              Supported formats: JPG, PNG, HEIC (max 20MB)
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadZone;