import { createClient } from '@/lib/supabase/server'
import { Mail, Phone, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, role, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Customers</h1>
        <p className="text-sm text-[#6B7280] mt-1">{customers?.length ?? 0} customers</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E5E5]">
              <tr className="text-left text-xs uppercase tracking-wider text-[#6B7280]">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEC]">
              {(!customers || customers.length === 0) && (
                <tr><td colSpan={4} className="px-5 py-16 text-center text-sm text-[#6B7280]">No customers yet</td></tr>
              )}
              {customers?.map(c => (
                <tr key={c.id} className="hover:bg-[#F8F6F2] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#F8F6F2] flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#111111]">{c.full_name || c.email?.split('@')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[#111111] flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#6B7280]" />
                      {c.email}
                    </p>
                    {c.phone && (
                      <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                      c.role === 'admin' ? 'bg-[#C9A227]/10 text-[#C9A227]' :
                      c.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {c.role ?? 'customer'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-[#6B7280]">
                    {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
