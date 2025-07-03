import * as React from "react";
import { useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border data-[state=active]:text-foreground",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

type ViewType = "general" | "icons" | "library";

interface FAQItem {
  question: string;
  answer: string;
  id: string;
}

interface FAQSection {
  category: string;
  items: FAQItem[];
}

interface FAQAccordionProps {
  category: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: Record<ViewType, FAQSection> = {
  general: {
    category: "General",
    items: [
      {
        id: "what-is-plan-genie-ai",
        question: "What is Plan Genie AI?",
        answer:
          "Plan Genie AI is a smart application designed to help you manage your daily tasks and events effortlessly using advanced AI.",
      },
      {
        id: "how-does-it-help-me",
        question: "How does Plan Genie AI make my life easier?",
        answer:
          "It automates task creation, plans your events, and helps you track your progress, all by understanding your notes and voice inputs.",
      },
      {
        id: "what-can-i-input",
        question: "What kind of information can I give to Plan Genie AI?",
        answer:
          "You can simply type your notes or speak voice messages, and Plan Genie AI will understand and process them.",
      },
      {
        id: "how-does-it-understand-my-input",
        question: "How does it understand what I say or type?",
        answer:
          "It uses advanced AI to identify important details like priorities, deadlines, dates, and context from your text or voice.",
      },
      {
        id: "can-it-handle-different-languages",
        question: "Can Plan Genie AI understand different languages?",
        answer:
          "Yes, it's designed to process information in multiple languages, making it flexible for various users.",
      },
    ],
  },
  icons: {
    category: "Task & Event Management",
    items: [
      {
        id: "automatic-tasks",
        question: "Does it create tasks for me automatically?",
        answer:
          "Absolutely! It automatically creates organized task lists with priorities and deadlines based on your input.",
      },
      {
        id: "calendar-sync",
        question: "Can it add events to my calendar?",
        answer:
          "Yes, it can sync the events it identifies directly with an interactive calendar for easy viewing.",
      },
      {
        id: "can-i-change-things",
        question: "What if I need to change a task or event it created?",
        answer:
          "You have full control. You can easily modify any tasks or events that Plan Genie AI generates.",
      },
    ],
  },
  library: {
    category: "Tracking & Support",
    items: [
      {
        id: "daily-reports",
        question: "Can I see how productive I've been?",
        answer:
          "Yes, it generates daily summaries of your completed activities and shows you how well you're managing your tasks.",
      },
      {
        id: "visualize-progress",
        question: "Can I see my progress visually?",
        answer:
          "It provides interactive charts to help you visualize your task completion, deadlines, and how you spend your time.",
      },
      {
        id: "notifications",
        question: "Will I get reminders for important tasks?",
        answer:
          "Definitely! It sends you custom alerts for upcoming deadlines and high-priority tasks to keep you on track.",
      },
      {
        id: "proactive-suggestions",
        question: "Does it give me tips to be more efficient?",
        answer:
          "Yes, it can offer smart suggestions to help you optimize your priorities and make the most of your time.",
      },
      {
        id: "app-availability",
        question: "Where can I use Plan Genie AI?",
        answer:
          "It's available as a responsive website that you can access from any modern web browser. Mobile apps are also being developed!",
      },
    ],
  },
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ category, items }) => (
  <div className="">
    <Badge variant={"outline"} className="py-2 px-6 rounded-md">
      {category}
    </Badge>
    <Accordion type="single" collapsible className="w-full">
      {items.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export const Component = () => {
  const [activeView, setActiveView] = useState<ViewType>("general");

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="text-center mb-12">
        <p className="text-sm font-medium text-primary mb-2">FAQs</p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Frequently asked questions
        </h1>
        <p className="text-xl text-muted-foreground">
          Need help with something? Here are our most frequently asked
          questions.
        </p>
      </header>

      <div className="flex justify-center sticky top-2">
        <Tabs
          defaultValue="general"
          onValueChange={(value) => setActiveView(value as ViewType)}
          className="mb-8 max-w-xl border rounded-xl bg-background"
        >
          <TabsList className="w-full justify-start h-12 p-1">
            <TabsTrigger value="general">General FAQs</TabsTrigger>
            <TabsTrigger value="icons">Integrations</TabsTrigger>
            <TabsTrigger value="library">Features</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <FAQAccordion
        category={FAQ_SECTIONS[activeView].category}
        items={FAQ_SECTIONS[activeView].items}
      />
    </div>
  );
};
