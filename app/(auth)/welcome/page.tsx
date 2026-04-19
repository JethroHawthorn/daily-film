"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUsername } from "@/app/actions/user";

export default function WelcomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("username");
    if (stored) {
      router.replace("/");
      return;
    }

    // Mobile PWAs can be finicky with taps during initial layout.
    // Deferring the focus avoids racing the first paint and viewport resize.
    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await registerUsername(username);

      if (res.error) {
        setError(res.error);
      } else if (res.username) {
        localStorage.setItem("username", res.username);
        router.push("/");
      }
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background px-4 py-8 sm:justify-center">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Chào mừng đến với Daily&nbsp;Film</h1>
        <p className="text-muted-foreground">
          Đặt tên để bắt đầu theo dõi lịch sử xem, phim yêu thích và đang theo dõi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Tên người dùng</label>
            <Input
              ref={inputRef}
              id="username"
              placeholder="Ví dụ: jethro_yeuphim"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={20}
              autoComplete="nickname"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang kiểm tra..." : "Bắt đầu xem"}
          </Button>
        </form>
      </div>
    </div>
  );
}
