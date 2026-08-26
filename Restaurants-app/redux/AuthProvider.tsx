"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/redux/hooks";

import { restoreAuth } from "@/redux/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");

    if (!savedAuth) {
      return;
    }

    try {
      const auth = JSON.parse(savedAuth);

      if (auth.user && auth.token) {
        dispatch(
          restoreAuth({
            user: auth.user,
            token: auth.token,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to restore auth:", error);

      localStorage.removeItem("auth");
    }
  }, [dispatch]);

  return <>{children}</>;
}
