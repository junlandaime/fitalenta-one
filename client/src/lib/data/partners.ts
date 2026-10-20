export type Partner = {
    name: string;
    logo: string;
};

const partnerFiles: { name: string; file: string }[] = [
    { name: "DIN", file: "DIN-FIX.png" },
    { name: "GMF AeroAsia", file: "gmf aeroasia logo new blue.png" },
    { name: "HIPMI Jabar", file: "logo hipmi jabar.png" },
    { name: "LPIT ITB", file: "logo lpit itb.png" },
    { name: "LSP Manajemen Keuangan", file: "logo lsp manajemen keuangan.jpg" },
    { name: "Masjid Raya Al Jabbar Jawa Barat", file: "logo masjid raya aljabbar jawa barat.png" },
    { name: "Sahejo Eco Park", file: "logo sahejo eco park remove bg.png" },
    { name: "SBN", file: "logo SBN.png" },
    { name: "Sekolah Relawan", file: "logo sekolah relawan.png" },
    { name: "TLE The Local Enables", file: "logo tle the local enables.png" },
    { name: "Aero Globe", file: "logo_aero_globe-removebg-preview.png" },
    { name: "AFSI", file: "logo_afsi-removebg-preview.png" },
    { name: "BBPVP Bandung", file: "logo_bbpvp_bandung-removebg-preview.png" },
    { name: "BMKA", file: "Logo_BMKA.png" },
    { name: "BPRS Al Salaam", file: "logo_bprs_alsalaam-removebg-preview.png" },
    { name: "Dompet Dhuafa", file: "logo_dompet_dhuafa-removebg-preview.png" },
    { name: "Everbright Taiwan", file: "logo_everbright_taiwan-removebg-preview.png" },
    { name: "Faxtor", file: "logo_faxtor-removebg-preview.png" },
    { name: "IMC", file: "logo_IMC-removebg-preview.png" },
    { name: "LSP Administrasi Profesional", file: "logo_lsp_administrasi_profesional-removebg-preview.png" },
    { name: "LSP Beksya", file: "logo_lsp_beksya-removebg-preview.png" },
    { name: "LSP TIKOM Cirebon", file: "logo_lsp_tikom_cirebon-removebg-preview.png" },
    { name: "Ngabotram", file: "logo_ngabotram-removebg-preview.png" },
    { name: "POLHARBAR", file: "LOGO_POLHARBAR-removebg-preview.png" },
    { name: "Prudential", file: "logo_prudential-removebg-preview.png" },
    { name: "Sanbercode", file: "logo_sanbercode-removebg-preview.png" },
    { name: "SDF", file: "Logo_SDF-removebg-preview.png" },
    { name: "SMA Labschool UPI Kampus Cibiru", file: "logo_sma_labschool_upi_kampus_cibiru-removebg-preview.png" },
    { name: "STEMSpark", file: "logo_stemspark-removebg-preview.png" },
    { name: "UICM", file: "logo_UICM-removebg-preview.png" },
    { name: "Universitas Darussalam Gontor", file: "Logo_Universitas_Darussalam_Gontor-removebg-preview.png" },
    { name: "Unla", file: "logo_Unla-removebg-preview.png" },
    { name: "Yayasan Active Club", file: "logo_yayasan_active_club-removebg-preview (1).png" },
    { name: "Yayasan Kiseki", file: "logo_yayasan_kiseki-removebg-preview.png" },
    { name: "Salman ITB", file: "logo-salman-png-fc-1-01-614af1ef5012f.png" },
    { name: "Wakaf Salman ITB", file: "wakaf salman itb.png" },
    { name: "WAN", file: "wan-logo-1.png" },
];

export const partners: Partner[] = partnerFiles.map(({ name, file }) => ({
    name,
    logo: `/partners/${encodeURI(file)}`,
}));