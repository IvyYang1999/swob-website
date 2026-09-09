import type { Metadata } from "next";
import Sources from "@/components/Sources";
export const metadata: Metadata = { title: "Source capability matrix · Swob", description: "No logo walls. What each source actually supports, marked available, experimental or unavailable." };
export default function Page() { return <Sources lang="en" />; }
