"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth-context"
import { authAPI, setCurrentUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Shield, Mail, UserCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function SettingsPage() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const updatedUser = await authAPI.updateProfile({ full_name: fullName })
      setCurrentUser(updatedUser)
      toast({ title: "Profile updated successfully" })
    } catch (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsPasswordLoading(true)
    try {
      await authAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setCurrentPassword("")
      setNewPassword("")
      toast({ title: "Password changed successfully" })
    } catch (error) {
      toast({ title: "Change failed", description: error.message, variant: "destructive" })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and security preferences.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" /> Profile Information
              </CardTitle>
              <CardDescription>Update your account details and contact information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="pl-10 bg-background/50 border-border/50 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Email changes are currently disabled.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">
                  {isLoading ? <Spinner className="mr-2" /> : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security Section */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" /> Security
              </CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isPasswordLoading} variant="secondary" className="glass">
                  {isPasswordLoading ? <Spinner className="mr-2" /> : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
