"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SkipForward, Maximize, Minimize } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { logMovieEvent } from "@/app/actions/analytics";

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

    // Log 'play' event after 30 seconds
    const timer = setTimeout(() => {
      const username = localStorage.getItem("username");
      if (username) {
        logMovieEvent(username, movieSlug, "play").catch(err => console.error("Event log failed", err));
      }
    }, 30000);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      clearTimeout(timer);
    };
  }, [movieSlug]);

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

        {/* Overlays - Bottom Right */}
        <div className={cn(
          "absolute bottom-1 right-40 transition-opacity duration-300",
          isFullscreen
            ? (showControls ? "opacity-100" : "opacity-0")
            : "opacity-0 group-hover:opacity-100"
        )}>
          {nextEpisodeSlug && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleNext} variant="ghost" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tập tiếp theo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="absolute bottom-1 right-[15px] z-10">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleFullscreen} variant="ghost" size="icon">
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thu phóng</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Controls Bar Below Video (Hidden in fullscreen via CSS or just naturally hidden if container is FS) */}
      {/* Controls Bar Below Video */}
      <div className={cn("flex items-center justify-end px-1", isFullscreen && "hidden")}>
        <span className="text-xs text-muted-foreground mr-auto">
          Nếu không xem được, hãy thử đổi Server khác hoặc reload lại trang.
        </span>
      </div>
    </div >
  );
}
