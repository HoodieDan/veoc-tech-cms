"use client";
import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import blogImage from "../../../public/blog-image.png";
import "../assets/styles/preview.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { globalDraft, DraftData } from "@/lib/globalDraft";

type Articles = DraftData & { date?: string; status?: string };

const BlogWriteup: React.FC = () => {
  const [article, setArticle] = useState<Articles | null>(globalDraft.data);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // Perform all validation checks in useEffect
  useEffect(() => {
    // Check type validity
    if (type !== "create" && type !== "view") {
      console.log("Invalid type, redirecting to /articles");
      router.replace("/articles");
      return;
    }

    // Check if article is null or empty
    if (!article) {
      console.log("Article is null, redirecting to /articles");
      router.replace("/articles");
      return;
    }

    const isArticleEmpty =
      article.title === "" &&
      article.author === "" &&
      article.tags === "" &&
      article.coverImage === "" &&
      article.content.length === 0;

    if (isArticleEmpty) {
      console.log("Article is empty, redirecting to /articles");
      router.replace("/articles");
    }
  }, [article, type, router]);

  // Prevent rendering until useEffect completes
  if (!article) return null;

  const handlePublish = async () => {
    if (!article) return;

    setSubmitting(true);
    try {
      const url = article.id ? `/api/article/${article.id}` : "/api/article";
      const method = article.id ? "patch" : "post";

      const { data } = await axios({
        method,
        url,
        data: { ...article, status: "published" },
        headers: { "Content-Type": "application/json" },
      });

      globalDraft.data = {
        title: "",
        author: "",
        tags: "",
        coverImage: "",
        content: [],
      }; // Clear global draft after publishing
      globalDraft.fromPreview = false; // Reset flag
      router.push("/articles");

      setArticle((prev) => (prev ? { ...prev, id: data.id } : prev));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to publish article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="blog__writeup text-white">
      <section className="hero py-10 px-20">
        <div className="container py-5">
          <div className="flex justify-between items-center mb-10">
            <Link
              href="#"
              className="flex gap-3"
              onClick={(e) => {
                e.preventDefault();
                console.log("Navigating back, globalDraft.fromPreview set to:", true);
                globalDraft.fromPreview = true; // Set flag
                window.history.back();
              }}
            >
              <ChevronLeft /> Go Back
            </Link>

            {(!article.status || article.status !== "published") && (
              <div className="flex items-center gap-4">
                <Button
                  className="bg-accent"
                  onClick={handlePublish}
                  disabled={submitting}
                >
                  {submitting ? "Publishing..." : "Publish"}
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {article.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .map((tag: string, index: number) => (
                <div key={index} className="border rounded-[32px] px-5 py-3">
                  <p>{tag.trim()}</p>
                </div>
              ))}
          </div>

          <h1 className="my-3 w-100 text-6xl font-bold">{article.title}</h1>

          <div className="flex gap-3">
            <p>
              <span className="text-gray">Written By: </span>
              {article.author}
            </p>
            <p>
              <span className="text-gray">Updated On: </span>
              {article.date ??
                new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </div>

          <Image
            src={article.coverImage || blogImage}
            alt="blog image"
            className="my-4"
            width={700}
            height={300}
          />

          <div className="writeup flex flex-wrap mt-5">
            <div className="w-full lg:w-1/3 mb-4 text-gray">
              <p className="mb-2">CONTENT</p>
              {article.content
                .filter((paragraph) => paragraph.type === "paragraph")
                .map(({ paragraphTitle }, index) => (
                  <p key={index} className="mb-1">{`${index + 1}. ${paragraphTitle?.toUpperCase()}`}</p>
                ))}
            </div>

            <div className="w-full lg:w-2/3">
              {article.content.map((item, index) => {
                if (item.type === "paragraph") {
                  return (
                    <div key={index}>
                      <h6 className="mb-2 font-bold text-lg">{item.paragraphTitle}</h6>
                      <p className="mb-1">{item.paragraphText}</p>
                    </div>
                  );
                }
                return (
                  <Image
                    key={index}
                    src={item.imageFile}
                    alt="blog image"
                    width={800}
                    height={500}
                    className="my-4"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const BlogWriteUpWrapped = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-white">
          Loading...
        </div>
      }
    >
      <BlogWriteup />
    </Suspense>
  );
};

export default BlogWriteUpWrapped;