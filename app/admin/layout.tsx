import Link from "next/link";
import { BarChart3, ClipboardList, ExternalLink, LogOut, UtensilsCrossed } from "lucide-react";
import { requireAdmin } from "@/server/auth/middleware/require-admin.middleware";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin("/admin");

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-brown-900 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-brown-900 px-5 py-6 text-white lg:min-h-screen">
        <Link href="/admin" className="font-display text-2xl font-bold">
          SOOEATS Admin
        </Link>
        <p className="mt-2 truncate text-xs text-brown-300">{admin.email}</p>

        <nav className="mt-10 grid gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-3 text-sm text-brown-100 transition hover:bg-white/10 hover:text-white">
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-2 border-t border-white/10 pt-6">
          <Link href="/" className="flex items-center gap-3 px-3 py-3 text-sm text-brown-200 hover:text-white">
            <ExternalLink className="h-4 w-4" />
            View storefront
          </Link>
          <form action="/api/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-3 py-3 text-sm text-brown-200 hover:text-white">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
