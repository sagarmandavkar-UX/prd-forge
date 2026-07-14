"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileText,
  Folder,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  ShieldCheck,
  SunMoon
} from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useDemoStore } from "@/providers/demo-store-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects/new", label: "New Project", icon: Plus },
  { href: "/templates", label: "Templates", icon: BookOpen },
  { href: "/help", label: "Help & Docs", icon: HelpCircle },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({
  children,
  aside,
  title,
  description,
  actions
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, resetDemo } = useDemoStore();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b p-5">
            <Logo href="/dashboard" />
          </div>
          <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    active && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-3 border-t p-4">
            <div className="rounded-lg border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  Demo Mode
                </div>
                <Badge tone="blue">On</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Sample data only. Production auth and Supabase are ready through
                environment variables.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {state.profile.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {state.profile.fullName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {state.profile.email}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                resetDemo();
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Reset demo
            </Button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <div className="lg:hidden">
                <Logo href="/dashboard" />
              </div>
              {title ? (
                <div className="hidden lg:block">
                  <h1 className="truncate text-xl font-semibold">{title}</h1>
                  {description ? (
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {description}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Toggle appearance"
              >
                <SunMoon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </header>
        <main id="main-content" className="min-h-[calc(100vh-4rem)]">
          {aside ? (
            <div className="content-grid">
              <section className="border-r bg-card">{aside}</section>
              <section className="min-w-0">{children}</section>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export function ProjectSummaryStrip({
  quality,
  requirements,
  updatedAt
}: {
  quality: number;
  requirements: number;
  updatedAt: string;
}) {
  return (
    <div className="grid gap-3 border-t bg-card px-5 py-4 sm:grid-cols-3">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">Quality score</p>
          <p className="text-xs text-muted-foreground">
            {quality}/100 current review
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">Requirements</p>
          <p className="text-xs text-muted-foreground">
            {requirements} linked items
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-amber-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">Last edited</p>
          <p className="text-xs text-muted-foreground">
            {new Date(updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Folder,
  title,
  description,
  action
}: {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
