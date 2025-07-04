import { Calendar, CheckSquare, Mic, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image2.png";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-semibold">{t("heroSection.title")}</h2>
          <p className="max-w-sm sm:ml-auto">{t("heroSection.subtitle")}</p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-xl md:-mx-8 lg:col-span-3">
          <div className="text-center">
            <img
              src={heroImage}
              className="max-w-full max-h-[500px] mx-auto object-contain"
              alt={t("heroSection.illustrationAlt")}
            />
            <div className="bg-gradient-to-t  from-white/20 to-transparent absolute inset-0 pointer-events-none"></div>
          </div>
        </div>
        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-4" />
              <h3 className="text-sm font-medium">
                {t("heroSection.taskAnalysis")}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("heroSection.taskAnalysisDesc")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <h3 className="text-sm font-medium">
                {t("heroSection.eventPlanning")}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("heroSection.eventPlanningDesc")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="size-4" />
              <h3 className="text-sm font-medium">
                {t("heroSection.voiceInput")}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("heroSection.voiceInputDesc")}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <h3 className="text-sm font-medium">
                {t("heroSection.aiPowered")}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("heroSection.aiPoweredDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
