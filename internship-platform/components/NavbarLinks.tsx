"use client";

import { usePathname } from "next/navigation";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
  { href: "/", label: "TRANG CHỦ" },
  { href: "/job-listing", label: "TUYỂN DỤNG" },
  { href: "/events", label: "TIN TỨC" },
];

export default function NavbarLinks() {
  const pathname = usePathname();

  const [profileHref, setProfileHref] = useState<string>('/profile');
  const [role, setRole] = useState<string | null>(null);

  // Hàm cập nhật profileHref theo role
  const updateProfileLink = (currentRole: string | null) => {
    if (currentRole === 'ENTERPRISE') {
      setProfileHref('/enterprises/dashboard');
    } else if (currentRole === 'STUDENT') {
      setProfileHref('/profile');
    } else if (currentRole === 'ADMIN' || currentRole === 'FACULTY') {
      setProfileHref('/faculty');
    } else {
      setProfileHref('/profile'); // fallback
    }
    setRole(currentRole);
  };

  // Load role ban đầu + lắng nghe thay đổi localStorage
  useEffect(() => {
    // Lấy role hiện tại
    const savedRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
    updateProfileLink(savedRole);

    // Lắng nghe sự kiện storage (khi localStorage thay đổi ở tab khác)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_role') {
        updateProfileLink(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Kiểm tra active cho các link cố định
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Kiểm tra active cho PROFILE (xử lý nhiều path theo role)
  const isProfileActive = () => {
    console.log('Checking active for role:', role, 'on path:', pathname);
    if (role === 'STUDENT') return pathname.startsWith('/profile');
    if (role === 'ENTERPRISE') return pathname.startsWith('/enterprise');
    if (role === 'ADMIN' || role === 'FACULTY') return pathname.startsWith('/faculty') || pathname.startsWith('/admin');
    return pathname.startsWith('/profile');
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
              <Link href={item.href} className={`nav-link ${active ? "active" : ""}`}>
                {item.label}
              </Link>
            </li>
          );
        })}

        {/* Menu PROFILE động */}
        <li className={isProfileActive() ? "active" : ""}>
          <Link 
            href={profileHref} 
            className={`nav-link ${isProfileActive() ? "active" : ""}`}
          >
            PROFILE
          </Link>
        </li>
      </ul>
    </div>
  );
}