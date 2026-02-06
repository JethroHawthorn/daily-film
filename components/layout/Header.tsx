import Link from "next/link";

import SearchInput from "@/components/layout/SearchInput";
import { Suspense } from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Daily Film
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Phim Mới
            </Link>
            <Link href="/tim-kiem?keyword=phim-le" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Phim Lẻ
            </Link>
            <Link href="/tim-kiem?keyword=phim-bo" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Phim Bộ
            </Link>
            <Link href="/tim-kiem?keyword=hoat-hinh" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Hoạt Hình
            </Link>
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
