import { getMoviesByCategory } from "@/lib/ophim";
import { Metadata } from "next";
import InfiniteMovieGrid from "@/components/movie/InfiniteMovieGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // We can try to format the slug to a display name if we don't have a map
  // or just use the slug for now, or fetch the category details if an API exists.
  // The current API behavior for getMoviesByCategory returns items but maybe not the category name explicitly in a simple way without mapping.
  // Converting slug "hanh-dong" -> "Hanh Dong" -> "Hành Động" is hard without a map.
  // For now, let's just capitalize the slug.
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Phim ${title} - Daily Film`,
    description: `Xem phim ${title} mới nhất, tuyển chọn hay nhất.`,
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const { slug } = params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const { items } = await getMoviesByCategory(slug);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Phim {title}</h1>

      {items.length > 0 ? (
        <InfiniteMovieGrid initialMovies={items} title="" />
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào trong thể loại này.</p>
      )}
    </div>
  );
}
