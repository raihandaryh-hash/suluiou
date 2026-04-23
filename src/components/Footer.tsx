import { Instagram, Globe, GraduationCap } from 'lucide-react';
import { IOU_INSTAGRAM_URL, IOU_WEBSITE_URL, IOU_REGISTRATION_URL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50 mt-16">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} IOU Indonesia · Sulu</p>
        <div className="flex items-center gap-5">
          <a
            href={IOU_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
            aria-label="Website IOU Indonesia"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Website</span>
          </a>
          <a
            href={IOU_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
            aria-label="Daftar kuliah IOU"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Daftar Kuliah</span>
          </a>
          <a
            href={IOU_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
            aria-label="Instagram IOU Indonesia"
          >
            <Instagram className="h-4 w-4" />
            <span className="hidden sm:inline">@iouindonesia</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
