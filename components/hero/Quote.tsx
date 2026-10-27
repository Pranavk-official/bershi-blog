"use client";

// import { RandomizedTextEffect } from "@/components/ui/text-randomized";
import { HyperText } from "../ui/hyper-text";

export function Quote() {
  const quote = {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  };

  return (
    <div className="relative max-w-md mx-auto px-4 sm:px-6">
      {/* Decorative Quote Marks */}
      <div className="absolute -top-5 md:-top-8 -left-4 md:-left-6 text-6xl md:text-8xl  text-zinc-500 dark:text-zinc-400 font-serif leading-none">
        &ldquo;
      </div>
      <div className="absolute -bottom-5 md:-bottom-3 -right-4 md:-right-6 text-6xl md:text-8xl  text-zinc-500 dark:text-zinc-400 font-serif leading-none">
        &rdquo;
      </div>

      {/* Quote Text */}
      {/* <RandomizedTextEffect
        text={quote.content}
        className="text-xl md:text-2xl font-semibold leading-relaxed text-center text-zinc-900 dark:text-zinc-600 block"
      /> */}
      <HyperText className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-center text-zinc-900 dark:text-zinc-300 block">
        {quote.content}
      </HyperText>

      {/* Author */}
      <p className="text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 italic mt-4 text-center">
        — {quote.author}
      </p>
    </div>
  );
}
