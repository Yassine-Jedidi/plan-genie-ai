import { TextLoop } from "../ui/text-loop";
import { useTranslation } from "react-i18next";

export function WelcomeTextLoop() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center">
      <div className="w-[400px] text-center">
        <TextLoop interval={3}>
          {[
            t("welcome.whatDoYouWant"),
            t("welcome.createTask"),
            t("welcome.planProject"),
            t("welcome.addToCalendar"),
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
