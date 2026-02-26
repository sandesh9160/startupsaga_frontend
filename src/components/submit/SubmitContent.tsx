"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} 
from "@/components/ui/select";
import {
    Loader2, CheckCircle, Rocket, User, FileText,
    ChevronRight, ChevronLeft, Upload, X, Plus,
    Globe, Mail, Calendar, MapPin, Tag, TrendingUp,
    Briefcase, Linkedin, BookOpen, Image as ImageIcon,
    AlignLeft, Building2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { submitStartup, getCities, getCategories } from "@/lib/api";
import { City, Category } from "@/types";
import Image from "next/image";

const BUSINESS_MODELS = [
    { value: "b2b", label: "B2B" },
    { value: "b2c", label: "B2C" },
    { value: "b2b2c", label: "B2B2C" },
    { value: "d2c", label: "D2C" },
    { value: "saas", label: "SaaS" },
    { value: "marketplace", label: "Marketplace" },
    { value: "subscription", label: "Subscription" },
    { value: "freemium", label: "Freemium" },
    { value: "platform", label: "Platform" },
    { value: "other", label: "Other" },
];

const STAGES = [
    "Bootstrapped", "Pre-Seed", "Seed", "Series A",
    "Series B", "Series C+", "IPO", "Unicorn"
];

const TEAM_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

const SECTORS = [
    "B2B SaaS", "B2C Consumer App", "Marketplace", "Fintech",
    "Healthtech", "Edtech", "E-commerce/D2C", "Logistics/Supply Chain",
    "Deeptech/AI", "Agritech", "Clean Energy/Sustainability",
    "Gaming/Entertainment", "Hardware/Robotics", "Proptech", "Web3/Crypto",
    "Foodtech", "Mediatech", "Legaltech", "HRtech", "Insurtech"
];

const startupSchema = z.object({
    startupName: z.string().min(2, "Startup name must be at least 2 characters."),
    tagline: z.string().min(10, "Tagline must be at least 10 characters.").max(150, "Tagline cannot exceed 150 characters."),
    email: z.string().email("Please enter a valid email."),
    website: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
    city: z.string().min(1, "Please select a city."),
    foundedYear: z.string().regex(/^\d{4}$/, "Please enter a valid year (e.g. 2023).").optional().or(z.literal("")),
    category: z.string().min(1, "Please select a category."),
    fundingStage: z.string().min(1, "Please select a funding stage."),
    businessModel: z.string().min(1, "Please select a business model."),
    teamSize: z.string().min(1, "Please select team size."),
    sector: z.string().min(1, "Please select sector."),
    industryTags: z.array(z.string()).default([]),
    logo: z.string().optional(),
    ogImage: z.string().optional(),
});

const founderSchema = z.object({
    founders: z.array(z.object({
        name: z.string().min(2, "Name is required."),
        role: z.string().min(2, "Role is required."),
        linkedin: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
    })).min(1, "At least one founder/leader is required."),
});

const storySchema = z.object({
    storyTitle: z.string().min(5, "Story title must be at least 5 characters."),
    storyContent: z.string().min(200, "Please tell us your story in detail (min 200 chars)."),
    coverImageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal("")),
});

const combinedSchema = startupSchema.merge(founderSchema).merge(storySchema);

const LayoutGrid = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
);
type FormValues = z.infer<typeof combinedSchema>;

const STEPS = [
    { id: 1, title: "Startup Details", icon: Building2, description: "Tell us about your company" },
    { id: 2, title: "Founder Details", icon: User, description: "Who is behind the vision?" },
    { id: 3, title: "Your Story", icon: FileText, description: "Share your journey" },
];

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

