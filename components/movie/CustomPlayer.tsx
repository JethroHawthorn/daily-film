"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface CustomPlayerProps {
  hlsUrl?: string; // M3U8 link
  embedUrl: string; // Fallback
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  nextEpisodeSlug?: string;
  initialTime?: number; // From DB/History
}

export default function CustomPlayer({
  hlsUrl,
  embedUrl,
  movieSlug,
  movieTitle,
  posterUrl,
  episodeSlug,
  episodeName,
  nextEpisodeSlug,
  initialTime = 0,
}: CustomPlayerProps) {
  const router = useRouter();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { saveHistory } = useWatchHistory();

  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false); // Auto-play if possible
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(initialTime);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Load saved settings
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save progress periodically (every 10s) and on pause
  const handleProgress = useCallback((state: any) => {
    const currentTime = state.playedSeconds;
    // Only save if meaningful progress (> 10s)
    if (currentTime > 10) {
      setProgress(currentTime);
    }

    // Throttle saving to history/DB is handled implicitly by how often we might call this? 
    // ReactPlayer calls onProgress every ~1s. We shouldn't blast the DB.
    // Let's use a separate interval for DB syncing or just rely on the hook's internal logic?
    // The previous hook implementation had no throttling. We should modify this to throttle.
    // For now, let's just update local state and have a specific interval effect.
  }, []);

  // Sync to DB every 10 seconds if playing
  useEffect(() => {
    if (!playing || !ready) return;

    const interval = setInterval(() => {
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      if (currentTime > 5) {
        saveHistory({
          movieSlug,
          movieTitle,
          posterUrl,
          episodeSlug,
          episodeName,
          currentTime,
          duration: playerRef.current?.getDuration() || 0
        });
      }
    }, 10000); // 10s

    return () => clearInterval(interval);
  }, [playing, ready, movieSlug, episodeSlug, episodeName, movieTitle, posterUrl, saveHistory]);

  // Initial Seek (Resume)
  const handleReady = () => {
    setReady(true);
    if (initialTime > 0 && playerRef.current) {
      playerRef.current.seekTo(initialTime, "seconds");
    }
  };

  const handleEnded = () => {
    // Finished? Remove from history (handled by saveWatchProgress if > 95%)
    // Trigger Auto Next with a small delay for UX
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movieSlug}/${nextEpisodeSlug}`);
    }
  };

  const handleNext = () => {
    if (nextEpisodeSlug) {
      router.push(`/xem-phim/${movieSlug}/${nextEpisodeSlug}`);
    }
  };

  // ... (inside component)

  const handleError = () => {
    console.log("Video Error, falling back to iframe");
    setHasError(true);
  };

  // Timeout fallback: If not ready after 10s, fallback to iframe
  useEffect(() => {
    if (hlsUrl && !ready && !hasError) {
      const timer = setTimeout(() => {
        console.log("HLS Timeout, falling back");
        setHasError(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [hlsUrl, ready, hasError]);

  if (!mounted) {
    return <div className="aspect-video w-full bg-black rounded-lg animate-pulse" />;
  }

  // Fallback to iframe if no HLS OR if Error occurred
  if (!hlsUrl || hasError) {
    return (
      <div className="space-y-4">
        <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-video shadow-lg">
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>

        {/* Controls Bar Below Video */}
        <div className="flex items-center justify-end px-1">
          {nextEpisodeSlug && (
            <Button onClick={handleNext} className="gap-2">
              Tập tiếp theo <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-lg"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Manual Switch Button if taking too long */}
        {!ready && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto">
            <Button variant="secondary" onClick={() => setHasError(true)}>
              Chuyển ngay sang Player dự phòng
            </Button>
          </div>
        )}

        {/* @ts-ignore */}
        <ReactPlayer
          ref={playerRef}
          url={hlsUrl}
          width="100%"
          height="100%"
          playing={playing}
          controls={true}
          onReady={handleReady}
          onProgress={handleProgress}
          onEnded={handleEnded}
          onError={handleError}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          config={{
            file: {
              forceHLS: true,
              attributes: {
                controlsList: 'nodownload' // Standard controls
              }
            }
          } as any}
        />
      </div>

      {/* Controls Bar Below Video */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-muted-foreground">
          {/* Metadata or extra controls can go here */}
        </div>

        {nextEpisodeSlug && (
          <Button onClick={handleNext} className="gap-2">
            Tập tiếp theo <SkipForward className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
