import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";

interface VerifyPasswordProps {
  password: string;
  onVerifiedPasswordChange: (value: string) => void;
}

function VerifyPassword({
  password,
  onVerifiedPasswordChange,
}: VerifyPasswordProps) {
  const id = useId();
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVerifyPassword(value);
    onVerifiedPasswordChange(value);
  };

  const getMatchStatus = () => {
    return verifyPassword.split("").map((char, index) => ({
      char,
      matches: char === password[index],
    }));
  };

  const matchStatus = getMatchStatus();
  const allMatch = password === verifyPassword && password.length > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Verify Password</Label>
      <div className="relative">
        {/* Overlay for colored characters */}
        <div className="absolute inset-y-0 left-3 flex items-center font-mono text-sm pointer-events-none">
          {matchStatus.map((status, index) => (
            <span
              key={index}
              className={`transition-colors ${
                status.matches ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {isVisible ? status.char : "•"}
            </span>
          ))}
        </div>

        {/* Actual input */}
        <Input
          id={id}
          className={`pe-9 font-mono caret-black ${
            isVisible ? "text-black" : "text-transparent"
          }`}
          type={isVisible ? "text" : "password"}
          value={verifyPassword}
          onChange={handleChange}
          aria-invalid={verifyPassword.length > 0 && !allMatch}
          aria-describedby={`${id}-description`}
          style={{
            backgroundColor: "transparent",
            position: "relative",
            zIndex: 10,
          }}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        ></button>
      </div>

      {verifyPassword && (
        <p
          id={`${id}-description`}
          className={`text-sm ${
            allMatch ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {allMatch ? "Passwords match!" : "Passwords do not match"}
        </p>
      )}
    </div>
  );
}

export { VerifyPassword };
