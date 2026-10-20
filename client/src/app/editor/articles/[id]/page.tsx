import type { Metadata } from "next";
import { ArticleFormView } from "../features/article-form-view";

export const metadata: Metadata = {
    title: "Edit Artikel - FITALENTA",
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditorArticleEditPage({ params }: PageProps) {
    const { id } = await params;
    return <ArticleFormView articleId={Number(id)} />;
}
