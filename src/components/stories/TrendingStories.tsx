import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { Story } from "@/lib/api";
import { getSafeImageSrc } from "@/lib/images";

interface TrendingStoriesProps {
    stories: Story[];
}

export function TrendingStories({ stories }: TrendingStoriesProps) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-300 p-8 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="h-5 w-5 text-[#FF4F18]" />
                <h2 className="font-serif text-xl font-bold text-[#0F172A] mb-0">Trending This Week</h2>
            </div>

            <div className="flex flex-col gap-8">
                {stories.slice(0, 5).map((story, index) => {
                    const thumbnailSrc = getSafeImageSrc(story.thumbnail);
                    const isSvgThumbnail = thumbnailSrc.toLowerCase().endsWith(".svg");

                    return (
                        <Link
                            key={story.slug}
                            href={`/stories/${story.slug}`}
                            className="group flex gap-5 items-start"
                        >
                            <div className="flex-shrink-0 text-3xl font-black text-zinc-100 group-hover:text-[#FF4F18]/20 transition-colors font-serif leading-none pt-1">
                                {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[#0F172A] text-[15px] line-clamp-2 leading-snug group-hover:text-[#FF4F18] transition-colors mb-2">
                                    {story.title}
                                </h3>
                                <p className="text-[10px] text-[#FF4F18] font-bold tracking-wider">
                                    {story.category}
                                </p>
                            </div>

                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-300">
                                <Image
                                    src={thumbnailSrc}
                                    alt={story.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="64px"
                                    unoptimized={isSvgThumbnail}
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
