"use client";

import Link from "next/link";

export default function Header() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/job_listing">Job Listing</Link>
    </nav>
  );
}
