import { getArticleBySlug } from "@/services/article-service";
import { formatDate, formatPlainText, imageUrl, stripHtml } from "@/lib/utils";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RelatedArticles } from "../features/related-article";
import PageHero from "@/components/common/page-hero";
import { ShareButtons } from "../features/share-section";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const detail = await getArticleBySlug(slug);
    if (!detail) return { title: "Article not found - FITALENTA" };

    const { article } = detail;
    const image = imageUrl(article.image);
    return {
        title: `${article.title} | FITALENTA`,
        description: stripHtml(article.excerpt).slice(0, 160),
        openGraph: {
            type: "article",
            publishedTime: article.publishedAt,
            images: image ? [image] : undefined,
        },
    };
}

export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    const detail = await getArticleBySlug(slug);
    if (!detail) notFound();

    const { article, relatedArticles } = detail;
    const image = imageUrl(article.image);

    return (
        <>
            <PageHero
                badge="FITALENTA Blog"
                title={article.title}
                crumbs={[{ label: "Home", href: "/" }, { label: "Articles" }, { label: article.title }]}
            />

            <section className="bg-slate-50 py-12">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_22rem] lg:items-start">
                    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                        {image && (
                            <div className="relative aspect-video bg-slate-100">
                                <Image
                                    src={image}
                                    alt={article.title}
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 720px, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6 sm:p-8">
                            <header className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                                <div>
                                    <p className="font-semibold text-slate-900">{article.author?.name ?? "Admin"}</p>
                                    <p className="text-sm text-slate-500">
                                        Published on{" "}
                                        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                                    </p>
                                </div>
                                {article.category && (
                                    <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase text-primary">
                                        {article.category.name}
                                    </span>
                                )}
                            </header>
                            <div className="mt-6 whitespace-pre-line leading-8 text-slate-700">
                                {formatPlainText(article.content)}
                            </div>
                        </div>
                    </article>

                    {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles.slice(0, 3)} />}
                </div>
            </section>

            <ShareButtons slug={article.slug} title={article.title} />
        </>
    );
}