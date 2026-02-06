"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold">Đã có lỗi xảy ra!</h2>
      <p className="text-muted-foreground">Không thể tải dữ liệu. Vui lòng thử lại.</p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  );
}
