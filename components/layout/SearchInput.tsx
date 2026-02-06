"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("keyword") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm phim..."
        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
