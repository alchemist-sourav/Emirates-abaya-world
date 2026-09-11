import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  const { cookies } = (await import('next/headers'))
  const cookieStore = cookies() as unknown as {
    getAll: () => string[] | null
    setAll: (cookies: { name: string; value: string; options?: { path?: string; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' }  }) => void
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookieStore.setAll(cookiesToSet as [{ name: string; value: string; options?: { path?: string; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' } }])
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}