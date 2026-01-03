"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Search,
  UserIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Documents", icon: FileText, href: "/documents" },
    { name: "AI Assistant", icon: MessageSquare, href: "/ai-chat" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 glass-subtle flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-border/50 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">LegalAI</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 rounded-xl py-6 ${
                    isActive ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-primary/5"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-medium">{item.name}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl py-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border/50 glass-subtle flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10 bg-background/50 border-border/50 rounded-full h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/documents/upload">
              <Button className="bg-primary text-primary-foreground rounded-full gap-2 px-6 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                Upload
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-border/50">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.full_name?.charAt(0) || <UserIcon className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass mt-2" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => router.push("/settings")}>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings/api-keys")}>API Management</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">{children}</div>
      </main>
    </div>
  )
}
