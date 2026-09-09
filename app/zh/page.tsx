import type { Metadata } from "next";
import Site from "@/components/Site";
export const metadata: Metadata = {
  title: "Swob — 你和 AI 的每一天，看得见、找得回、拿得出",
  description: "Swob 读取 Claude Code、Codex、Cursor 等工具留在你 Mac 上的会话，变成一座属于你的本地资料库：每天的 AI 日记、随时找回的会话、可以拿出去的分享、以及一份诚实的 AI 效率审计。",
  alternates: { canonical: "https://swob.app/zh" },
};
export default function Page() { return <Site lang="zh" />; }
