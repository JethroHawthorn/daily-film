"use server";

import { db } from "@/lib/db";
import { getAnonymousId, getOrCreateAnonymousId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Toggle Favorite for a movie
 */
export async function toggleFavorite(movieSlug: string) {
  try {
    const userId = await getOrCreateAnonymousId();
    
    // Check if exists
    const existing = await db.execute({
      sql: "SELECT id FROM favorites WHERE user_id = ? AND movie_slug = ?",
      args: [userId, movieSlug]
    });
    
    if (existing.rows.length > 0) {
      // Remove
      await db.execute({
          sql: "DELETE FROM favorites WHERE user_id = ? AND movie_slug = ?",
          args: [userId, movieSlug]
      });
      return { isFavorite: false };
    } else {
      // Add
      await db.execute({
          sql: "INSERT INTO favorites (id, user_id, movie_slug, created_at) VALUES (?, ?, ?, ?)",
          args: [crypto.randomUUID(), userId, movieSlug, Date.now()]
      });
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return { error: true };
  }
}

/**
 * Toggle Follow for a movie
 */
export async function toggleFollow(movieSlug: string) {
  try {
    const userId = await getOrCreateAnonymousId();
    
    const existing = await db.execute({
      sql: "SELECT id FROM follows WHERE user_id = ? AND movie_slug = ?",
      args: [userId, movieSlug]
    });
    
    if (existing.rows.length > 0) {
      // Unfollow
      await db.execute({
          sql: "DELETE FROM follows WHERE user_id = ? AND movie_slug = ?",
          args: [userId, movieSlug]
      });
      return { isFollowed: false };
    } else {
      // Follow
      await db.execute({
          sql: "INSERT INTO follows (id, user_id, movie_slug, created_at) VALUES (?, ?, ?, ?)",
          args: [crypto.randomUUID(), userId, movieSlug, Date.now()]
      });
      return { isFollowed: true };
    }
  } catch (error) {
    console.error("toggleFollow error:", error);
    return { error: true };
  }
}

/**
 * Get User Stats for a movie (isFavorite, isFollowed)
 */
export async function getUserStats(movieSlug: string) {
  try {
    const userId = await getAnonymousId();
    if (!userId) return { isFavorite: false, isFollowed: false };

    const [favResult, followResult] = await Promise.all([
      db.execute({
        sql: "SELECT id FROM favorites WHERE user_id = ? AND movie_slug = ?",
        args: [userId, movieSlug]
      }),
      db.execute({
        sql: "SELECT id FROM follows WHERE user_id = ? AND movie_slug = ?",
        args: [userId, movieSlug]
      })
    ]);

    return {
      isFavorite: favResult.rows.length > 0,
      isFollowed: followResult.rows.length > 0
    };
  } catch (error) {
    console.error("getUserStats error:", error);
    return { isFavorite: false, isFollowed: false };
  }
}

/**
 * Get User's Library (slugs only)
 */
export async function getUserLibrary() {
  try {
    const userId = await getAnonymousId();
    if (!userId) return { favorites: [], follows: [] };

    const [favResult, followResult] = await Promise.all([
      db.execute({
        sql: "SELECT movie_slug FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
        args: [userId]
      }),
      db.execute({
        sql: "SELECT movie_slug FROM follows WHERE user_id = ? ORDER BY created_at DESC",
        args: [userId]
      })
    ]);

    return {
      favorites: favResult.rows.map(r => r.movie_slug as string),
      follows: followResult.rows.map(r => r.movie_slug as string)
    };
  } catch (error) {
    console.error("getUserLibrary error:", error);
    return { favorites: [], follows: [] };
  }
}
