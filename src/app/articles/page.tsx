"use client";
import React, { useEffect, useState, useMemo } from "react";
import ArticlesTable, { Articles } from "../components/articles-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import HighlightCard from "../components/highlight_card";
import axios from "axios";
import { globalDraft, DraftData } from "@/lib/globalDraft";

// Define article status enum (use Status from utils/customTypes.ts if available)
enum ArticleStatus {
  PUBLISHED = "published",
  DRAFTS = "drafts",
}

// If using Status from utils/customTypes.ts, import instead:
// import { Status } from "@/utils/customTypes";

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/article");
      if (data.success) {
        const formattedArticles = data.articles.map((article: { _id: string }) => ({
          id: article._id,
          ...article,
        }));
        setArticles(formattedArticles);
      } else {
        setError("Failed to fetch articles");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Calculate article counts dynamically
  const articleCounts = useMemo(() => {
    if (!Array.isArray(articles)) return { published: 0, drafts: 0, total: 0 };
    return articles.reduce(
      (acc, article) => {
        if (article.status === ArticleStatus.PUBLISHED) acc.published++;
        else if (article.status === ArticleStatus.DRAFTS) acc.drafts++;
        acc.total++;
        return acc;
      },
      { published: 0, drafts: 0, total: 0 }
    );
  }, [articles]);

  // Define stats using dynamic counts
  const stats = [
    { id: 1, subtext: "Published Articles", text: articleCounts.published.toString() },
    { id: 2, subtext: "Draft Articles", text: articleCounts.drafts.toString() },
    { id: 3, subtext: "Total Articles", text: articleCounts.total.toString() },
  ];

  // Define initial draft for resetting globalDraft
  const initialDraft: DraftData = {
    title: "",
    author: "",
    tags: "",
    coverImage: "",
    content: [],
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-3xl mb-3">Dashboard Overview</h3>

      <div className="mb-5">
        <div className="flex justify-between space-x-8">
          {stats.map((item) => (
            <HighlightCard key={item.id} subtext={item.subtext} text={item.text} />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <h3 className="font-bold text-3xl">Articles</h3>

        <Link href="/create-article">
          <Button
            className="bg-accent hover:bg-accent/90 px-6 py-3"
            onClick={() => {
              globalDraft.data = initialDraft; // Reset global draft
            }}
          >
            <Plus /> New Article
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-[5px] border-transparent border-t-accent border-l-accent"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 text-red-600 bg-red-50 rounded border border-red-200">
          Error: {error}
          <button
            onClick={fetchArticles}
            className="ml-4 px-3 py-1 rounded text-sm border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : (
        <ArticlesTable
          data={articles}
          onDeleteArticle={(id: string) => setArticles((prev) => prev.filter((a) => a.id !== id))}
        />
      )}
    </div>
  );
};

export default ArticlesPage;