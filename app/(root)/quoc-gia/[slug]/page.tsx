import { getMoviesByCountry } from "@/lib/ophim";
import { COUNTRY_LABELS, type CountrySlug } from "@/lib/constants";
import { Metadata } from "next";
import CountryMovieGrid from "@/components/movie/CountryMovieGrid";

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

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-2">Phim {countryName}</h1>

      {pagination && (
        <p className="text-muted-foreground mb-4">
          Tổng cộng {pagination.totalItems.toLocaleString()} phim
        </p>
      )}

      {items.length > 0 ? (
        <CountryMovieGrid initialMovies={items} countrySlug={slug} />
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
