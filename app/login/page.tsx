"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.54-1.76 4.52-5.27 4.52-3.17 0-5.75-2.62-5.75-5.85s2.58-5.85 5.75-5.85c1.8 0 3 .77 3.69 1.44l2.52-2.45C16.82 4.47 14.7 3.5 12.17 3.5 7.03 3.5 2.85 7.76 2.85 13s4.18 9.5 9.32 9.5c5.38 0 8.94-3.87 8.94-9.32 0-.63-.07-1.1-.16-1.58Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "This email is already linked to another sign-in method. Please sign out first if you're using a different account, or use the same sign-in method.";
      case "OAuthSignin":
        return "Error connecting to Google. Please try again.";
      case "OAuthCallback":
        return "Error during Google callback. Please try again.";
      case "EmailSignInError":
        return "Email sign in failed. Please try again.";
      case "Callback":
        return "Authentication callback error. Please try again.";
      default:
        return "Authentication error. Please try again.";
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <section className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md">
        <div className="grid min-h-[540px] md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-violet-700 to-indigo-900 p-10 text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/80">ZYROX</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                Welcome back to modern style.
              </h1>
              <p className="mt-4 text-sm text-white/85">
                Sign in to save favorites, track orders, and unlock a tailored shopping
                experience.
              </p>
            </div>
            <p className="text-sm text-white/80">Fast, secure, and fully responsive login.</p>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-medium text-violet-700 md:hidden">ZYROX</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Sign in</h2>
              <p className="mt-2 text-sm text-slate-600">
                Continue with your Google account to access your profile.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-900">Authentication Error</p>
                <p className="mt-2 text-sm text-red-800">{getErrorMessage(error)}</p>
                {error === "OAuthAccountNotLinked" && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-red-700">
                      This usually happens when you signed up with a different method. Clearing your browser cookies and trying again may help.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm font-medium text-red-700 underline hover:text-red-800"
                      >
                        Sign out and try again
                      </button>
                      <button
                        type="button"
                        onClick={() => window.location.href = "/login"}
                        className="text-sm font-medium text-red-700 underline hover:text-red-800"
                      >
                        Retry login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === "authenticated" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm text-emerald-800">You are signed in as</p>
                <p className="mt-1 break-all font-medium text-emerald-900">
                  {session.user?.email}
                </p>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            )}

            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              By signing in, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
