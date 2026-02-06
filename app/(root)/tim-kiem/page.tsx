import { searchMovies } from "@/lib/ophim";
import { MOVIE_CATEGORY_LABELS, type MovieCategorySlug } from "@/lib/constants";
import SearchMovieGrid from "@/components/movie/SearchMovieGrid";

interface Props {
  searchParams: Promise<{ keyword?: string }>;
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword || "";

  // Map slug to Vietnamese label, fallback to original keyword
  const displayKeyword =
    MOVIE_CATEGORY_LABELS[keyword as MovieCategorySlug] || keyword;

  const { items, pagination } = await searchMovies(keyword);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Kết quả tìm kiếm cho: {displayKeyword}
        </h1>
        {pagination && (
          <p className="text-muted-foreground mt-1">
            Tìm thấy {pagination.totalItems.toLocaleString()} phim
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <SearchMovieGrid key={keyword} initialMovies={items} keyword={keyword} />
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
