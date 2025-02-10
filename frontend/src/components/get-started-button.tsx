import { GlowEffect } from "@/components/ui/glow-effect";
import { MoveRight } from "lucide-react";

export function GetStartedButton() {
  return (
    <div className="relative">
      <GlowEffect
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        mode="colorShift"
        blur="medium"
        duration={3}
        scale={0.9}
      />
      <button className="relative inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground outline outline-1 outline-[#fff2f21f] dark:bg-primary dark:text-primary-foreground dark:outline-gray-300">
        Get Started <MoveRight className="w-4 h-4" />
      </button>
    </div>
  );
}
