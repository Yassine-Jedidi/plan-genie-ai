import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // shadcn button component
import { GetStartedButton } from "./get-started-button";
import { Link } from "react-router-dom";
import { HeroSection } from "./hero-section";
import { Component as FAQSection } from "./faq-section";
import { useTranslation } from "react-i18next";
import { ContainerScroll } from "./container-scroll-animation";
import heroImage from "@/assets/hero-image.png";
import { CookieConsent } from "../cookie-consent";

function Hero() {
  const { t } = useTranslation();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      t("hero.efficient"),
      t("hero.organized"),
      t("hero.intelligent"),
      t("hero.timeSaving"),
      t("hero.powerful"),
    ],
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <>
      <div className="w-full">
        <div className="container mx-auto">
          <div className="flex gap-8 py-28 items-center justify-center flex-col">
            {/* CTA Button */}
            <div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  const faqSection = document.getElementById("faqs-section");
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t("hero.discoverNow")} <MoveRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Heading Section */}
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-6xl max-w-2xl tracking-tighter text-center font-regular">
                <span className="text-primary">
                  {t("hero.boostProductivityWith")}
                </span>
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
                      {title} {t("hero.completeBoostProductivity")}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                {t("hero.description")}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-3">
              {/* <Button variant="outline">{t("hero.comparePlans")}</Button> */}
              <Link to="/sign-up">
                <GetStartedButton />
              </Link>
            </div>
            <div className="flex flex-col overflow-hidden">
              <ContainerScroll
                titleComponent={
                  <>
                    <h1 className="text-4xl font-semibold text-black dark:text-white">
                      Transform your notes into <br />
                      <span className="text-7xl  font-bold mt-1 leading-none">
                        Organized Tasks and Events
                      </span>
                    </h1>
                  </>
                }
              >
                <img
                  src={heroImage}
                  alt="hero"
                  height={720}
                  width={1400}
                  className="mx-auto rounded-2xl object-cover h-full object-left-top"
                  draggable={false}
                />
              </ContainerScroll>
            </div>

            <HeroSection />
            <div id="faqs-section">
              <FAQSection />
            </div>
          </div>
        </div>
      </div>
      <CookieConsent />
    </>
  );
}

export default Hero;
