"use client"
import React from 'react';
import Image from 'next/image';
import blogImage from "../../../public/blog-image.png";
import '../assets/styles/preview.css';
import Link from "next/link"
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const BlogWriteup: React.FC = () => {
    return (
        <div className='blog__writeup text-white'>
            <section className='hero py-10 px-20'>
                <div className="container py-5">
                    <div className="flex justify-between items-center mb-10">
                        <Link href="#" className='flex gap-3' onClick={() => window.history.back()}> <ChevronLeft /> Go Back</Link>

                        <div className="flex items-center gap-4">
                            <p>Save as draft</p>
                            <Button className='bg-accent'>Publish</Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="border rounded-[32px] px-5 py-3">
                            <p className="">UI/UX Design</p>
                        </div>
                        <div className="border rounded-[32px] px-5 py-3">
                            <p className="">UI/UX Design</p>
                        </div>
                    </div>

                    <h1 className="my-3 w-100 text-6xl font-bold">
                        The Power of Design: How a Great UX/UI Transforms Businesses
                    </h1>

                    <div className="flex gap-3">
                        <p><span className="text-gray">Written By:</span> Jumai Idowu</p>
                        <p><span className="text-gray">Updated On:</span> December 13, 2023</p>
                    </div>

                    <Image src={blogImage} alt="blog image" className="my-4" />

                    <div className="writeup flex flex-wrap mt-5">
                        <div className="w-full lg:w-1/3 mb-4 text-gray">
                            <p className='mb-2'>CONTENT</p>
                            <p className="mb-1">1. INTRODUCTION</p>
                        </div>

                        <div className="w-full lg:w-2/3">
                            <h6 className='mb-2 font-bold text-lg'>Introduction</h6>
                            <p className='mb-1'>In today&apos;s digital-first world, businesses rely on compelling design to stand out. Whether it&apos;s a website, mobile app, or enterprise software, user experience (UX) and user interface (UI) design are crucial for success. A well-crafted design can increase engagement, improve conversion rates, and build brand trust. But what exactly makes great design so powerful?</p>
                            <p className='mb-1'>In today&apos;s digital-first world, businesses rely on compelling design to stand out. Whether it&apos;s a website, mobile app, or enterprise software, user experience (UX) and user interface (UI) design are crucial for success. A well-crafted design can increase engagement, improve conversion rates, and build brand trust. But what exactly makes great design so powerful?</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogWriteup;