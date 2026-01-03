"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { documentsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    processing: 0,
    failed: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await documentsAPI.list({ limit: 5 });
        setRecentDocs(response.documents);

        const allDocs = await documentsAPI.list({ limit: 100 });
        const counts = allDocs.documents.reduce(
          (acc, doc) => {
            acc.total++;
            if (doc.status === "PROCESSED") acc.processed++;
            else if (doc.status === "PROCESSING") acc.processing++;
            else if (doc.status === "FAILED") acc.failed++;
            return acc;
          },
          { total: 0, processed: 0, processing: 0, failed: 0 }
        );

        setStats(counts);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    {
      title: "Total Documents",
      value: stats.total,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Processed",
      value: stats.processed,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Processing",
      value: stats.processing,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Monitor and manage your legal documents.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <Card key={i} className="glass overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Documents</CardTitle>
              <Link href="/documents">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentDocs.length > 0 ? (
                <div className="space-y-4">
                  {recentDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-background border border-border/50">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold truncate max-w-[200px] md:max-w-md">
                            {doc.original_filename}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString()} •{" "}
                            {Math.round(doc.file_size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            doc.status === "PROCESSED"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : doc.status === "FAILED"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {doc.status}
                        </span>
                        <Link href={`/documents/${doc.id}`}>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">
                    No documents uploaded yet.
                  </p>
                  <Link href="/documents/upload">
                    <Button className="mt-4 bg-primary text-primary-foreground">
                      Upload your first document
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass border-border/50 h-fit">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/documents/upload" className="block">
                <Button className="w-full justify-start gap-3 h-14 rounded-2xl bg-primary text-primary-foreground">
                  <Plus className="w-5 h-5" />
                  Analyze New Document
                </Button>
              </Link>
              <Link href="/ai-chat" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-14 rounded-2xl glass bg-transparent"
                >
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Chat with AI
                </Button>
              </Link>
              <div className="pt-4 p-4 rounded-2xl bg-accent/5 border border-accent/20">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Security Status
                </p>
                <p className="text-xs text-muted-foreground">
                  Your data is encrypted with enterprise-grade security.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
