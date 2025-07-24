"use client";
import React, { useEffect, useState } from 'react';
import ArticlesTable, { Articles } from '../components/articles-table';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { Plus } from 'lucide-react';
import HighlightCard from '../components/highlight_card';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { globalDraft, DraftData } from '@/lib/globalDraft';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get("/api/article");

        if (data.success) {
          const formattedArticles = data.articles.map((article: { _id: string }) => ({
            id: article._id,
            ...article
          }));

          setArticles(formattedArticles);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching articles:", error);
        alert(error instanceof Error ? error.message : "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const stats = [
    { id: 1, subtext: "Open Job Listings", text: "5000" },
    { id: 2, subtext: "Closed Job Listings", text: "2500" },
    { id: 3, subtext: "Drafts", text: "1500" },
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
    <div className='p-4'>
      <h3 className='font-bold text-3xl mb-3'>Dashboard Overview</h3>

      <div className='mb-5'>
        <div className="flex justify-between space-x-8">
          {stats.map((item) => (
            <HighlightCard
              key={item.id}
              subtext={item.subtext}
              text={item.text}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <h3 className='font-bold text-3xl'>Articles</h3>

        <Link href="/create-article">
          <Button
            className="bg-accent hover:bg-accent/90 px-6 py-3"
            onClick={() => {
              globalDraft.data = initialDraft; // Reset global draft
              router.push("/create-article");
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
      ) : (
        <ArticlesTable
          data={articles}
          onDeleteArticle={(id: string) => setArticles((prev) => prev.filter(a => a.id !== id))}
        />
      )}
    </div>
  );
};

export default ArticlesPage;