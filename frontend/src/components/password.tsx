import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useMemo, useState, forwardRef } from "react";
import { useTranslation } from "react-i18next";

interface PasswordProps {
  onChange?: (value: string) => void;
}

const Password = forwardRef<HTMLInputElement, PasswordProps>(
  ({ onChange }, ref) => {
    const { t } = useTranslation();
    const id = useId();
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setPassword(newValue);
      onChange?.(newValue);
    };

    const checkStrength = (pass: string) => {
      const requirements = [
        { regex: /.{6,}/, text: t("password.atLeast6") },
        { regex: /[0-9]/, text: t("password.atLeast1Number") },
        { regex: /[a-z]/, text: t("password.atLeast1Lowercase") },
        { regex: /[A-Z]/, text: t("password.atLeast1Uppercase") },
      ];

      return requirements.map((req) => ({
        met: req.regex.test(pass),
        text: req.text,
      }));
    };

    const strength = checkStrength(password);

    const strengthScore = useMemo(() => {
      return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
      if (score === 0) return "bg-border";
      if (score <= 1) return "bg-red-500";
      if (score <= 2) return "bg-orange-500";
      if (score === 3) return "bg-amber-500";
      return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
      if (score === 0) return t("password.enterPassword");
      if (score <= 2) return t("password.weak");
      if (score === 3) return t("password.medium");
      return t("password.strong");
    };

    return (
      <div className="min-w-[300px]">
        <div className="space-y-2">
          <Label htmlFor={id}>{t("password.label")}</Label>
          <div className="relative">
            <Input
              id={id}
              ref={ref}
              className="pe-9"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={strengthScore < 4}
              aria-describedby={`${id}-description`}
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? t("password.hide") : t("password.show")}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={t("password.strength")}
        >
          <div
            className={`h-full ${getStrengthColor(
              strengthScore
            )} transition-all duration-500 ease-out`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          ></div>
        </div>

        <p
          id={`${id}-description`}
          className="mb-2 text-sm font-medium text-foreground"
        >
          {getStrengthText(strengthScore)}. {t("password.mustContain")}
        </p>

        <ul className="space-y-1.5" aria-label={t("password.requirements")}>
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <Check
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <X
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${
                  req.met ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                {req.text}
                <span className="sr-only">
                  {req.met
                    ? t("password.requirementMet")
                    : t("password.requirementNotMet")}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

Password.displayName = "Password";

export { Password };
