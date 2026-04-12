import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/FadeIn';
import { siteConfig } from '@/data/settings';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ebiya.sg for Caridina shrimp, custom tank setups, and expert advice.',
};

export default function ContactPage() {
  const waHref = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent('Hi, I would like to enquire about shrimp / tank setup.')}`;

  return (
    <div className="page contact-page">
      <FadeIn>
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Have questions about shrimp, tank setups, or membership? We&apos;d love to hear from you.
          Reach us directly on WhatsApp for the fastest response.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="contact-options">
        <a className="button button--primary" href={waHref} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp
        </a>
      </FadeIn>

      <FadeIn delay={0.2} className="contact-details">
        <div className="contact-info">
          <p><strong>Phone / WhatsApp:</strong> +65 8900 2228</p>
          <p><strong>Email:</strong> <a href={`mailto:${siteConfig.business.email}`}>{siteConfig.business.email}</a></p>
          <p><strong>Address:</strong> {siteConfig.business.address}</p>
          <p><strong>Hours:</strong> {siteConfig.business.openingHours}</p>
        </div>
      </FadeIn>
    </div>
  );
}
