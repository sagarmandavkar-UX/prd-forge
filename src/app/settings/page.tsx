"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/providers/demo-store-provider";

export default function SettingsPage() {
  const { state, updateProfile } = useDemoStore();
  const [name, setName] = useState(state.profile.fullName);
  const [role, setRole] = useState(state.profile.role);
  const [message, setMessage] = useState("");

  return (
    <AppShell
      title="Settings"
      description="Manage profile details and production integration readiness."
    >
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <Card className="p-5">
          <h2 className="font-semibold">Profile settings</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Full name
              <Input
                className="mt-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Role
              <Input
                className="mt-2"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />
            </label>
          </div>
          <Button
            className="mt-5"
            onClick={() => {
              updateProfile({ fullName: name, role });
              setMessage(
                "Profile changes are saved in demo mode for this browser session."
              );
            }}
          >
            Save profile
          </Button>
          {message ? (
            <p className="mt-3 text-sm text-emerald-700">{message}</p>
          ) : null}
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Production integrations</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border bg-background p-3">
              <dt className="font-medium">Supabase Authentication</dt>
              <dd className="mt-1 text-muted-foreground">
                Ready through NEXT_PUBLIC_SUPABASE_URL and
                NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </dd>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <dt className="font-medium">AI providers</dt>
              <dd className="mt-1 text-muted-foreground">
                Mock by default; OpenAI and Gemini are selected server-side
                through environment variables.
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </AppShell>
  );
}
