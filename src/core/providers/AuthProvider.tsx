"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginRequest, RegisterRequest } from "@/types";
import { fetchCurrentUser, loginUser, registerUser } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("nyxoris_auth_token");
        if (token) {
          const currentUser = await fetchCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.warn("[Auth] Failed to restore session", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (req: LoginRequest) => {
    const res = await loginUser(req);
    localStorage.setItem("nyxoris_auth_token", res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const register = async (req: RegisterRequest) => {
    const res = await registerUser(req);
    localStorage.setItem("nyxoris_auth_token", res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("nyxoris_auth_token");
    setUser(null);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
