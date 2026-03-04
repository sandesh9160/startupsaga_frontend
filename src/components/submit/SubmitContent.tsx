"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    Loader2, CheckCircle, Rocket, User, FileText,
    ChevronRight, ChevronLeft, Building2
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { submitStartup, getCities, getCategories } from "@/lib/api";
import { City, Category } from "@/types";
import dynamic from "next/dynamic";

// Dynamically import step components to reduce initial bundle size
const Step1StartupDetails = dynamic(() => import("./Step1StartupDetails").then(mod => mod.Step1StartupDetails), {
    loading: () => <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl" />
});
const Step2FounderDetails = dynamic(() => import("./Step2FounderDetails").then(mod => mod.Step2FounderDetails), {
    loading: () => <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl" />
});
const Step3StoryDetails = dynamic(() => import("./Step3StoryDetails").then(mod => mod.Step3StoryDetails), {
    loading: () => <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl" />
});

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

type FormValues = z.infer<typeof combinedSchema>;

const STEPS = [
    { id: 1, title: "Startup Details", icon: Building2, description: "Tell us about your company" },
    { id: 2, title: "Founder Details", icon: User, description: "Who is behind the vision?" },
    { id: 3, title: "Your Story", icon: FileText, description: "Share your journey" },
];

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

    const { trigger, handleSubmit, setValue, watch } = form;
    const logoValue = watch("logo") || "";
    const ogImageValue = watch("ogImage") || "";
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
        if (ok) {
            setCurrentStep(p => p + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to submit. Please try again.";
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
            <div className="max-w-2xl mx-auto px-4 pt-5 pb-2">
                <div className="text-center mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#0F172A] mb-1">Submit Your Startup</h1>
                    <p className="text-zinc-400 text-sm">Share your founder journey with India’s startup community</p>
                </div>
                <div className="flex items-start justify-between relative">
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

            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} id="submit-form">
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
                                <Suspense fallback={<div className="h-[400px] bg-white animate-pulse rounded-xl" />}>
                                    {currentStep === 1 && (
                                        <Step1StartupDetails
                                            form={form} cities={cities} categories={categories}
                                            BUSINESS_MODELS={BUSINESS_MODELS} STAGES={STAGES}
                                            TEAM_SIZES={TEAM_SIZES} SECTORS={SECTORS}
                                            logoValue={logoValue} ogImageValue={ogImageValue}
                                            industryTags={industryTags} tagInput={tagInput}
                                            setTagInput={setTagInput} addTag={addTag} removeTag={removeTag}
                                            handleFileChange={handleFileChange} removeImage={removeImage}
                                            fileInputRef={fileInputRef} ogInputRef={ogInputRef}
                                        />
                                    )}
                                    {currentStep === 2 && (
                                        <Step2FounderDetails
                                            founders={founders} addFounder={addFounder}
                                            removeFounder={removeFounder} updateFounder={updateFounder}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <Step3StoryDetails form={form} />
                                    )}
                                </Suspense>
                            </div>
                        </form>
                    </Form>
                </div>

                <div className="max-w-2xl mx-auto px-0 mt-4 flex items-center justify-between">
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
