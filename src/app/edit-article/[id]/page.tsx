// pages/edit/[id].tsx or app/edit/[id]/page.tsx
"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import CreateArticle from "../../components/CreateArticle"; // Updated import path
import { globalDraft, DraftData } from "@/lib/globalDraft";

const EditArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<DraftData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      // Check if coming from preview
      if (globalDraft.fromPreview) {
        console.log("From preview, using globalDraft.data:", globalDraft.data);
        setArticle(globalDraft.data);
        globalDraft.fromPreview = false; // Reset flag
        setLoading(false);
        return;
      }

      // Fetch article from API if not from preview
      try {
        console.log("Fetching article for ID:", id);
        const res = await fetch(`/api/article/${id}`);
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        const article = data.article;

        const validatedArticle: DraftData = {
          title: article.title || "",
          author: article.author || "",
          tags: article.tags || "",
          coverImage: article.coverImage || "",
          content: Array.isArray(article.content) ? article.content : [],
          id: article._id || id,
        };
        console.log("Fetched and validated article:", validatedArticle);
        setArticle(validatedArticle);
        globalDraft.data = validatedArticle; // Initialize global draft's data property
        globalDraft.fromPreview = false; // Reset flag
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading article...</p>;
  if (!article) return <p>Article not found.</p>;
  console.log("Rendering CreateArticle with article:", article);

 return (
  <Suspense fallback={<p>Loading article...</p>}>
    {loading ? (
      <p>Loading article...</p>
    ) : !article ? (
      <p>Article not found.</p>
    ) : (
      <CreateArticle mode="edit" article={article} />
    )}
  </Suspense>
);
};

export default EditArticle;