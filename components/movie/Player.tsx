"use client";

import { cn } from "@/lib/utils";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { useEffect } from "react";

interface PlayerProps {
  url: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
}

export default function Player({
  url,
  movieSlug,
  movieTitle,
  posterUrl,
  episodeSlug,
  episodeName
}: PlayerProps) {
  const { saveHistory } = useWatchHistory();

  useEffect(() => {
    // Save history immediately when player loads
    saveHistory({
      movieSlug,
      movieTitle,
      posterUrl,
      episodeSlug,
      episodeName,
      currentTime: 0, // iframe limitation
    });

    // Also could save on unmount if we had real progress tracking
  }, [movieSlug, movieTitle, posterUrl, episodeSlug, episodeName, saveHistory]); // Re-run if episode changes

  return (
    <div className={cn("relative w-full overflow-hidden rounded-lg bg-black aspect-video shadow-lg")}>
      <iframe
        src={url}
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

