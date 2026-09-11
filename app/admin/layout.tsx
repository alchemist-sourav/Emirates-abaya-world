import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ShoppingBag, Package, Tags, Boxes, Users,
  Star, Ticket, MessageSquare, Settings,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense-in-depth: middleware already guards /admin, but verify role server-side too.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col lg:flex-row">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-[#E5E5E5] min-h-screen">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Link href="/" className="font-heading text-base font-bold text-[#111111]">
            Emirates Admin
          </Link>
          <p className="text-xs text-[#6B7280] mt-1">{profile.full_name ?? user.email}</p>
        </div>
        <nav className="flex-1 py-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <AdminNavLink key={href} href={href} label={label} Icon={Icon} />
          ))}
        </nav>
        <form action="/api/auth/signout" method="post" className="p-3 border-t border-[#E5E5E5]">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:text-[#111111] hover:bg-[#F8F6F2] rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </form>
      </aside>

      {/* Top bar — mobile */}
      <div className="lg:hidden bg-white border-b border-[#E5E5E5] px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/admin" className="font-heading text-sm font-bold text-[#111111]">
          Emirates Admin
        </Link>
        <details className="relative">
          <summary className="list-none cursor-pointer text-xs text-[#6B7280]">Menu</summary>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-2 z-40">
            {NAV.map(({ href, label, icon: Icon }) => (
              <AdminNavLink key={href} href={href} label={label} Icon={Icon} mobile />
            ))}
          </div>
        </details>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

function AdminNavLink({ href, label, Icon, mobile = false }: { href: string; label: string; Icon: typeof LayoutDashboard; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={
        mobile
          ? 'flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:text-[#111111] hover:bg-[#F8F6F2] rounded-md'
          : 'flex items-center gap-2.5 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#111111] hover:bg-[#F8F6F2] border-l-2 border-transparent hover:border-[#C9A227] transition-colors'
      }
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
