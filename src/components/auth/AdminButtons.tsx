"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";

interface AdminButtonsProps {
  variant?: 'post' | 'rant';
}

export function AdminButtons({ variant = 'post' }: AdminButtonsProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setMounted(true);
  }, []);

  // Don't render anything until mounted (prevents SSR mismatch)
  if (!mounted) {
    return null;
  }

  // Only show admin buttons if authenticated
  if (!authenticated) {
    return null;
  }

  return (
    <Link href="/admin" className="button">
      <IconPlus size={16} />
      {variant === 'rant' ? 'Quick Rant' : 'New Post'}
    </Link>
  );
}