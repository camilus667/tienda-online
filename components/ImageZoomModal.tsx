import React from 'react';
import { X } from 'lucide-react';

interface ImageZoomModalProps {
  imageUrl?: string;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>
      <div className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img 
            src={imageUrl} 
            alt="Vista ampliada" 
            className="max-w-full max-h-screen object-contain" 
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'; 
                alert('Error al cargar la imagen ampliada.');
            }} 
        />
      </div>
    </div>
  );
};

export default ImageZoomModal;