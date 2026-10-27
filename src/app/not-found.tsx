import { Metadata } from "next";
import { Ghost } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Meteors } from "@/components/ui/meteors";
import { AuroraText } from "@/components/ui/aurora-text";

export const metadata: Metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* Meteor Effect */}
      <Meteors number={30} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Ghost Icon with Animation */}
        <div className="mb-4 animate-bounce">
          <Ghost className="h-20 w-20 text-muted-foreground/50" />
        </div>

        {/* 404 Number with Ticker and Aurora Effect */}
        <div className="flex items-center gap-4">
          <AuroraText className="text-8xl md:text-9xl font-bold">
            <NumberTicker
              value={404}
              className="font-bold"
            />
          </AuroraText>
        </div>

        {/* Animated Text */}
        <div className="max-w-2xl text-center">
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-4xl font-bold text-foreground md:text-5xl"
          >
            Page Not Found
          </TextAnimate>

          <TextAnimate
            animation="blurIn"
            by="word"
            delay={0.3}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            Oops! The page you are looking for seems to have wandered off into the digital void.
          </TextAnimate>
        </div>


        {/* Additional Info */}
        <div className="pt-8">
          <TextAnimate
            animation="fadeIn"
            by="word"
            delay={0.6}
            className="text-sm text-muted-foreground"
          >
            Error Code: 404 | This page does not exist
          </TextAnimate>
        </div>
      </div>

      {/* Decorative gradient blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-[128px]" />
      </div>
    </div>
  );
}
