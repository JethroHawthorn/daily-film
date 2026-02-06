import { getUserLibrary } from "@/app/actions/user";
import { getMovieDetail, OPHIM_IMAGE_URL } from "@/lib/ophim";
import MovieCard from "@/components/movie/MovieCard";
import { Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Yêu Thích - Daily Film",
  description: "Danh sách phim bạn đã yêu thích",
};

export default async function FavoritesPage() {
  const { favorites } = await getUserLibrary();

  // Fetch movie data for each slug
  const movies = await Promise.all(
    favorites.map(async (slug) => {
      try {
        const data = await getMovieDetail(slug);
        return data?.movie;
      } catch {
        return null;
      }
    })
  );

  const validMovies = movies.filter((m) => m !== null && m !== undefined);

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold">Phim Yêu Thích</h1>
      </div>

      {validMovies.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Chưa có phim nào trong danh sách yêu thích.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {validMovies.map((movie) => (
            <MovieCard key={movie!._id} movie={movie!} />
          ))}
        </div>
      )}
    </div>
  );
}
