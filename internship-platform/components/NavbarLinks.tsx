// "use client";

// import { usePathname } from "next/navigation";

// const navItems = [
//   { href: "/", label: "TRANG CHỦ" },
//   { href: "/job-listing", label: "TUYỂN DỤNG" },
//   { href: "/events", label: "TIN TỨC" }, 
//   { href: "/profile", label: "Profile"}
// ];

// export default function NavbarLinks() {
//   const pathname = usePathname();

//   const isActive = (href: string) => {
//     if (href === "/") return pathname === "/";
//     return pathname === href || pathname.startsWith(href + "/");
//   };

//   return (
//     <div className="navbar-collapse collapse" id="navbarScroll">
//       <ul
//         className="nav navbar-nav"
//         style={{
//           width: "100%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: 24,
//         }}
//       >
//         {navItems.map((item) => {
//           const active = isActive(item.href);
//           return (
//             <li key={item.href} className={active ? "active" : ""}>
//               <a href={item.href} className={active ? "active" : ""}>
//                 {item.label}
//               </a>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

// components/NavbarLinks.tsx (hoặc vị trí của bạn)
// components/NavbarLinks.tsx

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

  // Lấy role từ localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('user_role');
      setRole(savedRole);

     let profilePath = '/profile';
      if (savedRole === 'ENTERPRISE') {
        profilePath = '/enterprises/dashboard';
      } else if (savedRole === 'STUDENT') {
        profilePath = '/profile';
      } else if (savedRole === 'ADMIN') {
        profilePath = '/faculty'; 
      }
      setProfileHref(profilePath);
    }
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Check active cho menu PROFILE (xử lý nhiều path theo role)
  const isProfileActive = () => {
    console.log('Checking active for role:', role, 'on path:', pathname);
    if (role === 'STUDENT') return pathname.startsWith('/profile');
    if (role === 'ENTERPRISE') return pathname.startsWith('/enterprise');
    if (role === 'ADMIN') return pathname.startsWith('/faculty') || pathname.startsWith('/admin');
    return false;
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