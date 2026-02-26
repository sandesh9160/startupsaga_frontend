"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeNewsletter } from "@/lib/api";
import { Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    useEffect(() => {
        if (!email || !token) {
            setStatus("error");
            setMessage("Missing unsubscription information. Please check your email link.");
            return;
        }

        const performUnsubscribe = async () => {
            try {
                await unsubscribeNewsletter(email, token);
                setStatus("success");
            } catch (err: any) {
                setStatus("error");
                setMessage(err.message || "Failed to unsubscribe. Please try again later.");
            }
        };

        performUnsubscribe();
    }, [email, token]);

    return (
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm border border-zinc-100 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-50 mb-6">
                {status === "loading" && <Loader2 className="h-10 w-10 text-zinc-400 animate-spin" />}
                {status === "success" && <CheckCircle className="h-10 w-10 text-green-500" />}
                {status === "error" && <XCircle className="h-10 w-10 text-red-500" />}
            </div>

            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
                {status === "loading" && "Unsubscribing..."}
                {status === "success" && "Unsubscribed"}
                {status === "error" && "Oops!"}
            </h1>

            <p className="text-zinc-500 mb-8">
                {status === "loading" && "Please wait while we process your request."}
                {status === "success" && `You have been successfully unsubscribed from ${email}. We're sorry to see you go!`}
                {status === "error" && message}
            </p>

            <div className="flex flex-col gap-3">
                <Link href="/">
                    <Button variant="default" className="w-full">
                        Back to Homepage
                    </Button>
                </Link>
                <Link href="/stories">
                    <Button variant="outline" className="w-full">
                        Read Latest Stories
                    </Button>
                </Link>
            </div>
        </div>
    );
}
