"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Users, ExternalLink, ArrowRight } from "lucide-react";

interface CompanyInfoSidebarProps {
    company: {
        name: string;
        logo?: string;
        city?: string;
        founded?: string | number;
        employees?: string;
        founders?: string[];
        categories?: string[];
        website?: string;
        slug?: string;
    };
}

export function CompanyInfoSidebar({ company }: CompanyInfoSidebarProps) {
    const startupUrl = company.slug ? `/startups/${company.slug}` : null;

    return (
        <Card className="border border-zinc-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow relative group">
            {/* Clickable overlay to startup page */}
            {startupUrl && (
                <Link href={startupUrl} className="absolute inset-0 z-10" aria-label={`View ${company.name} profile`} />
            )}

            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {company.logo ? (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Building2 className="h-5 w-5 text-zinc-300" />
                        )}
                    </div>

                    {/* Company Name & Location */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-lg text-zinc-900 mb-0.5 leading-tight truncate group-hover:text-orange-600 transition-colors">
                            {company.name}
                        </h3>
                        {company.city && (
                            <p className="text-xs font-medium text-zinc-400 capitalize">
                                {company.city}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-3 pt-1 border-t border-zinc-100">
                    <div className="space-y-3 pt-3">
                        {company.founded && (
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-zinc-500 font-medium">Founded</span>
                                <span className="font-bold text-zinc-900">{company.founded}</span>
                            </div>
                        )}

                        {company.employees && (
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-zinc-500 font-medium">Employees</span>
                                <span className="font-bold text-zinc-900">{company.employees}</span>
                            </div>
                        )}

                        {company.founders && (
                            <div className="flex items-start justify-between text-[13px] gap-4">
                                <span className="text-zinc-500 font-medium shrink-0">Founders</span>
                                <span className="font-bold text-zinc-900 text-right line-clamp-2">
                                    {Array.isArray(company.founders) ? company.founders.join(", ") : company.founders}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Categories/Tags */}
                    {company.categories && company.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {company.categories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className="bg-zinc-100/80 text-zinc-500 text-[9px] px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-zinc-200/50"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 flex gap-2">
                        {startupUrl && (
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1 bg-orange-50 border-orange-100 hover:bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center gap-2 h-10 font-bold text-xs transition-all shadow-none relative z-20"
                            >
                                <Link href={startupUrl}>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                    View Profile
                                </Link>
                            </Button>
                        )}
                        {company.website && (
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1 bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-xl flex items-center justify-center gap-2 h-10 font-bold text-xs transition-all shadow-none relative z-20"
                            >
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Website
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

