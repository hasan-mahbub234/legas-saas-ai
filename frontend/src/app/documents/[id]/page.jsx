"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { documentsAPI, aiAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Download,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Send,
  User,
  Bot,
  AlertCircle,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [doc, setDoc] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load document and analysis (required)
        const [docData, analysisData] = await Promise.all([
          documentsAPI.get(id),
          documentsAPI.getAnalysis(id),
        ]);
        setDoc(docData);
        setAnalysis(analysisData);

        // Try to load chat history (optional)
        try {
          const historyData = await aiAPI.getChatHistory(id, {
            skip: 0,
            limit: 50,
          });
          const history = historyData.history.reverse().flatMap((h) => [
            { role: "user", content: h.question },
            { role: "assistant", content: h.answer },
          ]);
          setMessages(history);
        } catch (chatError) {
          console.warn("Could not load chat history:", chatError);
          setMessages([]);
        }
      } catch (error) {
        toast({
          title: "Error loading document",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!question.trim() || chatLoading) return;

    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setChatLoading(true);

    try {
      const response = await aiAPI.chat({
        document_id: Number.parseInt(id),
        question: userMsg.content,
        temperature: 0.7,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer },
      ]);
    } catch (error) {
      toast({
        title: "Chat error",
        description: error.message,
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentsAPI.delete(id);
      toast({ title: "Document deleted successfully" });
      router.push("/documents");
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Helper function to get risk level badge color
  const getRiskLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "LOW":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!doc) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <p>Document not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight truncate max-w-md">
                {doc.original_filename}
              </h1>
              <p className="text-sm text-muted-foreground">
                Uploaded {new Date(doc.created_at).toLocaleDateString()} •{" "}
                {Math.round(doc.file_size / 1024)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="glass bg-transparent"
              onClick={() => window.open(documentsAPI.download(id))}
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-5 gap-6 min-h-0">
          {/* LEFT CONTENT - SCROLLABLE */}
          <div className="lg:col-span-3 h-full min-h-0">
            <Card className="h-full glass flex flex-col overflow-hidden">
              <Tabs defaultValue="analysis" className="flex-1 flex flex-col">
                <CardHeader className="pb-0 border-b border-border/50">
                  <TabsList className="bg-transparent h-12 gap-6">
                    <TabsTrigger
                      value="analysis"
                      className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0"
                    >
                      AI Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0"
                    >
                      Extracted Text
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-6">
                    <TabsContent value="analysis" className="m-0 space-y-8">
                      {/* Summary */}
                      <section>
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-primary" />{" "}
                          Executive Summary
                        </h3>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 leading-relaxed">
                          {analysis?.summary || "No summary available."}
                        </div>
                      </section>

                      {/* Key Points */}
                      <section>
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-500" /> Key
                          Points
                        </h3>
                        <ul className="space-y-3">
                          {analysis?.key_points?.map((point, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                              {typeof point === "string"
                                ? point
                                : point.text || JSON.stringify(point)}
                            </li>
                          ))}
                        </ul>
                      </section>

                      {/* Risks - FIXED: Handle object risks */}
                      <section>
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-red-500" />{" "}
                          Potential Risks
                        </h3>
                        <div className="grid gap-3">
                          {analysis?.risks?.map((risk, i) => {
                            // Handle both string and object risks
                            if (typeof risk === "string") {
                              return (
                                <div
                                  key={i}
                                  className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-sm"
                                >
                                  {risk}
                                </div>
                              );
                            } else if (
                              typeof risk === "object" &&
                              risk !== null
                            ) {
                              // It's an object with description, level, etc.
                              return (
                                <div
                                  key={i}
                                  className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-sm"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge
                                      className={`px-2 py-0.5 text-xs ${getRiskLevelColor(
                                        risk.level
                                      )}`}
                                    >
                                      {risk.level || "UNKNOWN"}
                                    </Badge>
                                    {risk.confidence && (
                                      <span className="text-xs text-muted-foreground">
                                        Confidence:{" "}
                                        {Math.round(risk.confidence * 100)}%
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-medium mb-2">
                                    {risk.description}
                                  </p>
                                  {risk.clause_text && (
                                    <p className="text-xs text-muted-foreground mb-2">
                                      Clause: {risk.clause_text}
                                    </p>
                                  )}
                                  {risk.recommendation && (
                                    <p className="text-xs text-accent">
                                      <span className="font-medium">
                                        Recommendation:
                                      </span>{" "}
                                      {risk.recommendation}
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                          {(!analysis?.risks ||
                            analysis.risks.length === 0) && (
                            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground text-center">
                              No risks identified
                            </div>
                          )}
                        </div>
                      </section>

                      {/* Recommendations */}
                      <section>
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-accent" />{" "}
                          Recommendations
                        </h3>
                        <div className="grid gap-3">
                          {analysis?.recommendations?.map((rec, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm"
                            >
                              {typeof rec === "string"
                                ? rec
                                : rec.text || JSON.stringify(rec)}
                            </div>
                          ))}
                          {(!analysis?.recommendations ||
                            analysis.recommendations.length === 0) && (
                            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground text-center">
                              No recommendations available
                            </div>
                          )}
                        </div>
                      </section>
                    </TabsContent>

                    <TabsContent value="text" className="m-0">
                      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground p-2">
                        {doc.extracted_text || "Text not yet available."}
                      </div>
                    </TabsContent>
                  </ScrollArea>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* RIGHT CHAT - FIXED/STICKY WITH SCROLLABLE CONTENT */}
          <div className="lg:col-span-2 h-full min-h-0">
            <div className="sticky top-6 h-[calc(100vh-8rem)] flex flex-col">
              <Card className="flex-1 glass flex flex-col overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" /> AI
                    Document Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p>Ask anything about this document.</p>
                        </div>
                      )}
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex gap-3 ${
                            msg.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl h-fit ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted border border-border/50"
                            }`}
                          >
                            {msg.role === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>
                          <div
                            className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-primary/10 border border-primary/20 text-primary-foreground"
                                : "bg-background/50 border border-border/50"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex gap-3">
                          <div className="p-2 rounded-xl bg-muted border border-border/50 h-fit">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                            <Spinner className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-border/50 bg-background/30">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder="Ask a question..."
                        className="bg-background/50 border-border/50 rounded-xl h-12"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={chatLoading}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-12 w-12 rounded-xl"
                        disabled={chatLoading || !question.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
