"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bell } from "lucide-react";
import { toggleFavorite, toggleFollow } from "@/app/actions/user";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  movieSlug: string;
  initialIsFavorite: boolean;
  initialIsFollowed: boolean;
}

export default function ActionButtons({
  movieSlug,
  initialIsFavorite,
  initialIsFollowed,
}: ActionButtonsProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const [isPending, startTransition] = useTransition();

  const handleFavorite = () => {
    // Optimistic update
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    startTransition(async () => {
      const result = await toggleFavorite(movieSlug);
      if (result.error) {
        // Revert on error
        setIsFavorite(!nextState);
      }
    });
  };

  const handleFollow = () => {
    // Optimistic update
    const nextState = !isFollowed;
    setIsFollowed(nextState);

    startTransition(async () => {
      const result = await toggleFollow(movieSlug);
      if (result.error) {
        setIsFollowed(!nextState);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={isFavorite ? "secondary" : "outline"}
        size="sm"
        onClick={handleFavorite}
        disabled={isPending}
        className={cn(
          "gap-2 transition-colors",
          isFavorite && "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-500"
        )}
      >
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        {isFavorite ? "Đã thích" : "Yêu thích"}
      </Button>

      <Button
        variant={isFollowed ? "secondary" : "outline"}
        size="sm"
        onClick={handleFollow}
        disabled={isPending}
        className={cn(
          "gap-2 transition-colors",
          isFollowed && "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-500"
        )}
      >
        <Bell className={cn("h-4 w-4", isFollowed && "fill-current")} />
        {isFollowed ? "Đang theo dõi" : "Theo dõi"}
      </Button>
    </div>
  );
}
