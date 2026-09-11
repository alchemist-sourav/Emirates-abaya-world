# Demo User Setup (Local Development Only)

> **Security Notice:** This file contains setup instructions for creating demo users locally.
> Never commit passwords or create auth.users via SQL with hardcoded credentials.

## Prerequisites

- Supabase CLI installed (`npx supabase`)
- Supabase project running locally (`npx supabase start`)
- Access to the Supabase Dashboard at http://localhost:54323

## Step 1: Run the Schema Migration

```bash
npx supabase db push
```

## Step 2: Run the Seed Script (without auth users)

```bash
npx supabase db seed --file=supabase/seed.sql
```

## Step 3: Create Demo Users via Supabase Dashboard

1. Open http://localhost:54323 (or your hosted Supabase project URL)
2. Navigate to **Authentication → Users**
3. Click **Add User → Create new user**
4. Enter the details below for each user, then click **Create**

### Admin User

| Field | Value |
|---|---|
| Email | `admin@emiratesmodest.com` |
| Password | Choose a strong password (minimum 8 characters) |
| Email confirmed | ✅ Yes (check the box) |
| User ID (copy this) | `a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1` |

After creating, navigate to **Authentication → Users → admin@emiratesmodest.com → Metadata** and add:

```json
{ "full_name": "Admin User" }
```

### Customer User

| Field | Value |
|---|---|
| Email | `customer@emiratesmodest.com` |
| Password | Choose a strong password (minimum 8 characters) |
| Email confirmed | ✅ Yes (check the box) |
| User ID (copy this) | `c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2` |

After creating, navigate to **Authentication → Users → customer@emiratesmodest.com → Metadata** and add:

```json
{ "full_name": "Fatima Almansouri" }
```

## Step 4: Map Users to Profiles and Admin Roles

Run these SQL statements in the Supabase SQL Editor:

```sql
-- Map admin user
INSERT INTO public.admin_users (id, role)
VALUES ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'admin')
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles
SET role = 'admin', full_name = 'Admin User'
WHERE id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';

-- Map customer user
UPDATE public.profiles
SET full_name = 'Fatima Almansouri', phone = '9747793814'
WHERE id = 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2';
```

## Step 5: Verify Setup

1. Go to http://localhost:3000/login
2. Log in with `admin@emiratesmodest.com` and your chosen password
3. Navigate to `/admin` — you should see the admin dashboard
4. Log out and log in with `customer@emiratesmodest.com`
5. Navigate to `/admin` — you should be redirected (access denied)

## Troubleshooting

**"User not found" errors after login:**
The `profiles` table rows are created automatically by a database trigger when a new user signs up via Supabase Auth. Make sure the auth.users rows were created first (Step 3), then run Step 4.

**Need to reset demo users:**
```sql
DELETE FROM auth.users WHERE email IN ('admin@emiratesmodest.com', 'customer@emiratesmodest.com');
DELETE FROM public.admin_users WHERE id = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
```
Then repeat Steps 3 and 4.

**Hosted Supabase project (not local):**
Replace `localhost:54323` with your project's Supabase Dashboard URL (found in Project Settings → API).
