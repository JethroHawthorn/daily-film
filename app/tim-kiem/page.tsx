import { searchMovies } from "@/lib/ophim";
import MovieGrid from "@/components/movie/MovieGrid";

interface Props {
  searchParams: Promise<{ keyword: string }>;
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword || "";
  const { items } = await searchMovies(keyword);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm cho: &quot;{keyword}&quot;</h1>
      {items.length > 0 ? (
        <MovieGrid movies={items} />
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
