"use server";

import { db } from "@/lib/db";
import { getMovieDetail } from "@/lib/ophim";
import { revalidatePath } from "next/cache";

/**
 * Log a movie event (play / finish)
 */
export async function logMovieEvent(username: string, movieSlug: string, eventType: "play" | "finish") {
  try {
    if (!username) return { success: false };

    // Simple dedupe by hour using username
    // const eventId = `${username}-${movieSlug}-${eventType}-${new Date().toISOString().slice(0, 13)}`; 

    await db.execute({
      sql: `INSERT INTO movie_events (id, movie_slug, event_type, created_at) VALUES (?, ?, ?, ?)`,
      args: [crypto.randomUUID(), movieSlug, eventType, Date.now()]
    });

    return { success: true };
  } catch (error) {
    console.error("logMovieEvent error:", error);
    return { success: false };
  }
}

export interface TrendingMovie {
  movieSlug: string;
  score: number;
  movieData?: any; // Populated from API
}

/**
 * Get trending movies based on window
 * window: 'day' (24h) | 'week' (7d)
 */
export async function getTrendingMovies(window: 'day' | 'week' = 'day') {
  try {
    const now = Date.now();
    const windowMs = window === 'day' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const since = now - windowMs;

    // Aggregation Query
    // Score: Play = 1, Finish = 2
    const result = await db.execute({
      sql: `
        SELECT movie_slug, 
               SUM(CASE WHEN event_type = 'play' THEN 1 
                        WHEN event_type = 'finish' THEN 2 
                        ELSE 0 END) as score
        FROM movie_events
        WHERE created_at > ?
        GROUP BY movie_slug
        ORDER BY score DESC
        LIMIT 10
      `,
      args: [since]
    });

    const trendingList: TrendingMovie[] = result.rows.map(row => ({
      movieSlug: row.movie_slug as string,
      score: row.score as number
    }));

    if (trendingList.length === 0) return [];

    // Enrich with Movie Data from API
    // We fetch details for each slug. In a real app, we might have a movie cache DB.
    // Here we use the existing API wrapper.
    const enrichedList = await Promise.all(
      trendingList.map(async (item) => {
        try {
            // Optimally, getLatestMovies or search might be faster if we could filter by slugs,
            // but the API doesn't support 'get by multiple slugs'.
            // So we fetch detail.
            const data = await getMovieDetail(item.movieSlug);
            return {
                ...item,
                movieData: data?.movie || null
            };
        } catch (e) {
            return { ...item, movieData: null };
        }
      })
    );

    // Filter out ones that failed to load
    return enrichedList.filter(item => item.movieData !== null);

  } catch (error) {
    console.error("getTrendingMovies error:", error);
    return [];
  }
}
