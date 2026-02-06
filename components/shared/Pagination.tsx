import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination as PaginationType } from "@/types/movie";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagination: PaginationType;
  baseUrl: string;
}

export default function Pagination({ pagination, baseUrl }: PaginationProps) {
  const { currentPage, totalPages } = pagination;

  // Clean base URL to avoid double slashes or query param issues
  // Assumes baseUrl is like "/danh-sach/phim-moi" or "/search?keyword=abc"
  // For search, we need to append &page=. For path, ?page=

  const getPageUrl = (page: number) => {
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${page}`;
    }
    return `${baseUrl}?page=${page}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Link href={getPageUrl(currentPage - 1)} passHref legacyBehavior>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          asChild
        >
          <a aria-disabled={currentPage <= 1} className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}>
            <ChevronLeft className="h-4 w-4" />
          </a>
        </Button>
      </Link>

      <div className="text-sm font-medium">
        Trang {currentPage} / {totalPages}
      </div>

      <Link href={getPageUrl(currentPage + 1)} passHref legacyBehavior>
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          asChild
        >
          <a aria-disabled={currentPage >= totalPages} className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}>
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </Link>
    </div>
  );
}
