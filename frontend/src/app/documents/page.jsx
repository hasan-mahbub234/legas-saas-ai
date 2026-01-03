"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { documentsAPI } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Download,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DocumentsListPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const loadDocuments = async () => {
    try {
      const response = await documentsAPI.list({ skip: 0, limit: 100 });
      setDocuments(response.documents);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast({
        title: "Error loading documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentsAPI.delete(id);
      loadDocuments();
      toast({ title: "Document deleted successfully" });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.original_filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              View and manage your uploaded legal documents.
            </p>
          </div>
          <Link href="/documents/upload">
            <Button className="bg-primary text-primary-foreground rounded-full px-6">
              Upload New
            </Button>
          </Link>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 glass border-border/50 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            className="glass border-border/50 rounded-xl bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="glass animate-pulse border-border/50 h-40"
                />
              ))
          ) : filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <Card
                key={doc.id}
                className="glass hover:border-primary/50 transition-all duration-300 group overflow-hidden"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(documentsAPI.download(doc.id))
                          }
                        >
                          <Download className="w-4 h-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(doc.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-bold truncate mt-2 group-hover:text-primary transition-colors">
                    {doc.original_filename}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(doc.created_at).toLocaleDateString()} •{" "}
                    {Math.round(doc.file_size / 1024)} KB
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
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
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-primary"
                      >
                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <h3 className="text-xl font-bold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                Try a different search or upload a new file.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
