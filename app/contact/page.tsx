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
          Have questions about shrimp, tank setups, or membership? Reach us on WhatsApp for the
          fastest response, or fill in the form below.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="contact-options">
        <a className="button button--primary" href={waHref} target="_blank" rel="noopener noreferrer">
          Chat on WhatsApp
        </a>
      </FadeIn>

      {/* Netlify Forms — processed at build time, no JS or third party needed */}
      <FadeIn delay={0.2} className="contact-form-wrapper">
        <form
          name="contact"
          method="POST"
          action="/thank-you"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="contact-form"
        >
          {/* Required hidden fields for Netlify */}
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Do not fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject" name="subject" required>
              <option value="">Select a topic…</option>
              <option value="shrimp">Shrimp enquiry</option>
              <option value="tank">Tank setup</option>
              <option value="membership">Membership</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us what you need…"
              required
            />
          </div>

          <button type="submit" className="button button--primary submit-btn">
            Send Message
          </button>
        </form>
      </FadeIn>

      <FadeIn delay={0.3} className="contact-details">
        <div className="contact-info">
          <p><strong>Phone / WhatsApp:</strong> +65 6042 5590</p>
          <p><strong>Email:</strong> <a href={`mailto:${siteConfig.business.email}`}>{siteConfig.business.email}</a></p>
          <p><strong>Address:</strong> {siteConfig.business.address}</p>
          <p><strong>Hours:</strong> {siteConfig.business.openingHours}</p>
        </div>
      </FadeIn>
    </div>
  );
}
