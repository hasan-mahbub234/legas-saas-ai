"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Key, Plus, Trash2, Copy, AlertCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function APIKeysPage() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState(null)
  const { toast } = useToast()

  const loadKeys = async () => {
    try {
      const response = await authAPI.getApiKeys()
      setKeys(response.keys)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKeys()
  }, [])

  const handleCreateKey = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const response = await authAPI.createApiKey({ name: newKeyName })
      setCreatedKey(response.key)
      setNewKeyName("")
      loadKeys()
      toast({ title: "API Key created" })
    } catch (error) {
      toast({ title: "Creation failed", description: error.message, variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRevokeKey = async (id) => {
    if (!confirm("Are you sure you want to revoke this API key?")) return
    try {
      await authAPI.revokeApiKey(id)
      loadKeys()
      toast({ title: "API Key revoked" })
    } catch (error) {
      toast({ title: "Revocation failed", variant: "destructive" })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard" })
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
            <p className="text-muted-foreground">Manage your API keys for programmatic access.</p>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) setCreatedKey(null)
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground gap-2 rounded-xl">
                <Plus className="w-4 h-4" /> Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="glass sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>Give your key a name to identify it later.</DialogDescription>
              </DialogHeader>
              {!createdKey ? (
                <form onSubmit={handleCreateKey} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g. Production Web App"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="bg-background/50 border-border/50"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreating} className="w-full">
                      {isCreating ? <Spinner className="mr-2" /> : "Generate Key"}
                    </Button>
                  </DialogFooter>
                </form>
              ) : (
                <div className="space-y-6 pt-4">
                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 text-sm text-yellow-200">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Make sure to copy your API key now. You won't be able to see it again!</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Your API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        value={createdKey}
                        readOnly
                        className="bg-background/50 border-border/50 font-mono text-xs"
                      />
                      <Button size="icon" variant="secondary" onClick={() => copyToClipboard(createdKey)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setIsDialogOpen(false)}>
                    Done
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Active API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center">
                <Spinner className="w-8 h-8 text-primary mx-auto" />
              </div>
            ) : keys.length > 0 ? (
              <div className="space-y-4">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-border/50 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-background border border-border/50">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{key.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(key.created_at).toLocaleDateString()} • Last used:{" "}
                          {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : "Never"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeKey(key.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Key className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No API keys found. Create one to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
