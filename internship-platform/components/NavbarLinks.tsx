"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "TRANG CHỦ" },
  { href: "/job-listing", label: "TUYỂN DỤNG" },
  { href: "/blog", label: "TIN TỨC" }, // đổi đúng route của bạn
];

export default function NavbarLinks() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="navbar-collapse collapse" id="navbarScroll">
      <ul
        className="nav navbar-nav"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className={active ? "active" : ""}>
              {/* dùng <a> để full reload => slider/jQuery chạy đúng */}
              <a href={item.href} className={active ? "active" : ""}>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
