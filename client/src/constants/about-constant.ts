import { AboutContent } from "@/types/about";
import { BadgeCheck, Component, UserRound, Zap } from "lucide-react";

const about: AboutContent = {
    hero: {
        title: "About FITALENTA",
        subtitle:
            "Become a company partner to provide a reliable workforce, improve the capabilities of employees, and achieve financial growth through target-based business assistance.",
    },
    story: {
        paragraphs: [
            "PT FAST Indo Talenta (FITALENTA) lahir dengan tekad kuat untuk menjembatani kesenjangan antara dunia pendidikan dan dunia kerja di Indonesia. Semakin banyak lulusan baru yang menghadapi tantangan dalam mencari pekerjaan, meskipun tingkat partisipasi tenaga kerja terus meningkat. FITALENTA hadir sebagai solusi atas permasalahan ini, dengan menawarkan layanan rekrutmen, pengembangan keterampilan, dan mentoring bisnis yang dirancang khusus untuk membantu individu siap terjun ke dunia kerja.",
            "Sebagai bagian dari misinya, FITALENTA berfokus pada penciptaan ekosistem yang mempercepat proses rekrutmen dengan memanfaatkan teknologi terkini untuk menghubungkan talenta-talenta unggul dengan kesempatan kerja yang sesuai. Dengan semangat #EmpoweringPeople, FITALENTA berkomitmen untuk meningkatkan kualitas sumber daya manusia Indonesia.",
        ],
        image: "/images/office.png",
    },
    vision:
        "Menjadi life time partner untuk Perusahaan dan individu untuk mencapai kesejahteraan finansial yang berkesinambungan.",
    missions: [
        "Menjadi partner perusahaan Anda dalam mencapai tujuan finansial melalui penyediaan tenaga kerja handal.",
        "Meningkatkan kemampuan karyawan perusahaan Anda melalui pelatihan terkini sesuai kebutuhan industri.",
        "Menjadi partner perusahaan untuk mencapai pertumbuhan finansial melalui pendampingan bisnis berbasis target.",
    ],
    journey: [
        {
            year: "2023",
            text: "FITALENTA was founded with the vision to empower businesses and individuals by bridging the gap between talent and opportunity.",
        },
        {
            year: "2024",
            text: "FITALENTA is strengthening its foundation and expanding into seven key services: Financial Industry Services, Human Capital Program, Next Level Eduventures, Business Affiliate Program, Marketing Program, Event Organizer, and STEMSpark. These services provide comprehensive solutions, empowering individuals and businesses to grow in a competitive market.",
        },
    ],
    values: [
        { icon: Zap, title: "Forward Thinking", desc: "Inovatif dan Proaktif" },
        { icon: UserRound, title: "Agile Mindset", desc: "Berpikir & Bergerak Cepat" },
        { icon: BadgeCheck, title: "Solution Oriented", desc: "Kreatif dan Komprehensif" },
        { icon: Component, title: "Trustworthy", desc: "Berintegritas" },
    ],
    director: "/images/director.jpg",
    team: "/images/team.jpg",
};

export async function getAbout(): Promise<AboutContent> {
    return about;
}