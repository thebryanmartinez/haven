"use client";

import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/modules/authentication/hooks";

export const PINLogin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setError("");
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const submitPin = async (pinValue: string) => {
    if (pinValue.length === 4) {
      setIsLoading(true);
      setError("");

      try {
        const success = await login(pinValue);

        if (success) {
          router.push("/");
        } else {
          setError("Incorrect PIN");
          setPin("");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("Login failed. Please try again.");
        setPin("");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter 4 digits");
    }
  };

  const handleEnter = () => submitPin(pin);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        if (pin.length < 4) {
          const newPin = pin + e.key;
          setPin(newPin);
          setError("");
          if (newPin.length === 4) {
            submitPin(newPin);
          }
        }
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setPin((prev) => prev.slice(0, -1));
        setError("");
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClear();
      } else if (e.key === "Enter") {
        e.preventDefault();
        submitPin(pin);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, isLoading]);

  const renderKeypad = () => {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
      <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
        {digits.map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            className={`
              aspect-square flex items-center justify-center
              text-xl font-semibold rounded-lg
              bg-secondary-background border-2 border-border
              hover:bg-main hover:text-main-foreground
              active:shadow-none active:translate-x-1 active:translate-y-1
              transition-all duration-150 shadow-shadow
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={pin.length >= 4}
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className={`
            aspect-square flex items-center justify-center
            rounded-lg bg-secondary-background border-2 border-border
            hover:bg-main hover:text-main-foreground
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all duration-150 shadow-shadow
          `}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 0 Button */}
        <button
          onClick={() => handleDigitClick("0")}
          className={`
            aspect-square flex items-center justify-center
            text-xl font-semibold rounded-lg
            bg-secondary-background border-2 border-border
            hover:bg-main hover:text-main-foreground
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all duration-150 shadow-shadow
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          disabled={pin.length >= 4}
        >
          0
        </button>

        {/* Continue Button */}
        <button
          onClick={handleEnter}
          disabled={isLoading}
          className={`
            aspect-square flex items-center justify-center
            rounded-lg bg-main border-2 border-main
            text-main-foreground font-semibold
            hover:bg-main/90
            active:shadow-none active:translate-x-1 active:translate-y-1
            transition-all duration-150 shadow-shadow
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-main-foreground/30 border-t-main-foreground rounded-full animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  };

  const renderPINDisplay = () => (
    <div className="flex justify-center space-x-3 mb-6">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`
            w-4 h-4 rounded-full border-2 transition-colors duration-200
            ${
              pin[index]
                ? "bg-main border-main"
                : "border-border bg-transparent"
            }
          `}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-end min-h-screen bg-background px-8 pb-12 sm:pb-24">
      <div className="w-full max-w-md mt-auto mb-auto">
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-3xl font-heading text-foreground">Enter PIN</h1>
          <p className="text-muted-foreground">Please enter your 4-digit PIN</p>
          {renderPINDisplay()}
        </div>

        {renderKeypad()}

        {error && (
          <div className="text-center mt-4">
            <p className="text-error text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PINLogin;
