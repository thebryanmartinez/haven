"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@bytefin/ui/components/input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/modules/authentication/hooks";

const PIN_LENGTH = 6;
const DIGITS_ONLY = "^\\d+$";

export const PINLogin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleChange = (value: string) => {
    setPin(value);
    setError("");
  };

  const handleComplete = async (pinValue: string) => {
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-8">
      <div className="w-full max-w-md">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-heading text-foreground">Enter PIN</h1>
          <p className="text-muted-foreground">Please enter your 6-digit PIN</p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            ref={inputRef}
            maxLength={PIN_LENGTH}
            pattern={DIGITS_ONLY}
            inputMode="numeric"
            value={pin}
            onChange={handleChange}
            onComplete={handleComplete}
            disabled={isLoading}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

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
