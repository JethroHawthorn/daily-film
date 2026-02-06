"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SkipForward, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    setMounted(true);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const handleInteraction = () => {
    if (!isFullscreen) return;

    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Auto-hide after 3s
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Reset interaction timer when entering fullscreen
  useEffect(() => {
    if (isFullscreen) {
      handleInteraction();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  }, [isFullscreen]);

  const handleNext = () => {
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movieSlug}/${nextEpisodeSlug}`);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!mounted) {
    return <div className="aspect-video w-full bg-black rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full bg-black shadow-lg group overflow-hidden",
          isFullscreen ? "h-screen w-screen rounded-none" : "aspect-video rounded-lg"
        )}
        onMouseMove={handleInteraction}
        onClick={handleInteraction}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          // allowFullScreen removed to force use of custom wrapper
          title={`Xem phim ${movieSlug}`}
        />

        {/* Overlays - Top Right */}
        <div className={cn(
          "absolute top-4 right-4 z-10 flex gap-2 transition-opacity duration-300",
          isFullscreen
            ? (showControls ? "opacity-100" : "opacity-0")
            : "opacity-0 group-hover:opacity-100"
        )}>
          {nextEpisodeSlug && (
            <Button onClick={handleNext} variant="secondary" size="sm" className="bg-black/50 hover:bg-black/70 text-white backdrop-blur border border-white/10 shadow-md">
              Tập tiếp theo <SkipForward className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Button onClick={toggleFullscreen} variant="secondary" size="icon" className="h-9 w-9 bg-black/50 hover:bg-black/70 text-white backdrop-blur border border-white/10 shadow-md">
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Controls Bar Below Video (Hidden in fullscreen via CSS or just naturally hidden if container is FS) */}
      {/* Controls Bar Below Video */}
      <div className={cn("flex items-center justify-end px-1", isFullscreen && "hidden")}>
        <span className="text-xs text-muted-foreground mr-auto">
          Nếu không xem được, hãy thử đổi Server khác hoặc reload lại trang.
        </span>
      </div>
    </div>
  );
}
