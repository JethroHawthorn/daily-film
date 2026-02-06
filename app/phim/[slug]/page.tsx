import { getMovieDetail, OPHIM_IMAGE_URL } from "@/lib/ophim";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import EpisodeList from "@/components/movie/EpisodeList";
import JsonLd from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RelatedMovies from "@/components/movie/RelatedMovies";
import ActionButtons from "@/components/movie/ActionButtons";
import { getUserStats } from "@/app/actions/user";
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getMovieDetail(params.slug);
  if (!data) return { title: 'Không tìm thấy phim' };

  return {
    title: `${data.movie.name} - Daily Film`,
    description: data.movie.content.slice(0, 160),
    openGraph: {
      images: [data.movie.poster_url], // Needs full URL handling ideally
    },
  };
}

export default async function MovieDetailPage(props: Props) {
  const params = await props.params;
  const [data, stats] = await Promise.all([
    getMovieDetail(params.slug),
    getUserStats(params.slug)
  ]);

  if (!data) return notFound();

  const { movie, episodes } = data;

  // Clean content HTML potentially
  const content = movie.content.replace(/<p>&nbsp;<\/p>/g, '');


  const posterUrl = movie.poster_url.startsWith('http')
    ? movie.poster_url
    : `${OPHIM_IMAGE_URL}/${movie.poster_url}`;

  const thumbUrl = movie.thumb_url.startsWith('http')
    ? movie.thumb_url
    : `${OPHIM_IMAGE_URL}/${movie.thumb_url}`;

  return (
    <div className="min-h-screen pb-12">
      <JsonLd movie={movie} />
      {/* Backdrop */}
      <div className="relative h-[40vh] w-full overflow-hidden md:h-[50vh]">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${posterUrl})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container relative z-10 -mt-32 md:-mt-48">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Poster */}
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl">
            <Image
              src={thumbUrl}
              alt={movie.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 text-white">
            <h1 className="text-3xl font-bold md:text-5xl">{movie.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl text-white/80">{movie.origin_name} ({movie.year})</h2>
              </div>
              <ActionButtons
                movieSlug={movie.slug}
                initialIsFavorite={stats.isFavorite}
                initialIsFollowed={stats.isFollowed}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                {movie.quality}
              </Badge>
              <Badge variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                {movie.lang}
              </Badge>
              {movie.country?.map(c => (
                <Link key={c.id} href={`/quoc-gia/${c.slug}`}>
                  <Badge variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer">
                    {c.name}
                  </Badge>
                </Link>
              ))}
              {movie.category?.map(c => (
                <Link key={c.id} href={`/the-loai/${c.slug}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                    {c.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <div
              className="prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="grid gap-4 py-4 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Đạo diễn:</span>
                <p>{movie.director?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Diễn viên:</span>
                <p>{movie.actor?.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <div className="mt-12">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold">Danh sách tập</h3>
              <div className="max-h-48 overflow-y-auto pr-2">
                <EpisodeList episodes={episodes} movieSlug={movie.slug} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Movies */}
        <RelatedMovies movie={movie} />
      </div>
    </div>
  );
}
