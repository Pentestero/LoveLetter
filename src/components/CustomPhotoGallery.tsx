import React, { useState } from 'react';
import { Camera, X, ZoomIn, Heart } from 'lucide-react';
import { RomanticPhoto } from '../types';
import { soundEngine } from '../utils/audio';

interface CustomPhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  photos: RomanticPhoto[];
  recipientName: string;
  senderName: string;
}

export const CustomPhotoGallery: React.FC<CustomPhotoGalleryProps> = ({
  isOpen,
  onClose,
  photos,
  recipientName,
  senderName,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<RomanticPhoto | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#321B2C]/50 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FFF8F5] border border-[#F7C8D0] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 relative text-[#321B2C]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F7C8D0]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E85D75] to-[#B42345] flex items-center justify-center text-white shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg sm:text-xl font-bold text-[#B42345] flex items-center gap-2">
                <span>Nos doux souvenirs</span>
                <Heart className="w-4 h-4 text-[#E85D75] fill-[#E85D75]" />
              </h3>
              <p className="text-xs text-[#321B2C]/70">
                {recipientName} & {senderName} — nos plus beaux moments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#321B2C]/70 hover:bg-[#F7C8D0]/40 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-only gallery introduction */}
        <div className="my-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-[#321B2C]/80 font-medium">
            Touche une photo pour l'agrandir et revoir ces souvenirs 💖
          </p>
        </div>

        {/* Polaroids Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-3">
          {photos.map((photo) => {
            return (
              <div
                key={photo.id}
                onClick={() => {
                  soundEngine.playHeartPop();
                  setSelectedPhoto(photo);
                }}
                className="motion-card bg-white p-3 pb-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer border border-[#F7C8D0]/60 relative group flex flex-col justify-between"
                style={{
                  transform: `rotate(${photo.rotation}deg)`,
                }}
              >
                {/* Washi Tape Accent */}
                <div className="w-12 h-3 bg-[#F7C8D0]/80 rounded-xs mx-auto -mt-4 mb-2 shadow-xs border border-white/40" />

                {/* Photo Image Frame */}
                <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-rose-50 mb-2 border border-black/5">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                    <span className="text-[10px] text-white font-medium flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" />
                      Agrandir
                    </span>
                  </div>
                </div>

                {/* Fixed caption */}
                <div
                  className="space-y-1 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="font-script text-base text-[#321B2C] truncate px-1">
                    {photo.caption}
                  </p>
                  {photo.date && (
                    <span className="text-[10px] text-[#321B2C]/60 block font-sans">
                      {photo.date}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Lightbox / Zoom Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white p-4 pb-6 rounded-2xl max-w-lg w-full shadow-2xl relative animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="rounded-xl overflow-hidden aspect-4/3 bg-black/10 mb-3">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center space-y-1">
                <h4 className="font-script text-2xl text-[#B42345] font-semibold">
                  {selectedPhoto.caption}
                </h4>
                {selectedPhoto.date && (
                  <p className="text-xs text-[#321B2C]/70">{selectedPhoto.date}</p>
                )}
                <div className="pt-2 flex items-center justify-center gap-1 text-xs text-[#E85D75]">
                  <Heart className="w-3.5 h-3.5 fill-[#E85D75]" />
                  <span>Un précieux souvenir de {recipientName} & {senderName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-[#F7C8D0]/60 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-[#F7C8D0]/60 hover:bg-[#F7C8D0] text-[#B42345] font-semibold text-xs sm:text-sm transition-colors"
          >
            Continuer notre aventure 💌
          </button>
        </div>
      </div>
    </div>
  );
};
