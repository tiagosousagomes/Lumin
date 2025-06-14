"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_SERVER}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro desconhecido");
      const { accessToken, refreshToken } = data;
      Cookies.set("access_token", accessToken, { expires: rememberMe ? 7 : undefined });
      Cookies.set("refresh_token", refreshToken, { expires: 7 });
      router.push("/home");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F5] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#615fff]">Lumin</h1>
          <p className="mt-2 text-gray-700">Conecte-se com o mundo</p>
        </div>

        <Card className="border-gray-800 bg-[#FFFFFF]">
          <CardHeader>
            <CardTitle className="text-xl text-[#615fff]">Entrar</CardTitle>
            <CardDescription className="text-gray-400">
              Entre com sua conta para continuar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#615fff]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 text-black placeholder:text-gray-500 focus-visible:ring-[#615fff]/90"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#615fff]">
                    Senha
                  </Label>
                  <Link
                    href="/login/forgot-password"
                    className="text-xs text-[#615fff] hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 pr-10 text-black placeholder:text-gray-500 focus-visible:ring-[#615fff]/90"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-black data-[state=checked]:bg-[#615fff] data-[state=checked]:text-[#ffffff]"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-[#615fff]"
                >
                  Lembrar de mim
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 p-3">
              <Button
                type="submit"
                className="w-full bg-[#615fff] text-[#FFFFFF] hover:bg-[#615fff]/90"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-sm text-black">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-[#615fff] hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}