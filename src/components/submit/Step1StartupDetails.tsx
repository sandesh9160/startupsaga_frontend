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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Rocket, AlignLeft, Globe, MapPin, Calendar,
    Tag as TagIcon, TrendingUp, Briefcase, Mail,
    Upload, X, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { City, Category } from "@/types";

interface Step1Props {
    form: UseFormReturn<any>;
    cities: City[];
    categories: Category[];
    BUSINESS_MODELS: any[];
    STAGES: string[];
    TEAM_SIZES: string[];
    SECTORS: string[];
    logoValue: string;
    ogImageValue: string;
    industryTags: string[];
    tagInput: string;
    setTagInput: (val: string) => void;
    addTag: (e?: React.KeyboardEvent) => void;
    removeTag: (tag: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "ogImage") => void;
    removeImage: (field: "logo" | "ogImage") => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    ogInputRef: React.RefObject<HTMLInputElement | null>;
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

export function Step1StartupDetails({
    form, cities, categories, BUSINESS_MODELS, STAGES, TEAM_SIZES, SECTORS,
    logoValue, ogImageValue, industryTags, tagInput, setTagInput, addTag, removeTag,
    handleFileChange, removeImage, fileInputRef, ogInputRef
}: Step1Props) {
    return (
        <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <FormField
                control={form.control}
                name="startupName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Startup Name <span className="text-[#F2542D]">*</span></FormLabel>
                        <FormControl>
                            <IconInput icon={Rocket} placeholder="e.g., Zepto" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Tagline <span className="text-[#F2542D]">*</span></FormLabel>
                        <FormControl>
                            <IconInput icon={AlignLeft} placeholder="One line describing what you do" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs text-zinc-400">10-150 characters</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Website</FormLabel>
                        <FormControl>
                            <IconInput icon={Globe} placeholder="https://yourstartup.com" type="url" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">City <span className="text-[#F2542D]">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-400">
                                        <MapPin className="h-4 w-4 text-zinc-400 mr-2" />
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cities.map((city: City) => (
                                        <SelectItem key={city.slug} value={city.name}>{city.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="foundedYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Founded Year <span className="text-[#F2542D]">*</span></FormLabel>
                            <FormControl>
                                <IconInput icon={Calendar} placeholder="2023" maxLength={4} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Category <span className="text-[#F2542D]">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-400">
                                        <TagIcon className="h-4 w-4 text-zinc-400 mr-2" />
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((cat: Category) => (
                                        <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fundingStage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Funding Stage <span className="text-[#F2542D]">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-400">
                                        <TrendingUp className="h-4 w-4 text-zinc-400 mr-2" />
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {STAGES.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="businessModel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Business Model <span className="text-[#F2542D]">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-400">
                                        <Briefcase className="h-4 w-4 text-zinc-400 mr-2" />
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {BUSINESS_MODELS.map(m => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Team Size <span className="text-[#F2542D]">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-400">
                                        <TrendingUp className="h-4 w-4 text-zinc-400 mr-2" />
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {TEAM_SIZES.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Sector / Industry <span className="text-[#F2542D]">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-11 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-400">
                                    <Building2 className="h-4 w-4 text-zinc-400 mr-2" />
                                    <SelectValue placeholder="Select Sector" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {SECTORS.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0F172A]">Industry Tags</FormLabel>
                <FormControl>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                            <input
                                placeholder="Add a tag and press Enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={addTag}
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-zinc-200 bg-white text-[#0F172A] text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                            />
                        </div>
                        <Button type="button" variant="outline" className="h-11 px-4" onClick={() => addTag()}>Add</Button>
                    </div>
                </FormControl>
                {industryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {industryTags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100">
                                {tag}
                                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                            </span>
                        ))}
                    </div>
                )}
            </FormItem>

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0F172A]">Contact Email <span className="text-[#F2542D]">*</span></FormLabel>
                        <FormControl>
                            <IconInput icon={Mail} placeholder="founder@yourstartup.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Logo Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="logo"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Startup Logo <span className="text-zinc-400 font-normal">(Optional)</span></FormLabel>
                            <FormControl>
                                <div>
                                    {!logoValue ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-zinc-200 hover:border-orange-300 transition-colors rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer gap-2 bg-zinc-50/50"
                                        >
                                            <Upload className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs font-medium">Upload Logo</span>
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "logo")} />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-24 bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden">
                                            <Image src={logoValue} alt="Logo Preview" className="object-contain p-2" fill />
                                            <button type="button" onClick={() => removeImage("logo")} className="absolute top-1 right-1 p-1 bg-white border border-zinc-200 rounded-full shadow-sm hover:bg-red-50">
                                                <X className="h-3 w-3 text-zinc-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ogImage"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-[#0F172A]">Social Card (OG) <span className="text-zinc-400 font-normal">(Optional)</span></FormLabel>
                            <FormControl>
                                <div>
                                    {!ogImageValue ? (
                                        <div
                                            onClick={() => ogInputRef.current?.click()}
                                            className="border-2 border-dashed border-zinc-200 hover:border-orange-300 transition-colors rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer gap-2 bg-zinc-50/50"
                                        >
                                            <ImageIcon className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs font-medium">Upload OG Image</span>
                                            <input type="file" ref={ogInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "ogImage")} />
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-24 bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden">
                                            <Image src={ogImageValue} alt="OG Preview" className="object-cover" fill />
                                            <button type="button" onClick={() => removeImage("ogImage")} className="absolute top-1 right-1 p-1 bg-white border border-zinc-200 rounded-full shadow-sm hover:bg-red-50">
                                                <X className="h-3 w-3 text-zinc-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
