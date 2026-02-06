import { getMoviesByCountry } from "@/lib/ophim";
import { COUNTRY_LABELS, type CountrySlug } from "@/lib/constants";
import { Metadata } from "next";
import { fetchMoreMoviesByCountry } from "@/app/actions/movies";
import InfiniteMovieGrid from "@/components/movie/InfiniteMovieGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const countryName = COUNTRY_LABELS[params.slug as CountrySlug] || params.slug;

  return {
    title: `Phim ${countryName} - Daily Film`,
    description: `Xem phim ${countryName} mới nhất, chất lượng cao. Cập nhật liên tục phim ${countryName} hay nhất.`,
  };
}

export default async function CountryPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  // Get country label for display
  const countryName = COUNTRY_LABELS[slug as CountrySlug] || slug;

  const { items, pagination } = await getMoviesByCountry(slug);
  const totalPages = pagination?.totalPages || 1;

  // Create bound server action for this specific country
  async function fetchMore(page: number) {
    "use server";
    return fetchMoreMoviesByCountry(slug, page);
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-2">Phim {countryName}</h1>

      {pagination && (
        <p className="text-muted-foreground mb-4">
          Tổng cộng {pagination.totalItems.toLocaleString()} phim
        </p>
      )}

      {items.length > 0 ? (
        <InfiniteMovieGrid
          initialMovies={items}
          totalPages={totalPages}
          fetchMoreAction={fetchMore}
        />
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
