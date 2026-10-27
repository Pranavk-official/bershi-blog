"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contactSchema";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function HostingerContactForm() {
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("Failed to send. Try again.");
    // Honeypot: outside react-hook-form so it never touches the validated schema.
    const honeypot = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        setStatus("submitting");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, website: honeypot.current?.value ?? "" }),
            });

            if (!res.ok) {
                const { error } = await res.json().catch(() => ({ error: null }));
                throw new Error(error ?? `Request failed: ${res.status}`);
            }

            setStatus("success");

            // Reset form after success
            setTimeout(() => {
                reset();
                setStatus("idle");
            }, 3000);
        } catch (error) {
            console.error("Form submission error:", error);
            setErrorMessage(error instanceof Error ? error.message : "Failed to send. Try again.");
            setStatus("error");

            // Reset error state after 5 seconds
            setTimeout(() => {
                setStatus("idle");
            }, 5000);
        }
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Glassmorphism card */}
            <div
                className="relative overflow-hidden rounded-2xl border border-border/50
                   bg-card/50 backdrop-blur-md p-6 md:p-8
                   shadow-lg dark:bg-card/30"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Honeypot — hidden from humans and screen readers, bots fill it in */}
                    <input
                        ref={honeypot}
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    {/* Name field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            aria-invalid={!!errors.email}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Subject field (optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">
                            Subject <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="subject"
                            placeholder="What's this about?"
                            aria-invalid={!!errors.subject}
                            {...register("subject")}
                        />
                    </div>

                    {/* Message field */}
                    <div className="space-y-2">
                        <Label htmlFor="message">
                            Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Tell me about your project or just say hi..."
                            rows={5}
                            aria-invalid={!!errors.message}
                            {...register("message")}
                        />
                        {errors.message && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full group"
                        disabled={status === "submitting" || status === "success"}
                    >
                        {status === "idle" && (
                            <span className="flex items-center gap-2">
                                Send Message
                                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        )}
                        {status === "submitting" && (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </span>
                        )}
                        {status === "success" && (
                            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                Message Sent!
                            </span>
                        )}
                        {status === "error" && (
                            <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                {errorMessage}
                            </span>
                        )}
                    </Button>

                    <p aria-live="polite" className="sr-only">
                        {status === "success" && "Message sent."}
                        {status === "error" && errorMessage}
                    </p>
                </form>
            </div>
        </div>
    );
}
