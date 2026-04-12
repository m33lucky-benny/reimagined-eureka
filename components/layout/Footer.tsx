import Image from 'next/image';
import { socialLinks } from '@/data/settings';

const socialEntries = Object.entries(socialLinks) as [string, string][];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {socialEntries.map(([key, url]) =>
          url.startsWith('mailto:') ? (
            <a
              key={key}
              href={url}
              className="footer-link"
              aria-label={key}
            >
              <Image
                src={`/assets/footer/${key}.svg`}
                alt={key}
                className="footer-icon"
                width={24}
                height={24}
              />
            </a>
          ) : (
            <a
              key={key}
              href={url}
              className="footer-link"
              aria-label={key}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={`/assets/footer/${key}.svg`}
                alt={key}
                className="footer-icon"
                width={24}
                height={24}
              />
            </a>
          ),
        )}
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Ebiya.sg
        </p>
      </div>
    </footer>
  );
}
