import { createSupabaseBrowserClient } from "@/lib/database/supabase";

export interface AuthResult {
  ok: boolean;
  message: string;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase is not configured locally. Enter demo mode to try PRD Forge without credentials."
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error
    ? { ok: false, message: error.message }
    : { ok: true, message: "Signed in." };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase is not configured locally. Enter demo mode or add Supabase environment variables."
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  return error
    ? { ok: false, message: error.message }
    : { ok: true, message: "Check your email to confirm the account." };
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase is not configured locally. Password reset is available after Supabase setup."
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return error
    ? { ok: false, message: error.message }
    : { ok: true, message: "Password reset email sent." };
}

export async function signOut(): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  await supabase?.auth.signOut();
}
