import { createClient } from '@/lib/supabase/server'
import { Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111]">Messages</h1>
        <p className="text-sm text-[#6B7280] mt-1">{messages?.length ?? 0} messages</p>
      </div>

      <div className="space-y-3">
        {(!messages || messages.length === 0) && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-16 text-center">
            <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-[#6B7280]">No messages received yet.</p>
          </div>
        )}
        {messages?.map(m => (
          <div key={m.id} className="bg-white border border-[#E5E5E5] rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-semibold text-[#111111]">{m.name}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                {m.subject && <p className="text-xs font-medium text-[#C9A227] mt-0.5">{m.subject}</p>}
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${m.is_read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                  {m.is_read ? 'Read' : 'New'}
                </span>
                <p className="text-xs text-[#6B7280] mt-1">
                  {new Date(m.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
