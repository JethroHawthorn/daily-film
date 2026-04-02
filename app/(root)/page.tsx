import { getLatestMovies, OPHIM_IMAGE_URL } from "@/lib/ophim";

import InfiniteMovieGrid from "@/components/movie/InfiniteMovieGrid";
import ContinueWatching from "@/components/home/ContinueWatching";
import TrendingSection from "@/components/home/TrendingSection";
import TopRatedSection from "@/components/home/TopRatedSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RemoteImage from "@/components/shared/RemoteImage";

export default async function Home() {
  const { items: latestMovies } = await getLatestMovies(1);

  // Featured movie (first one)
  const featured = latestMovies?.[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[50vh] w-full overflow-hidden sm:h-[60vh] md:h-[70vh]">
          <RemoteImage
            src={
              featured.poster_url?.startsWith("http")
                ? featured.poster_url
                : `${OPHIM_IMAGE_URL}/${featured.poster_url}`
            }
            alt={featured.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

          <div className="container relative z-10 flex h-full flex-col justify-end pb-12 sm:pb-24">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {featured.name}
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                {featured.origin_name} • {featured.year}
              </p>
              <div className="flex gap-4 pt-4">
                <Link href={`/phim/${featured.slug}`}>
                  <Button size="lg" className="gap-2">
                    Xem Ngay <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="container py-8">
        <ContinueWatching />
        <TrendingSection />
        <TopRatedSection />
        <InfiniteMovieGrid initialMovies={latestMovies} title="Phim Mới Cập Nhật" />
      </div>
    </div>
  );
}