export function SubmitContent() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function loadOptions() {
            try {
                const [citiesData, categoriesData] = await Promise.all([getCities(), getCategories()]);
                setCities(citiesData);
                setCategories(categoriesData);
            } catch { }
        }
        loadOptions();
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(combinedSchema),
        mode: "onChange",
        defaultValues: {
            startupName: "", tagline: "", email: "", website: "",
            city: "", foundedYear: new Date().getFullYear().toString(),
            category: "", fundingStage: "", businessModel: "", teamSize: "1-10",
            sector: "", industryTags: [],
            logo: "", ogImage: "",
            founders: [{ name: "", role: "", linkedin: "" }],
            storyTitle: "", storyContent: "", coverImageUrl: "",
        },
    });

    const { trigger, handleSubmit, setValue, watch, control } = form;
    const logoValue = watch("logo");
    const ogImageValue = watch("ogImage");
    const industryTags = watch("industryTags") || [];
    const founders = watch("founders") || [];

    const [tagInput, setTagInput] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const ogInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "ogImage") => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error("File size must be less than 2MB"); return; }
        const reader = new FileReader();
        reader.onloadend = () => setValue(field, reader.result as string, { shouldValidate: true });
        reader.readAsDataURL(file);
    };

    const removeImage = (field: "logo" | "ogImage") => {
        setValue(field, "", { shouldValidate: true });
        if (field === "logo" && fileInputRef.current) fileInputRef.current.value = "";
        if (field === "ogImage" && ogInputRef.current) ogInputRef.current.value = "";
    };

    const addTag = (e?: React.KeyboardEvent) => {
        if (e && e.key !== 'Enter') return;
        if (e) e.preventDefault();

        const tag = tagInput.trim();
        if (tag && !industryTags.includes(tag)) {
            setValue("industryTags", [...industryTags, tag], { shouldValidate: true });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setValue("industryTags", industryTags.filter(t => t !== tag), { shouldValidate: true });
    };

    const addFounder = () => {
        setValue("founders", [...founders, { name: "", role: "", linkedin: "" }]);
    };

    const removeFounder = (index: number) => {
        if (founders.length <= 1) return;
        setValue("founders", founders.filter((_, i) => i !== index));
    };

    const updateFounder = (index: number, field: "name" | "role" | "linkedin", value: string) => {
        const updated = [...founders];
        updated[index] = { ...updated[index], [field]: value };
        setValue("founders", updated, { shouldValidate: true });
    };

    const handleNext = async () => {
        let fields: (keyof FormValues)[] = [];
        if (currentStep === 1) fields = ["startupName", "tagline", "email", "website", "city", "foundedYear", "category", "fundingStage", "businessModel", "teamSize", "sector"];
        else if (currentStep === 2) fields = ["founders"];
        const ok = await trigger(fields);
        if (ok) setCurrentStep(p => p + 1);
    };

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await submitStartup({
                startup_name: values.startupName,
                founder_name: values.founders[0].name,
                email: values.email,
                website: values.website || "",
                description: values.tagline,
                full_story: values.storyContent,
                city: values.city,
                category: values.category,
                funding_stage: values.fundingStage,
                business_model: values.businessModel,
                team_size: values.teamSize,
                sector: values.sector,
                industry_tags: values.industryTags,
                founders_data: values.founders,
                logo: values.logo,
                og_image: values.ogImage,
                thumbnail: values.coverImageUrl,
            });
            setIsSuccess(true);
            toast.success("Startup submitted successfully!");
            window.scrollTo({ top: 0, behavior: "smooth" });
        // } catch (error: any) {
        //     toast.error(error.message || "Failed to submit. Please try again.");
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to submit. Please try again.";

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center py-20 max-w-lg mx-auto px-4">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 font-serif text-[#0F172A]">Journey Submitted!</h2>
                    <p className="text-zinc-500 text-base mb-8 leading-relaxed">
                        Thank you for sharing your story with StartupSaga. Your submission is pending admin review.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button onClick={() => router.push('/')} variant="outline" size="lg">Return Home</Button>
                        <Button onClick={() => router.push('/stories')} size="lg" className="bg-[#F2542D] hover:bg-[#D94111] text-white border-none">Read Stories</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            {/* Title + Stepper — compact, no wasted space */}
            <div className="max-w-2xl mx-auto px-4 pt-5 pb-2">
                <div className="text-center mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#0F172A] mb-1">Submit Your Startup</h1>
                    <p className="text-zinc-400 text-sm">Share your founder journey with India’s startup community</p>
                </div>
                <div className="flex items-start justify-between relative">
                    {/* connector line */}
                    <div className="absolute top-5 left-0 right-0 h-px bg-zinc-200 z-0" />
                    <div
                        className="absolute top-5 left-0 h-px bg-[#F2542D] z-0 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 z-10 flex-1">
                                <div className={cn(
                                    "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300",
                                    isActive ? "border-[#F2542D] text-[#F2542D]" :
                                        isCompleted ? "border-[#F2542D] bg-[#F2542D] text-white" :
                                            "border-zinc-200 text-zinc-400"
                                )}>
                                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                                </div>
                                <span className={cn(
                                    "text-xs font-semibold text-center leading-tight",
                                    isActive ? "text-[#F2542D]" : isCompleted ? "text-zinc-500" : "text-zinc-400"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Card */}
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Step Header */}
                            <div className="px-5 pt-4 pb-3 border-b border-zinc-50 flex items-center gap-2.5">
                                {(() => {
                                    const StepIcon = STEPS[currentStep - 1].icon;
                                    return (
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                            <StepIcon className="h-4 w-4 text-[#F2542D]" />
                                        </div>
                                    );
                                })()}
                                <div>
                                    <h2 className="text-lg font-bold text-[#0F172A]">{STEPS[currentStep - 1].title}</h2>
                                </div>
                            </div>

                            <div className="px-5 py-4 space-y-3.5">
                                {/* ── STEP 1 ── */}
                                {currentStep === 1 && (
                                    <div className="space-y-3.5">
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
                                                                    <Tag className="h-4 w-4 text-zinc-400 mr-2" />
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
                                                                <LayoutGrid className="h-4 w-4 text-zinc-400 mr-2" />
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
                                                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
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
                                )}

                                {/* ── STEP 2 ── */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-zinc-400 font-medium">Add founders or key leadership members.</p>
                                            <Button type="button" variant="outline" size="sm" onClick={addFounder} className="h-8 gap-1.5 border-orange-100 text-orange-600 hover:bg-orange-50 font-bold">
                                                <Plus className="h-3.5 w-3.5" /> Add Member
                                            </Button>
                                        </div>

                                        <div className="space-y-8">
                                            {founders.map((founder, index) => (
                                                <div key={index} className="relative p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100 space-y-4">
                                                    {founders.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFounder(index)}
                                                            className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 shadow-sm transition-all"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</Label>
                                                            <IconInput
                                                                icon={User}
                                                                placeholder="e.g. Kunal Shah"
                                                                value={founder.name}
                                                                onChange={(e) => updateFounder(index, "name", e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Role / Designation</Label>
                                                            <IconInput
                                                                icon={Briefcase}
                                                                placeholder="e.g. Founder & CEO"
                                                                value={founder.role}
                                                                onChange={(e) => updateFounder(index, "role", e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">LinkedIn Profile (URL)</Label>
                                                        <IconInput
                                                            icon={Linkedin}
                                                            placeholder="https://linkedin.com/in/..."
                                                            value={founder.linkedin}
                                                            onChange={(e) => updateFounder(index, "linkedin", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 3 ── */}
                                {currentStep === 3 && (
                                    <div className="space-y-5">
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
                                                        <Textarea
                                                            placeholder="Write your journey here — the challenges you faced, milestones you hit, and lessons learned..."
                                                            className="min-h-[260px] border-zinc-200 focus:border-orange-400 focus:ring-orange-500/20 text-sm leading-relaxed resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs text-zinc-400">Min 200 characters. Inspire others with your journey.</FormDescription>
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
                                )}
                            </div>

                        </form>
                    </Form>
                </div>

                {/* Nav Buttons — outside card */}
                <div className="max-w-2xl mx-auto px-4 mt-4 flex items-center justify-between">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(p => Math.max(p - 1, 1))}
                            className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-[#0F172A] transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </button>
                    ) : <div />}

                    <span className="text-xs text-zinc-400 font-medium">Step {currentStep} of {STEPS.length}</span>

                    {currentStep < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 h-10 px-6 rounded-lg bg-[#F2542D] hover:bg-[#D94111] text-white text-sm font-bold transition-all shadow-sm shadow-orange-200"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            form="submit-form"
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                            className="flex items-center gap-2 h-10 px-6 rounded-lg bg-[#F2542D] hover:bg-[#D94111] disabled:opacity-60 text-white text-sm font-bold transition-all shadow-sm shadow-orange-200"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                            ) : (
                                <><Rocket className="h-4 w-4" /> Submit Journey</>
                            )}
                        </button>
                    )}
                </div>

                {/* Terms */}
                <p className="text-center text-xs text-zinc-400 mt-4">
                    By submitting, you agree to our{" "}
                    <a href="/terms" className="text-[#F2542D] hover:underline">terms of service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-[#F2542D] hover:underline">privacy policy</a>.
                </p>
            </div>
        </div>
    );
}
