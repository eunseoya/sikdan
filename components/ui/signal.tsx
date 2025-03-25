"use client";

import type { LightbulbIcon as LucideProps } from "lucide-react";

export function Signal(props: LucideProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="1" y="4" width="3" height="8" rx="1" fill="currentColor" />
      <rect x="6" y="1" width="3" height="14" rx="1" fill="currentColor" />
      <rect x="11" y="6" width="3" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}
