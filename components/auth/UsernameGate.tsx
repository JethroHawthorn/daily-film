"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_PATHS = ["/welcome"];

export default function UsernameGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Skip check on public paths
    if (PUBLIC_PATHS.includes(pathname)) {
      setAuthorized(true);
      return;
    }

    const username = localStorage.getItem("username");

    if (!username) {
      // Redirect to welcome
      router.push("/welcome");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Optional: Show loading state or nothing while checking
  // For better UX, we might render children but redirect fast?
  // Or strictly gate. Let's strictly gate for now to avoid flash of content.
  // BUT: For SEO pages (Home, Movie Detail), we should probably ALLOW render but just disable features?
  // User Scope: "SEO pages must still render normally... Gate only applies to interactive features"

  // Revised Logic: Always render children. The Gate just redirects if needed, but doesn't block render.
  // This ensures bots see content.

  return <>{children}</>;
}
