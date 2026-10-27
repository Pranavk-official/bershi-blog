"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contactSchema";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
    const [status, setStatus] = useState<FormStatus>("idle");

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
            // Google Forms submission URL and entry IDs
            const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSendyb4DzaQNEOqjIfO7eHwCpsyiY57PCqRLdqL7mkJbgCMcQ/formResponse";

            // Create form data with Google Forms entry IDs
            const formData = new FormData();
            formData.append("entry.890201359", data.name);         // Your Full Name
            formData.append("entry.1417419897", data.email);       // Your Email Address
            formData.append("entry.1003983839", data.subject || ""); // Subject (Optional)
            formData.append("entry.345412767", data.message);      // Your Message

            // Submit to Google Forms (no-cors mode since Google Forms doesn't allow CORS)
            await fetch(GOOGLE_FORM_URL, {
                method: "POST",
                body: formData,
                mode: "no-cors", // Required for Google Forms
            });

            // Since no-cors doesn't give us response status, we assume success
            setStatus("success");

            // Reset form after success
            setTimeout(() => {
                reset();
                setStatus("idle");
            }, 3000);
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus("error");

            // Reset error state after 3 seconds
            setTimeout(() => {
                setStatus("idle");
            }, 3000);
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
                    {/* Name field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-foreground"
                        >
                            Name <span className="text-destructive">*</span>
                        </label>
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
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email <span className="text-destructive">*</span>
                        </label>
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
                        <label
                            htmlFor="subject"
                            className="text-sm font-medium text-foreground"
                        >
                            Subject <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <Input
                            id="subject"
                            placeholder="What's this about?"
                            aria-invalid={!!errors.subject}
                            {...register("subject")}
                        />
                    </div>

                    {/* Message field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="message"
                            className="text-sm font-medium text-foreground"
                        >
                            Message <span className="text-destructive">*</span>
                        </label>
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
                                Failed to send. Try again.
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
