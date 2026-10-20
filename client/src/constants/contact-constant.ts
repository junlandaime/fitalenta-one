export type ContactInfo = {
    addressLines: string[];
    phone: string;
    email: string;
    mapEmbedUrl: string;
    mapsUrl: string;
    socials: { name: "facebook" | "instagram" | "linkedin"; href: string }[];
};

const contact: ContactInfo = {
    addressLines: [
        "Gedung Science Techno Park ITB",
        "Jl. Ganesha No. 15E,",
        "Lb. Siliwangi, Kec. Coblong",
        "Bandung 40132",
    ],
    phone: "+62 811 10119273",
    email: "info@fitalenta.co.id",
    mapEmbedUrl:
        "https://www.google.com/maps?q=Gedung+Science+Techno+Park+ITB+Bandung&output=embed",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gedung+Science+Techno+Park+ITB+Bandung",
    socials: [
        { name: "facebook", href: "https://www.facebook.com/people/PT-FAST-Indo-Talenta/61550075167981/ " },
        { name: "instagram", href: "https://www.instagram.com/fitalenta.id/" },
        { name: "linkedin", href: "https://www.linkedin.com/company/pt-fast-indo-talenta/" },
    ],
};

export async function getContactMock(): Promise<ContactInfo> {
    return contact;
}