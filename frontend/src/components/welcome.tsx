import { TextLoop } from "./ui/text-loop";

export function WelcomeTextLoop() {
  return (
    <div className="flex justify-center">
      <div className="w-[400px] text-center">
        <TextLoop interval={3}>
          {[
            "What would you like to do today?",
            "Let's create a task...",
            "Start planning a project...",
            "Add something to your calendar...",
          ].map((text) => (
            <span
              key={text}
              className="text-center text-3xl font-light text-background-foreground"
            >
              {text}
            </span>
          ))}
        </TextLoop>
      </div>
    </div>
  );
}
