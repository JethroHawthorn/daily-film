import Link from "next/link";

import SearchInput from "@/components/layout/SearchInput";
import { Suspense } from "react";
import {
  POPULAR_COUNTRY_SLUGS,
  COUNTRY_LABELS,
  type PopularCountrySlug,
} from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Daily Film</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Phim Mới
            </Link>
            <Link
              href="/tim-kiem?keyword=phim-le"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Phim Lẻ
            </Link>
            <Link
              href="/tim-kiem?keyword=phim-bo"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Phim Bộ
            </Link>
            <Link
              href="/tim-kiem?keyword=hoat-hinh"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Hoạt Hình
            </Link>

            {/* Country Dropdown */}
            <div className="relative group">
              <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                Quốc Gia
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 py-2 w-40 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {POPULAR_COUNTRY_SLUGS.map((slug) => (
                  <Link
                    key={slug}
                    href={`/quoc-gia/${slug}`}
                    className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    {COUNTRY_LABELS[slug as PopularCountrySlug]}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </div>
          <nav className="flex items-center">
            {/* Additional nav items or mobile menu toggle */}
          </nav>
        </div>
      </div>
    </header>
  );
}
