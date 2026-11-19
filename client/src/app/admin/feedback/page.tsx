import type { Metadata } from "next";
import { FeedbackManagementView } from "./features/feedback-management-view";

export const metadata: Metadata = {
    title: "Feedback User - FITALENTA",
    robots: { index: false, follow: false },
};

export default function AdminFeedbackPage() {
    return <FeedbackManagementView />;
}
