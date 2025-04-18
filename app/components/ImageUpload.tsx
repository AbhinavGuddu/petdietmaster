import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsUpload, BsCamera } from 'react-icons/bs';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    disabled: isLoading,
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <BsUpload className="w-6 h-6 text-gray-400" />
            <BsCamera className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop your image here' : 'Upload a pet food image'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageUpload; 