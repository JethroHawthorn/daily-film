"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";

interface CustomPlayerProps {
  hlsUrl?: string; // Kept for compatibility but unused
  embedUrl: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  nextEpisodeSlug?: string;
  initialTime?: number; // Kept for compatibility but unused
}

export default function CustomPlayer({
  embedUrl,
  movieSlug,
  nextEpisodeSlug,
}: CustomPlayerProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movieSlug}/${nextEpisodeSlug}`);
    }
  };

  if (!mounted) {
    return <div className="aspect-video w-full bg-black rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-video shadow-lg group">
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          title={`Xem phim ${movieSlug}`}
        />

        {/* Next Episode Button (Overlay) - Top Right to avoid controls */}
        {nextEpisodeSlug && (
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button onClick={handleNext} variant="secondary" size="sm" className="bg-black/50 hover:bg-black/70 text-white backdrop-blur border border-white/10 shadow-md">
              Tập tiếp theo <SkipForward className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
