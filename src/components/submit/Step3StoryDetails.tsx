"use client";

import { UseFormReturn } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { BookOpen, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import the rich text editor to reduce initial bundle size
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
    ssr: false,
    loading: () => <div className="h-[250px] w-full bg-zinc-50 animate-pulse rounded-lg border border-zinc-200" />
});

interface Step3Props {
    form: UseFormReturn<any>;
}

// Reusable input wrapper with leading icon
function IconInput({ icon: Icon, ...props }: { icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="relative">
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
                {...props}
                className={cn(
                    "w-full h-11 pl-10 pr-4 rounded-lg border border-zinc-200 bg-white text-[#0F172A] text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all",
                    props.className
                )}
            />
        </div>
    );
}

export function Step3StoryDetails({
    form
}: Step3Props) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <FormField
                control={form.control}
                name="storyTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Journey Title <span className="text-[#F2542D]">*</span></FormLabel>
                        <FormControl>
                            <IconInput icon={BookOpen} placeholder="e.g. How we scaled to 1M users in 6 months" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="storyContent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Your Story <span className="text-[#F2542D]">*</span></FormLabel>
                        <FormControl>
                            <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                className="min-h-[300px]"
                            />
                        </FormControl>
                        <FormDescription className="text-xs text-zinc-400">Min 200 characters. Inspire others with your journey. Use the editor to format your story.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Cover Image URL <span className="text-zinc-400 font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                            <IconInput icon={ImageIcon} placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription className="text-xs text-zinc-400">A high-quality image to engage readers.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
