"use client"
import React from 'react';
import ArticlesTable, { Articles } from '../components/articles-table';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { Plus } from 'lucide-react';
import HighlightCard from '../components/highlight_card';

const ArticlesPage: React.FC = () => {

    const stats = [
        { id: 1, subtext: "Open Job Listings", text: "5000" },
        { id: 2, subtext: "Closed Job Listings", text: "2500" },
        { id: 3, subtext: "Drafts", text: "1500" },
    ]

    const data: Articles[] = [
        {
          id: "m5gr84i9",
          title: 'The Picture of Dorian Gray',
          author: 'Oscar Wilde',
          date: 'Mar 1, 2025',
          status: "drafts",
        },
        {
          id: "3u1reuv4",
          title: 'The Poems of Oscar Wilde',
          author: 'Oscar Wilde',
          date: 'Mar 1, 2025',
          status: "published",
        },
        {
          id: "derv1ws0",
          title: 'The Nightingale and The Rose',
          author: 'Oscar Wilde',
          date: 'Mar 1, 2025',
          status: "drafts",
        },
        {
          id: "5kma53ae",
          title: 'Cusentos De Oscar Wilde',
          author: 'Oscar Wilde',
          date: 'Mar 1, 2025',
          status: "published",
        },
        {
          id: "bhqecj4p",
          title: 'The Ballad of Reading Gaol',
          author: 'Oscar Wilde',
          date: 'Mar 1, 2025',
          status: "drafts",
        },
      ]

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
                    <Button className="bg-accent hover:bg-accent/90 px-6 py-3"> <Plus /> New Article</Button>
                </Link>
            </div>

            <ArticlesTable data={data} />
        </div>
    );
};

export default ArticlesPage;