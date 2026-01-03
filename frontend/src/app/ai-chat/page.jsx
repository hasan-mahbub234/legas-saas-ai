"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { documentsAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, ArrowRight, Bot, ShieldCheck } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

export default function AIChatOverviewPage() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDocs() {
      try {
        const response = await documentsAPI.list({ limit: 100 })
        setDocs(response.documents.filter((d) => d.status === "PROCESSED"))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">Select a processed document to start chatting with the AI.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <Link key={doc.id} href={`/documents/${doc.id}`}>
              <Card className="glass h-full hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg truncate">{doc.original_filename}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {doc.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Bot className="w-4 h-4" />
                    AI Ready for Questions
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {docs.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed">
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <h3 className="text-xl font-bold mb-2">No Processed Documents</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Once your documents are processed by AI, they will appear here for interactive chatting.
              </p>
              <Link href="/documents/upload">
                <Button className="mt-6 bg-primary text-primary-foreground">Upload Document</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
