"use client";

import { Suspense } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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

function LoginPageContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "This email is already linked to another sign-in method. Please sign out first if you're using a different account.";
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml+base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iIzBmMDkyYiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiM2NjZlOGEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-40" />
      </div>

      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 shadow-2xl backdrop-blur-lg"
      >
        <div className="grid min-h-[600px] md:grid-cols-2">
          {/* Left side - Brand section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex flex-col justify-between bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -ml-28 -mb-28" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-xs font-accent uppercase tracking-widest text-purple-200 font-semibold">Premium Fashion</p>
                <h1 className="mt-6 text-5xl md:text-6xl font-display font-bold leading-tight tracking-tight">
                  ELUEE
                </h1>
              </motion.div>
              <p className="mt-6 text-lg font-poppins text-purple-100 font-light leading-relaxed">
                Step into a world of elegance and style. Your personalized shopping experience awaits.
              </p>
            </div>
            
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-sm text-purple-200 font-poppins">✨ Fast, secure, and effortless authentication</p>
            </motion.div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center p-8 sm:p-12"
          >
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm font-accent font-bold text-purple-400 md:hidden tracking-wider">ELUEE</p>
                <h2 className="mt-3 text-4xl font-display font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="mt-3 text-base text-slate-300 font-poppins font-light">
                  Sign in to your account and continue shopping for exclusive styles.
                </p>
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-red-400/30 bg-red-950/40 backdrop-blur p-4 border-l-4 border-l-red-400"
              >
                <p className="text-sm font-semibold text-red-300 font-accent">⚠️ Authentication Error</p>
                <p className="mt-2 text-sm text-red-200 font-poppins">{getErrorMessage(error)}</p>
                {error === "OAuthAccountNotLinked" && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-red-300 font-poppins">
                      Clear your cookies and try again, or sign out from your current session.
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="text-sm font-medium text-red-300 underline hover:text-red-200 transition"
                      >
                        Sign out
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        onClick={() => window.location.href = "/login"}
                        className="text-sm font-medium text-red-300 underline hover:text-red-200 transition"
                      >
                        Retry
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {status === "authenticated" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-950/40 to-teal-950/40 backdrop-blur p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">✓</span>
                  <p className="text-sm text-emerald-300 font-accent font-semibold">Signed In</p>
                </div>
                <p className="text-sm text-emerald-200 font-poppins break-all">
                  {session.user?.email}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="mt-6 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold transition hover:shadow-lg hover:shadow-emerald-500/50 font-poppins"
                >
                  Sign Out
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 font-semibold text-white transition shadow-lg hover:shadow-xl hover:shadow-purple-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  <GoogleIcon />
                  <span className="font-poppins font-semibold">Continue with Google</span>
                </div>
              </motion.button>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-xs leading-relaxed text-slate-400 text-center font-poppins"
            >
              By signing in, you agree to our{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300 transition underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300 transition underline">
                Privacy Policy
              </a>
              . Your data is always secure with us.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full" />
          </motion.div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
