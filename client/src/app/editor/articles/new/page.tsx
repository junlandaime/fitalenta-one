import type { Metadata } from "next";
import { ArticleFormView } from "../features/article-form-view";

export const metadata: Metadata = {
    title: "Tambah Artikel - FITALENTA",
};

export default function EditorArticleCreatePage() {
    return <ArticleFormView />;
}
