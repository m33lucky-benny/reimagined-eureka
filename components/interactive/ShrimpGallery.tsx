'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ShrimpImage {
  src: string;
  alt: string;
  name: string;
}

interface ShrimpGalleryProps {
  images: ShrimpImage[];
}

export function ShrimpGallery({ images }: ShrimpGalleryProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
    }
    if (lightboxSrc) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxSrc, closeLightbox]);

  if (images.length === 0) {
    return (
      <p className="gallery-empty">
        No shrimp photos available yet. Check back soon!
      </p>
    );
  }

  return (
    <>
      <div className="shrimp-gallery" id="shrimpGallery">
        {images.map((img) => (
          <figure
            key={img.src}
            className="shrimp-item"
            onClick={() => {
              setLightboxSrc(img.src);
              setLightboxAlt(img.alt);
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={160}
              height={160}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
            <figcaption>{img.name}</figcaption>
          </figure>
        ))}
      </div>

      {lightboxSrc && (
        <div
          className="shrimp-lightbox open"
          id="shrimpLightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Shrimp image viewer"
          onClick={closeLightbox}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxSrc} alt={lightboxAlt} id="lightboxImage" onClick={(e) => e.stopPropagation()} />
          <button
            className="lightbox-close"
            id="lightboxClose"
            aria-label="Close image viewer"
            onClick={closeLightbox}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <p className="lightbox-hint">Click anywhere or press Esc to close</p>
        </div>
      )}
    </>
  );
}
