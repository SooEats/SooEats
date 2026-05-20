import { AuthForm } from "@/components/auth/auth-form";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { redirectIfAuthenticated } from "@/server/auth/middleware/redirect-if-authenticated.middleware";
import {
  signupWithEmailAction,
  signupWithGoogleAction,
} from "@/app/signup/actions";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  await redirectIfAuthenticated();
  const { next } = await searchParams;

  return (
    <main className="min-h-[75vh] px-4 py-20">
      <section className="mx-auto max-w-md bg-brown-50 p-8 sm:p-12">
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-orange-500">
          Join us
        </p>
        <h1 className="mb-8 font-display text-3xl font-bold text-brown-900">
          Create your account
        </h1>

        <div className="space-y-6">
          <GoogleAuthButton action={signupWithGoogleAction} next={next} />
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-brown-200" />
            <span className="text-[10px] uppercase tracking-widest text-brown-400">
              or
            </span>
            <span className="h-px flex-1 bg-brown-200" />
          </div>
          <AuthForm action={signupWithEmailAction} mode="signup" next={next} />
        </div>
      </section>
    </main>
  );
}
