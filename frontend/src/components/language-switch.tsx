import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Check, Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "language.english", flag: "🇺🇸" },
  { code: "fr", label: "language.french", flag: "🇫🇷" },
  // Add more languages here
];

export function LanguageSwitch({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const current = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          aria-label={t("language.selectLanguage")}
        >
          <Globe className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">{t(current.label)}</span>
          <span className="ml-1">{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className="flex items-center gap-2"
            aria-selected={currentLang === lang.code}
          >
            <span>{lang.flag}</span>
            <span>{t(lang.label)}</span>
            {currentLang === lang.code && (
              <Check className="ml-auto w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitch;
