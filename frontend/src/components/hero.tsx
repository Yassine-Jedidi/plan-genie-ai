import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // shadcn button component
import { GetStartedButton } from "./get-started-button";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["efficient", "organized", "intelligent", "time-saving", "powerful"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-40 items-center justify-center flex-col">
          {/* CTA Button */}
          <div>
            <Button variant="outline" className="flex items-center gap-2">
              Discover how it works <MoveRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Heading Section */}
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-6xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-primary">Boost your productivity with</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Plan Genie AI helps you manage your tasks and events effortlessly.
              Using AI-powered automation, we transform your notes and voice
              inputs into well-structured schedules, reminders, and reports.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3">
            <Button variant="outline">Compare Plans</Button>
            <Link to="/sign-up">
              <GetStartedButton />
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              ⭐️⭐️⭐️⭐️⭐️ Rated 4.9/5 by 1,000+ users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
