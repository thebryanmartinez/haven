"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AUTH_KEY = "isAuthenticated";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem(AUTH_KEY);
      const authenticated = authStatus === "true";
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (pin: string) => {
    try {
      const response = await fetch("/api/validate-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.valid) {
        sessionStorage.setItem(AUTH_KEY, "true");
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error validating PIN:", error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    router.push("/login");
  };

  const redirectToLogin = () => {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    redirectToLogin,
  };
};

export default useAuth;
