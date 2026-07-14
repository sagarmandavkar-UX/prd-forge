import { z } from "zod";

export const serverEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  AI_PROVIDER: z.enum(["mock", "openai", "gemini"]).default("mock"),
  OPENAI_API_KEY: z.string().optional().or(z.literal("")),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  GOOGLE_GEMINI_API_KEY: z.string().optional().or(z.literal("")),
  GOOGLE_GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
  EXPORT_SECRET: z.string().optional().or(z.literal(""))
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}

export function hasSupabaseConfig() {
  const env = getServerEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
