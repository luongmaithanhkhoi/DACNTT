import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Job Finder",
  description: "Job Finder Website",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Alice"
          rel="stylesheet"
        />

        {/* CSS từ template */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/owl.carousel.css" />
        <link rel="stylesheet" href="/css/font-awesome.css" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>

      <body>
         <Header />
        {children}
        <Footer />
        {/* 1️⃣ jQuery – PHẢI load đầu */}
        <Script
          src="/js/jquery-2.1.4.min.js"
          strategy="beforeInteractive"
        />

        {/* 2️⃣ Bootstrap */}
        <Script
          src="/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />

        {/* 3️⃣ Slider Revolution */}
        <Script
          src="/rs-plugin/js/jquery.themepunch.tools.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/rs-plugin/js/jquery.themepunch.revolution.min.js"
          strategy="afterInteractive"
        />

        {/* 4️⃣ Owl Carousel */}
        <Script
          src="/js/owl.carousel.js"
          strategy="afterInteractive"
        />

        {/* 5️⃣ Script chính của template */}
        <Script
          src="/js/script.js"
          strategy="afterInteractive"
        />
       
      </body>
    </html>
  );
}
