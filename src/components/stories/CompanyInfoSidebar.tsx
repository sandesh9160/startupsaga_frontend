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
        stage?: string;
        sector?: string;
        model?: string;
    };
}

export function CompanyInfoSidebar({ company }: CompanyInfoSidebarProps) {
    const startupUrl = company.slug ? `/startups/${company.slug}` : null;

    return (
        <Card className="border border-zinc-100 rounded-[1.25rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative group font-sans">
            <div className="p-6">
                <div className="flex items-center gap-3.5 mb-5">
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
                                <span className="text-zinc-500 font-medium">Founded</span>
                                <span className="font-semibold text-[#0F172A]">{company.founded}</span>
                            </div>
                        )}

                        {company.stage && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium text-right">Stage</span>
                                <span className="font-semibold text-[#0F172A]">{company.stage}</span>
                            </div>
                        )}

                        {company.sector && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium text-right">Sector</span>
                                <span className="font-semibold text-[#0F172A] truncate max-w-[120px] text-right">{company.sector}</span>
                            </div>
                        )}

                        {company.employees && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Employees</span>
                                <span className="font-semibold text-[#0F172A]">{company.employees}</span>
                            </div>
                        )}
                    </div>

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

