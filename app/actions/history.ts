"use server";

import { db } from "@/lib/db";
import { getAnonymousId, getOrCreateAnonymousId } from "@/lib/auth";
import { WatchHistoryItem } from "@/types/history";
import { revalidatePath } from "next/cache";

// Type matches payload from Player
export interface WatchProgressInput {
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  currentTime: number;
  duration?: number;
}

export async function saveWatchProgress(data: WatchProgressInput) {
  try {
    const userId = await getOrCreateAnonymousId();
    
    // Ensure user exists (idempotent ignore)
    // We could do INSERT OR IGNORE, but Turso/SQLite upsert for user might be overkill if we just assume.
    // However, FK constraint requires user to exist. 
    // Let's optimize: try insert user if not exists first.
    
    // Check if user exists or just insert ignore
    await db.execute({
        sql: `INSERT OR IGNORE INTO users (id, created_at) VALUES (?, ?)`,
        args: [userId, Date.now()]
    });

    const now = Date.now();
    
    // Upsert progress
    // If finished (progress > 95% and duration > 0), remove it?
    // User requested: "Remove when finished (>= 95%)"
    if (data.duration && data.duration > 0 && (data.currentTime / data.duration) >= 0.95) {
        await removeWatchProgress(data.movieSlug);
        return { success: true, removed: true };
    }

    await db.execute({
      sql: `
        INSERT INTO watch_progress (
          user_id, movie_slug, episode_slug, current_time, updated_at,
          movie_title, poster_url, episode_name, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, movie_slug) DO UPDATE SET
          episode_slug = excluded.episode_slug,
          current_time = excluded.current_time,
          updated_at = excluded.updated_at,
          episode_name = excluded.episode_name
      `,
      args: [
        userId,
        data.movieSlug,
        data.episodeSlug,
        data.currentTime,
        now,
        data.movieTitle,
        data.posterUrl,
        data.episodeName,
        data.duration || 0
      ]
    });

    revalidatePath("/"); // Update home page list
    return { success: true };
  } catch (error) {
    console.error("saveWatchProgress error:", error);
    // Fail silently as requested for client, but return false for debug
    return { success: false };
  }
}

export async function getContinueWatching() {
  try {
    const userId = await getAnonymousId();
    if (!userId) return [];
    
    const result = await db.execute({
      sql: `
        SELECT movie_slug, movie_title, poster_url, episode_slug, episode_name, current_time, updated_at, duration
        FROM watch_progress
        WHERE user_id = ?
        ORDER BY updated_at DESC
        LIMIT 10
      `,
      args: [userId]
    });

    return result.rows.map(row => ({
      movieSlug: row.movie_slug as string,
      movieTitle: row.movie_title as string,
      posterUrl: row.poster_url as string,
      episodeSlug: row.episode_slug as string,
      episodeName: row.episode_name as string,
      currentTime: row.current_time as number,
      updatedAt: row.updated_at as number,
      duration: row.duration as number
    })) as WatchHistoryItem[];

  } catch (error) {
    console.error("getContinueWatching error:", error);
    return [];
  }
}

export async function removeWatchProgress(movieSlug: string) {
    try {
        const userId = await getAnonymousId();
        if (!userId) return { success: true }; // No user, nothing to delete
        await db.execute({
            sql: "DELETE FROM watch_progress WHERE user_id = ? AND movie_slug = ?",
            args: [userId, movieSlug]
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("removeWatchProgress error:", error);
        return { success: false };
    }
}
