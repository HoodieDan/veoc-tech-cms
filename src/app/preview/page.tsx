"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import blogImage from "../../../public/blog-image.png";
import '../assets/styles/preview.css';
import Link from "next/link"
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Articles } from '../components/articles-table';
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation';


const BlogWriteup: React.FC = () => {
    const [article, setArticle] = useState<Articles | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams()
    const type = searchParams.get("type");


    useEffect(() => {

        if (type !== "create" && type !== "view") {
            router.replace("/articles");
            return;
        }
    

        const savedArticle = localStorage.getItem(type);
        console.log(savedArticle);
        

        if (!savedArticle) {
            router.replace("/articles");
            return;
        }
        const parsedArticle = JSON.parse(savedArticle);
        setLoading(false);
        setArticle(parsedArticle);
    }, [type, router]);



    const handlePublish = async () => {
        if (!article) return;

        setSubmitting(true);
        try {
            const url = article.id
                ? `/api/article/${article.id}`  // Update existing article
                : "/api/article";  // Create new article

            const method = article.id ? "patch" : "post"; // Decide HTTP method

            const { data } = await axios({
                method,
                url,
                data: {...article, status: "published"},
                headers: { "Content-Type": "application/json" },
            });
            localStorage.removeItem("create");

            router.push("/articles");

            setArticle((prev) => prev ? { ...prev, id: data.id } : prev);
        } catch (error) {
            console.error(error);
            alert(error || "Failed to publish article");
        } finally {
            setSubmitting(false);
        }
    };


    if (!loading) return (
        <div className='blog__writeup text-white'>
            <section className='hero py-10 px-20'>
                <div className="container py-5">
                    <div className="flex justify-between items-center mb-10">
                        <Link href="#" className='flex gap-3' onClick={() => {
                            window.history.back()
                            localStorage.removeItem(type === "view" ? 'view' : "view");

                        }}> <ChevronLeft /> Go Back</Link>

                        {(article?.status === "drafts" || type === "create") && (
                            <div className="flex items-center gap-4">
                                <Button className="bg-accent" onClick={handlePublish} disabled={submitting}>
                                    {submitting ? "Publishing..." : "Publish"}
                                </Button>
                            </div>

                        )}

                    </div>


                    <div className="flex flex-wrap gap-3">
                        {article?.tags.split(",").map((tag: string) => tag.trim()).map((tag: string, index: number) => (
                            <div key={index} className="border rounded-[32px] px-5 py-3">
                                <p>{tag.trim()}</p>
                            </div>
                        ))}


                        {/* 
                        <div className="border rounded-[32px] px-5 py-3">
                            <p className="">UI/UX Design</p>
                        </div>
                        <div className="border rounded-[32px] px-5 py-3">
                            <p className="">UI/UX Design</p>
                        </div> */}
                    </div>

                    <h1 className="my-3 w-100 text-6xl font-bold">
                        {article?.title}
                    </h1>

                    <div className="flex gap-3">
                        <p><span className="text-gray">Written By: </span>{article?.author}</p>
                        <p><span className="text-gray">Updated On: </span> {article?.date ?? new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}</p>

                    </div>

                    <Image src={article?.coverImage || blogImage} alt="blog image" className="my-4" width={700} height={300} />

                    <div className="writeup flex flex-wrap mt-5">
                        <div className="w-full lg:w-1/3 mb-4 text-gray">
                            <p className='mb-2'>CONTENT</p>
                            {article?.content
                                .filter((paragraph) => paragraph.type === "paragraph")
                                .map(({ paragraphTitle }, index) =>
                                    (<p key={index} className="mb-1">{`${index + 1}. ${paragraphTitle?.toUpperCase()}`}</p>)
                                )}
                            {/* <p className="mb-1">1. INTRODUCTION</p> */}
                        </div>

                        <div className="w-full lg:w-2/3">
                            {article?.content
                                .map(({ paragraphTitle, paragraphText, type, imageFile }, index) => {
                                    if (type === "paragraph")
                                        return (<div key={index}>
                                            <h6 className='mb-2 font-bold text-lg'>{paragraphTitle}</h6>
                                            <p className='mb-1'>{paragraphText}</p>
                                        </div>)
                                    return <Image
                                        key={index}
                                        src={imageFile}
                                        alt="blog image"
                                        width={800} // Set your desired width
                                        height={500} // Set your desired height
                                        className="my-4"
                                    />
                                }
                                )}

                        </div>

                        {/* <div className="w-full lg:w-2/3">
                            <h6 className='mb-2 font-bold text-lg'>Introduction</h6>
                            <p className='mb-1'>In today&apos;s digital-first world, businesses rely on compelling design to stand out. Whether it&apos;s a website, mobile app, or enterprise software, user experience (UX) and user interface (UI) design are crucial for success. A well-crafted design can increase engagement, improve conversion rates, and build brand trust. But what exactly makes great design so powerful?</p>
                            <p className='mb-1'>In today&apos;s digital-first world, businesses rely on compelling design to stand out. Whether it&apos;s a website, mobile app, or enterprise software, user experience (UX) and user interface (UI) design are crucial for success. A well-crafted design can increase engagement, improve conversion rates, and build brand trust. But what exactly makes great design so powerful?</p>
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogWriteup;