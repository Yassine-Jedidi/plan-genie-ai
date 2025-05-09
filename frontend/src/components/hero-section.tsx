import { Calendar, CheckSquare, Mic, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.png";

export function HeroSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-semibold">
            Plan Genie AI makes task management effortless
          </h2>
          <p className="max-w-sm sm:ml-auto">
            Transform your notes and voice memos into organized tasks and events
            with our intelligent AI assistant that understands your priorities.
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-xl md:-mx-8 lg:col-span-3">
          <div className="text-center">
            <img
              src={heroImage}
              className="max-w-full max-h-[500px] mx-auto object-contain"
              alt="task management illustration"
            />
            <div className="bg-gradient-to-t  from-white/20 to-transparent absolute inset-0 pointer-events-none"></div>
          </div>
        </div>
        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-4" />
              <h3 className="text-sm font-medium">Task Analysis</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Automatically analyze and categorize your tasks with priorities
              and deadlines.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <h3 className="text-sm font-medium">Event Planning</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Convert notes into calendar events with smart date and time
              detection.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="size-4" />
              <h3 className="text-sm font-medium">Voice Input</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Record your thoughts and let our AI transform voice into
              structured tasks.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <h3 className="text-sm font-medium">AI Powered</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Advanced NLP extracts key information to help you stay organized
              and productive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
