"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col bg-[#141518] text-zinc-100 overflow-hidden select-none">
      {/* 1. TOP HEADER SKELETON (Chuẩn 100% Header Kiểu A) */}
      <header className="flex h-13 shrink-0 items-center justify-between border-b border-[#26272e] bg-[#1a1b20] px-3.5 backdrop-blur-md z-30">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-xl bg-[#282934]" />
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#2e3038]/80">
            <Skeleton className="h-7 w-7 rounded-xl bg-[#282934] shrink-0" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28 rounded-md bg-[#2d303d]" />
              <Skeleton className="h-5 w-20 rounded-lg bg-[#252733] hidden sm:block" />
              <Skeleton className="h-2 w-2 rounded-full bg-[#2d303d]" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-14 rounded-xl bg-[#282934]" />
          <Skeleton className="h-7 w-20 rounded-xl bg-[#282934]" />
          <Skeleton className="h-8 w-8 rounded-xl bg-[#282934]" />
        </div>
      </header>

      {/* 2. BODY 3-PANEL SKELETON */}
      <div className="flex flex-1 w-full min-h-0 overflow-hidden relative">
        {/* Left Sidebar Skeleton (w-72 sm:w-80) */}
        <aside className="hidden md:flex w-72 sm:w-80 flex-col border-r border-[#26272e] bg-[#18191e] shrink-0">
          {/* Sub-Header */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#26272e] px-3.5 bg-[#1a1b20]">
            <Skeleton className="h-3.5 w-18 rounded-md bg-[#2b2d3a]" />
            <Skeleton className="h-6 w-20 rounded-xl bg-[#282934]" />
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[#26272e]/60 bg-[#16171b]">
            <Skeleton className="h-8.5 w-full rounded-xl bg-[#20222b]" />
          </div>

          {/* Recent Sessions & Branches Stream */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {/* Active Item Skeleton */}
            <div className="w-full flex items-center gap-3 rounded-2xl p-2.5 bg-[#252733]/90 border border-[#373949]/70">
              <Skeleton className="h-9 w-9 rounded-xl bg-[#2e3140] shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24 rounded-md bg-[#333647]" />
                  <Skeleton className="h-2.5 w-8 rounded-md bg-[#2a2c3a]" />
                </div>
                <Skeleton className="h-3 w-[85%] rounded-md bg-[#282a38]" />
              </div>
            </div>

            {/* Accordion Group Skeleton (Parent + 2 Sub-branches) */}
            <div className="space-y-1">
              <div className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 bg-[#1f2029]">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-lg bg-[#2a2c38]" />
                  <Skeleton className="h-3.5 w-20 rounded-md bg-[#2e303d]" />
                </div>
                <Skeleton className="h-4 w-12 rounded-md bg-[#272935]" />
              </div>

              {/* Sub branches */}
              <div className="ml-5 pl-3 border-l-2 border-[#282a36] space-y-1.5 pt-0.5">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#1a1b22]">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm bg-[#2c2e3d]" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16 rounded-md bg-[#2e303d]" />
                      <Skeleton className="h-2.5 w-6 rounded-md bg-[#252733]" />
                    </div>
                    <Skeleton className="h-2.5 w-[75%] rounded-md bg-[#232530]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#1a1b22]">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm bg-[#2c2e3d]" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16 rounded-md bg-[#2e303d]" />
                      <Skeleton className="h-2.5 w-6 rounded-md bg-[#252733]" />
                    </div>
                    <Skeleton className="h-2.5 w-[65%] rounded-md bg-[#232530]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Inactive Item Skeleton */}
            <div className="w-full flex items-center gap-3 rounded-2xl p-2.5 bg-[#1a1b22]/70">
              <Skeleton className="h-9 w-9 rounded-xl bg-[#272935] shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-20 rounded-md bg-[#2c2e3b]" />
                  <Skeleton className="h-2.5 w-8 rounded-md bg-[#22242f]" />
                </div>
                <Skeleton className="h-3 w-[70%] rounded-md bg-[#22242f]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panel Skeleton */}
        <div className="flex flex-1 flex-col h-full min-w-0 bg-[#18191c] relative overflow-hidden">
          {/* Main message stream skeleton */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <div className="mx-auto max-w-3xl space-y-5">
              {/* Context Banner Skeleton */}
              <div className="flex flex-col items-center justify-center text-center pt-2 pb-5 border-b border-[#282a34] space-y-3">
                <Skeleton className="h-18 w-18 rounded-3xl bg-[#282a36]" />
                <Skeleton className="h-5 w-32 rounded-lg bg-[#2e303e]" />
                <Skeleton className="h-3.5 w-64 rounded-md bg-[#242633]" />
                <div className="flex items-center gap-2 pt-0.5">
                  <Skeleton className="h-5.5 w-22 rounded-full bg-[#272935]" />
                  <Skeleton className="h-5.5 w-28 rounded-full bg-[#272935]" />
                </div>
              </div>

              {/* Opening AI Message Skeleton */}
              <div className="flex w-full justify-start animate-in fade-in duration-300">
                <div className="flex max-w-[85%] items-start gap-3 flex-row">
                  <Skeleton className="h-8.5 w-8.5 rounded-xl bg-[#282a36] shrink-0" />
                  <div className="rounded-2xl rounded-tl-none border border-[#2d2f3d] bg-[#1e2029] p-4 space-y-2.5 min-w-[260px] sm:min-w-[340px]">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3.5 w-24 rounded-md bg-[#353848]" />
                      <Skeleton className="h-3 w-10 rounded-md bg-[#282a36]" />
                    </div>
                    <Skeleton className="h-4 w-full rounded-md bg-[#2c2e3c]" />
                    <Skeleton className="h-4 w-[92%] rounded-md bg-[#2c2e3c]" />
                    <Skeleton className="h-4 w-[75%] rounded-md bg-[#2c2e3c]" />

                    {/* Action Bar Skeleton */}
                    <div className="pt-2 border-t border-[#2a2c3a] flex items-center justify-between">
                      <Skeleton className="h-4 w-14 rounded-md bg-[#262835]" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-6 w-16 rounded-lg bg-[#262835]" />
                        <Skeleton className="h-6 w-16 rounded-lg bg-[#262835]" />
                        <Skeleton className="h-6 w-16 rounded-lg bg-[#262835]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Message Skeleton */}
              <div className="flex w-full justify-end animate-in fade-in duration-300">
                <div className="flex max-w-[85%] items-start gap-3 flex-row-reverse">
                  <Skeleton className="h-8.5 w-8.5 rounded-full bg-[#282a36] shrink-0" />
                  <div className="rounded-2xl rounded-tr-none border border-[#323444] bg-[#242632] p-3.5 space-y-2 min-w-[200px]">
                    <Skeleton className="h-4 w-full rounded-md bg-[#2e3140]" />
                    <Skeleton className="h-4 w-[60%] rounded-md bg-[#2e3140]" />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Input Bar Skeleton */}
          <footer className="border-t border-[#23242a] bg-[#141518]/95 px-3 py-2.5 shrink-0">
            <div className="mx-auto max-w-3xl">
              <Skeleton className="h-12 w-full rounded-2xl bg-[#1c1d25] border border-[#272935]" />
            </div>
          </footer>
        </div>

        {/* Right Sidebar Skeleton (w-80 sm:w-96) */}
        <aside className="hidden lg:flex w-80 sm:w-96 flex-col border-l border-[#26272e] bg-[#18191e] shrink-0 p-5 space-y-4">
          <div className="flex h-12 shrink-0 items-center justify-between pb-3 border-b border-[#26272e]">
            <Skeleton className="h-3.5 w-28 rounded-md bg-[#2b2d3a]" />
            <Skeleton className="h-3 w-10 rounded-md bg-[#242632]" />
          </div>

          {/* Hero Image Skeleton */}
          <Skeleton className="w-full aspect-[4/3] rounded-2xl bg-[#222430] border border-[#2e303e]" />

          {/* Affection Card Skeleton */}
          <div className="rounded-2xl border border-[#2b2d3a] bg-[#1e2029] p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded-md bg-[#2d303f]" />
              <Skeleton className="h-4 w-12 rounded-md bg-[#2d303f]" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-[#272936]" />
            <Skeleton className="h-8 w-full rounded-xl bg-[#252734]" />
          </div>

          {/* Lore Card Skeleton */}
          <div className="rounded-2xl border border-[#2b2d3a] bg-[#1e2029] p-4 space-y-2">
            <Skeleton className="h-3.5 w-32 rounded-md bg-[#2d303f]" />
            <Skeleton className="h-3 w-full rounded-md bg-[#252734]" />
            <Skeleton className="h-3 w-[90%] rounded-md bg-[#252734]" />
            <Skeleton className="h-3 w-[70%] rounded-md bg-[#252734]" />
          </div>
        </aside>
      </div>
    </div>
  );
}
