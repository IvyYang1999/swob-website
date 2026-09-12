import type { Metadata } from "next";
import Site from "@/components/Site";
export const metadata: Metadata = { alternates: {"canonical": "https://swob.app/", "languages": {"en": "https://swob.app/", "zh-CN": "https://swob.app/zh"}} };
export default function Page() { return <Site lang="en" />; }
