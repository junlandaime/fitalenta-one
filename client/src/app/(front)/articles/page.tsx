import PageHero from "@/components/common/page-hero";
import { getArticles, getFeaturedArticles } from "@/services/article-service";
import type { Metadata } from "next";
import { FeaturedArticle } from "./features/feature-article";
import { BlogCard } from "./features/blog-card";
import { Pagination } from "@/components/common/pagination";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SlideIn from "@/components/common/slide-in"; // 1. Import komponen SlideIn

export const metadata: Metadata = {
    title: "Blog - FITALENTA",
    description: "Insights, tips, and news from the world of business and talent management.",
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, Number(page) || 1);

    const [{ articles, pagination }, featured] = await Promise.all([
        getArticles({ page: currentPage }),
        currentPage === 1 ? getFeaturedArticles() : Promise.resolve([]),
    ]);

    return (
        <section>
            <PageHero
                badge="FITALENTA Blog"
                title="FITALENTA Blog"
                subtitle="Insights, tips, and news from the world of business and talent management"
                crumbs={[{ label: "Home", href: "/" }, { label: "Articles" }]}
                bgImage="/blog-hero.png" 
            />

            {featured[0] && (
                <SlideIn direction="up">
                    <FeaturedArticle article={featured[0]} />
                </SlideIn>
            )}

            <div className="bg-slate-50 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    
                    <SlideIn direction="up">
                        <div className="mb-10 text-center">
                            <p className="text-sm font-medium text-primary">Latest articles</p>
                            <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">
                                Explore Our Articles
                            </h2>
                            <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-secondary" />
                        </div>
                    </SlideIn>

                    {articles.length === 0 ? (
                        <p className="py-16 text-center text-slate-500">No articles yet. Check back soon.</p>
                    ) : (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article, index) => (
                                <li key={article.id} className="flex">
                                    <SlideIn direction="up" delay={index * 0.1}>
                                        <div className="h-full w-full">
                                            <BlogCard article={article} />
                                        </div>
                                    </SlideIn>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-10">
                        <SlideIn direction="up" delay={0.2}>
                            <Pagination basePath="/articles" pagination={pagination} />
                        </SlideIn>
                    </div>
                </div>
            </div>

            <div className="py-20">
                <SlideIn direction="up">
                    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
                        <p className="text-sm font-medium text-primary">Stay connected</p>
                        <h2 className="text-3xl font-bold md:text-4xl">Stay Updated with FITALENTA</h2>
                        <p className="text-slate-600">Subscribe to our newsletter for the latest insights and industry trends.</p>
                        <Link
                            href="/contact"
                            className="mt-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold bg-primary text-white transition hover:bg-primary/90 hover:scale-105"
                        >
                            Get in Touch
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </SlideIn>
            </div>
        </section>
    );
}