"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AtSign, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cookies from "js-cookie"


export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe] = useState(false)
  const [formError, setFormError] = useState("")

  const validateForm = (): boolean => {
    if (!name || !username || !email || !password || !confirmPassword) {
      setFormError("Por favor, preencha todos os campos")
      return false
    }

    if (username.includes(" ")) {
      setFormError("Nome de usuário não pode conter espaços")
      return false
    }

    if (password.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres")
      return false
    }

    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    try{
      const registerResponse = await fetch("http://localhost:3001/api/register",{
        method:"POST",
        headers:{ "Content-Type": "application/json" },
        body:JSON.stringify({name,username, email, password})

      })

      const dataRegisterResponse = await registerResponse.json()

      if (!registerResponse.ok) throw new Error(dataRegisterResponse.message || "Erro desconhecido");

      const authResponse = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const dataAuthResponse = await authResponse.json();

      if (!authResponse.ok) throw new Error(dataAuthResponse.message || "Erro desconhecido");

      const { accessToken, refreshToken } = dataAuthResponse;

      Cookies.set("access_token", accessToken, { expires: rememberMe ? 7 : undefined }); 
      Cookies.set("refresh_token", refreshToken, { expires: 7 });

      
    }catch{

    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    // Simular um pequeno atraso para mostrar o estado de carregamento
    setTimeout(() => {
      // Redirecionar para a página principal
      router.push("/")
    }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#222325] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#4B7CCC]">Lumin</h1>
          <p className="mt-2 text-gray-400">Crie sua conta e conecte-se</p>
        </div>

        <Card className="border-gray-800 bg-[#2a2b2d]">
          <CardHeader className="mt-2">
            <CardTitle className="text-xl text-white">Criar Conta</CardTitle>
            <CardDescription className="text-gray-400">Preencha os dados abaixo para se cadastrar</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {formError && <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-300">{formError}</div>}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome Completo"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 text-black placeholder:text-gray-500 focus-visible:ring-[#4B7CCC]/90"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Nome de Usuário
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 text-black placeholder:text-gray-500 focus-visible:ring-[#4B7CCC]/90"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 text-black placeholder:text-gray-500 focus-visible:ring-[#4B7CCC]/90"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 pr-10 text-black placeholder:text-gray-500 focus-visible:ring-[#4B7CCC]/90"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="border-gray-700 bg-[#FFFFFF] pl-10 text-black placeholder:text-gray-500 focus-visible:ring-[#4B7CCC]/90"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 p-5">
              <Button type="submit" className="w-50 bg-[#FFFFFF] text-[1A535C] hover:bg-[#4B7CCC]/90" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
              <p className="text-center text-sm text-white">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-[#4B7CCC] hover:underline">
                  Entrar
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

