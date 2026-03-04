"use client";

import { Label } from "@/components/ui/label";
import { User, Briefcase, Linkedin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FounderEntry {
    name: string;
    role: string;
    linkedin?: string; // Made optional to match the parent component
}

interface Step2Props {
    founders: FounderEntry[];
    addFounder: () => void;
    removeFounder: (index: number) => void;
    updateFounder: (index: number, field: "name" | "role" | "linkedin", value: string) => void;
}

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

export function Step2FounderDetails({
    founders, addFounder, removeFounder, updateFounder
}: Step2Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                                value={founder.linkedin || ""}
                                onChange={(e) => updateFounder(index, "linkedin", e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
