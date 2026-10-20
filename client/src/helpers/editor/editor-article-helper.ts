import { htmlToPlainText, looksLikeHtml, toDateTimeInput } from "@/helpers/editor/editor-content-helper";
import type { ArticleFormValues } from "@/schemas/editor/editor-article";
import type { EditorArticle } from "@/types/editor/editor-article";
import type { ContentCategory } from "@/types/editor/editor-content";

export function createEmptyArticleForm(categories: ContentCategory[]): ArticleFormValues {
    return {
        title: "",
        excerpt: "",
        content: "",
        categoryId: categories.length === 1 ? String(categories[0].id) : "",
        publishedAt: "",
        isFeatured: false,
    };
}

export function toArticleFormValues(article: EditorArticle): ArticleFormValues {
    return {
        title: article.title,
        excerpt: article.excerpt,
        content: looksLikeHtml(article.content) ? htmlToPlainText(article.content) : article.content,
        categoryId: String(article.categoryId),
        publishedAt: toDateTimeInput(article.eventDate),
        isFeatured: article.isFeatured,
    };
}
