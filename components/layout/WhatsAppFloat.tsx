import Image from 'next/image';
import { siteConfig } from '@/data/settings';

/** Floating WhatsApp button — only rendered when whatsapp.enabled is true */
export function WhatsAppFloat() {
  if (!siteConfig.whatsapp.enabled) return null;

  const { phone, message } = siteConfig.whatsapp;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/assets/icon/wp.svg"
        alt="WhatsApp"
        width={50}
        height={50}
      />
    </a>
  );
}
