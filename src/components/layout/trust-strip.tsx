import { 
  ShieldCheckIcon, 
  PackageIcon, 
  GlobeIcon, 
  AwardIcon,
  RecycleIcon,
} from 'lucide-react';

export function TrustStrip() {
  return (
    <section className="bg-accent-brown-deep py-3.5">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-white/90 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-accent-gold" />
            <span>ISO 9001:2015</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <PackageIcon className="w-4 h-4 text-accent-gold" />
            <span>Custom MOQ</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-4 h-4 text-accent-gold" />
            <span>Pan India</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <AwardIcon className="w-4 h-4 text-accent-gold" />
            <span>12+ Years Experience</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <RecycleIcon className="w-4 h-4 text-accent-gold" />
            <span>Recyclable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
