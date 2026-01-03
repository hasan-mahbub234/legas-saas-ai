"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { documentsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, X, ShieldCheck } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF document.",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    try {
      const response = await documentsAPI.upload(file, description, tags)
      toast({
        title: "Upload successful",
        description: "Your document is being processed by AI.",
      })
      router.push(`/documents/${response.id}`)
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
          <p className="text-muted-foreground">Add a new legal document for AI analysis.</p>
        </div>

        <Card className="glass border-border/50 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border/50">
            <CardTitle>Document Details</CardTitle>
            <CardDescription>Upload a PDF and add context for better analysis.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-6">
              {/* File Dropzone */}
              <div className="space-y-2">
                <Label>File Upload (PDF)</Label>
                {!file ? (
                  <div className="relative group">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-border/50 rounded-3xl p-12 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-lg font-semibold">Click or drag to upload</p>
                      <p className="text-sm text-muted-foreground mt-1">Maximum file size: 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-background border border-border/50">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      className="hover:bg-red-500/10 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Software Service Agreement for Q1 2025"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/50 border-border/50 rounded-2xl min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional, comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="contract, software, recurring"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-background/50 border-border/50 rounded-xl"
                />
              </div>

              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex gap-4">
                <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  LegalAI processes your documents securely. Your data is used only for analysis and is never shared or
                  used to train public models.
                </p>
              </div>
            </CardContent>
            <div className="p-8 pt-0 flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground py-6 rounded-2xl shadow-xl shadow-primary/20 font-bold"
                disabled={isLoading || !file}
              >
                {isLoading ? <Spinner className="mr-2" /> : "Start AI Analysis"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-8 rounded-2xl glass bg-transparent"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
