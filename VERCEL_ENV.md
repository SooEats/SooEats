# Vercel Environment Settings

Use these values in **Vercel > Project > Settings > Environment Variables**.

After changing any Vercel environment variable, redeploy the project so the new values are used.

## Production Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://agxuqkvpvfwvkthyjxzx.supabase.co
NEXT_PUBLIC_SITE_URL=https://soo-eat.vercel.app
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_database_url

AUTH_REDIRECT_AFTER_LOGIN=/account
AUTH_REDIRECT_AFTER_LOGOUT=/login
AUTH_REDIRECT_AFTER_SIGNUP=/account
AUTH_REDIRECT_ON_ERROR=/auth/error
```

## Supabase Auth URL Configuration

In **Supabase Dashboard > Authentication > URL Configuration**:

```txt
Site URL:
https://soo-eat.vercel.app
```

Add these redirect URLs:

```txt
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
https://soo-eat.vercel.app/auth/callback
https://soo-eat.vercel.app/auth/confirm
```

## Google OAuth Redirect URI

In **Google Cloud Console > APIs & Services > Credentials > OAuth Client > Authorized redirect URIs**, keep this Supabase callback:

```txt
https://agxuqkvpvfwvkthyjxzx.supabase.co/auth/v1/callback
```

For Supabase Google auth, Google redirects back to Supabase first. Supabase then redirects to the app callback URL.
