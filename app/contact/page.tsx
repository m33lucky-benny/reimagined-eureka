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
          Fill in the form below or reach us directly on WhatsApp.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="contact-options">
        <a className="button button--primary" href={waHref} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp
        </a>
      </FadeIn>

      {/* Google Forms embed — CSP allows frame-src https://docs.google.com */}
      <FadeIn delay={0.2} className="contact-form-wrapper">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf_placeholder/viewform?embedded=true"
          width="100%"
          height="800"
          title="Contact form"
          style={{ border: 'none' }}
        >
          Loading form…
        </iframe>
      </FadeIn>
    </div>
  );
}
