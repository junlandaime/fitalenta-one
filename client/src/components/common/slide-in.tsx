"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function SlideIn({
    children,
    direction = "left",
    delay = 0,
}: {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
}) {
    const reduceMotion = useReducedMotion();

    // Hormati pengaturan "reduce motion" milik pengguna: tampilkan langsung tanpa animasi.
    if (reduceMotion) return <div>{children}</div>;

    const dropIn: Variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
            y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.6, delay: delay, ease: "easeOut" },
        },
    };

    return (
        <motion.div
            variants={dropIn}
            initial="hidden"
            whileInView="visible"
            // PERBAIKAN: amount "some" = animasi jalan begitu ada sedikit bagian elemen yang terlihat.
            // Sebelumnya amount 0.3 (30% tinggi elemen) tidak pernah tercapai untuk elemen tinggi di mobile.
            viewport={{ once: true, amount: "some" }}
        >
            {children}
        </motion.div>
    );
}
