import type { Metadata } from "next";
import Sources from "@/components/Sources";
export const metadata: Metadata = { title: "来源能力矩阵 · Swob", description: "不做 logo 墙。每个来源支持到什么程度，这张表说了算。" };
export default function Page() { return <Sources lang="zh" />; }
