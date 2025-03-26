"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular um pequeno atraso para mostrar o estado de carregamento
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1500)
  
    
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FFF7] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1A535C]">Lumin</h1>
          <p className="mt-2 text-gray-400">Recupere o acesso à sua conta</p>
        </div>

        <Card className="border-gray-800 bg-[#1A535C]">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recuperar Senha</CardTitle>
            <CardDescription className="text-gray-400">Enviaremos um link para redefinir sua senha</CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-900/20 p-4 text-sm text-green-300">
                <p>Email de recuperação enviado com sucesso!</p>
                <p className="mt-2">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
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
                      className="border-gray-700 bg-[#FFFFFF] pl-10 text-black placeholder:text-gray-500 focus-visible:ring-[#FFFFFF]/90"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 p-6">
                <Button
                  type="submit"
                  className="w-full bg-[#FFFFFF] text-[#1A535C] hover:bg-[#FFFFFF]/90"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </CardFooter>
            </form>
          )}

          <div className="p-6 pt-0">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-[#FFFFFF] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

