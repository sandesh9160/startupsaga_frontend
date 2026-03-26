"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, ExternalLink, ArrowRight, MapPin, Tag, User, BriefcaseBusiness, TrendingUp, CalendarDays, Users } from "lucide-react";
import { getSafeImageSrc } from "@/lib/images";
import { SmartImage } from "@/components/ui/SmartImage";

interface CompanyInfoSidebarProps {
    company: {
        name: string;
        logo?: string;
        city?: string;
        founded?: string | number;
        employees?: string;
        founders?: string[];
        tags?: string[];
        categories?: string[];
        website?: string;
        slug?: string;
        stage?: string;
        sector?: string;
        model?: string;
    };
}

export function CompanyInfoSidebar({ company }: CompanyInfoSidebarProps) {
    const startupUrl = company.slug ? `/startups/${company.slug}` : null;
    const logoSrc = company.logo ? getSafeImageSrc(company.logo) : "";

    return (
        <Card className="border border-zinc-100 rounded-[1.25rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative group font-sans">
            <div className="p-6">
                <div className="flex items-center gap-3.5 mb-5">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        {company.logo ? (
                            <SmartImage
                                src={logoSrc}
                                alt={company.name}
                                fill
                                className="object-contain p-1"
                                sizes="48px"
                            />
                        ) : (
                            <Building2 className="h-5 w-5 text-zinc-300" />
                        )}
                    </div>

                    {/* Company Name & Location */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-xl text-[#0F172A] leading-snug truncate mb-1">
                            {company.name}
                        </h3>
                        {company.city && (
                            <p className="text-sm font-medium text-zinc-500 capitalize">
                                {company.city}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-zinc-100/60">
                    <div className="space-y-3 pt-1">
                        {company.founded && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium flex items-center gap-2"><CalendarDays className="h-4 w-4 text-zinc-400" />Founded</span>
                                <span className="font-semibold text-[#0F172A]">{company.founded}</span>
                            </div>
                        )}

                        {company.stage && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium text-right flex items-center gap-2"><TrendingUp className="h-4 w-4 text-zinc-400" />Stage</span>
                                <span className="font-semibold text-[#0F172A]">{company.stage}</span>
                            </div>
                        )}

                        {company.sector && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium text-right flex items-center gap-2"><Tag className="h-4 w-4 text-zinc-400" />Sector</span>
                                <span className="font-semibold text-[#0F172A] truncate max-w-[120px] text-right">{company.sector}</span>
                            </div>
                        )}

                        {company.employees && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium flex items-center gap-2"><Users className="h-4 w-4 text-zinc-400" />Employees</span>
                                <span className="font-semibold text-[#0F172A]">{company.employees}</span>
                            </div>
                        )}

                        {company.model && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-zinc-400" />Model</span>
                                <span className="font-semibold text-[#0F172A] uppercase">{company.model}</span>
                            </div>
                        )}

                        {company.city && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-zinc-400" />Location</span>
                                <span className="font-semibold text-[#0F172A]">{company.city}</span>
                            </div>
                        )}

                        {company.founders && company.founders.length > 0 && (
                            <div className="flex items-start justify-between gap-4 text-sm">
                                <span className="text-zinc-500 font-medium flex items-center gap-2 shrink-0"><User className="h-4 w-4 text-zinc-400" />Founders</span>
                                <span className="font-semibold text-[#0F172A] text-right">{company.founders.join(", ")}</span>
                            </div>
                        )}
                    </div>

                    {company.tags && company.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {company.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-3 space-y-2">
                        {company.website && (
                            <Button
                                asChild
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/10 rounded-xl flex items-center justify-center gap-2 h-11 font-bold text-sm transition-all relative z-20 active:translate-y-0 active:scale-[0.98]"
                            >
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    Visit Website
                                </a>
                            </Button>
                        )}
                        {startupUrl && (
                            <Button
                                asChild
                                variant="outline"
                                className="w-full bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-[#0F172A] rounded-xl flex items-center justify-center gap-2 h-11 font-bold text-sm transition-all"
                            >
                                <Link href={startupUrl}>
                                    View Full Profile
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

