import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, User } from "lucide-react";
import type { ArticleItem } from "@/types/article";
import { formatDate, imageUrl, stripHtml } from "@/lib/utils";

export function BlogCard({ article }: { article: ArticleItem }) {
    const src = imageUrl(article.image);
    const href = `/articles/${article.slug}`;

    return (
    
        <article className="group relative z-0 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-primary before:absolute before:inset-0 before:z-0 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
            
            <Link href={href} className="relative block aspect-video overflow-hidden bg-slate-100 z-10">
                {src && (
                    <Image
                        src={src}
                        alt={article.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm transition-colors duration-300 group-hover:bg-secondary group-hover:text-white">
                    {article.category?.name ?? "Blog"}
                </span>
            </Link>

            <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
                
                <h3 className="line-clamp-3 text-lg font-bold leading-snug text-primary transition-colors duration-300 group-hover:text-white">
                    <Link href={href} className="before:absolute before:inset-0">
                        {article.title}
                    </Link>
                </h3>
                
                <p className="line-clamp-4 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-100">
                    {stripHtml(article.excerpt)}
                </p>
                
                <ul className="mt-1 space-y-2 text-sm text-slate-500 transition-colors duration-300 group-hover:text-slate-200">
                    <li className="flex items-center gap-2">
                        <User className="size-4 text-primary transition-colors duration-300 group-hover:text-secondary" />
                        {article.author?.name ?? "Admin"}
                    </li>
                    <li className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-primary transition-colors duration-300 group-hover:text-secondary" />
                        {formatDate(article.publishedAt)}
                    </li>
                </ul>
                
                <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-primary transition-all duration-300 group-hover:bg-white group-hover:text-primary group-hover:ring-white">
                    Read More
                    <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </div>
        </article>
    );
}