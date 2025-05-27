"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MedicalForm() {
  const [birthDay, setBirthDay] = useState("26")
  const [birthMonth, setBirthMonth] = useState("03")
  const [birthYear, setBirthYear] = useState("1955")
  const [weight, setWeight] = useState("81")
  const [height, setHeight] = useState("178")
  const [gender, setGender] = useState("masculino")
  const [hypertension, setHypertension] = useState("sim")
  const [diabetes, setDiabetes] = useState("tipo2")
  const [stroke, setStroke] = useState("nao")
  const [cholesterol, setCholesterol] = useState("ja-teve")
  const router = useRouter()

  // Gerar arrays para os dropdowns
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))
  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const birthDate = `${birthDay}/${birthMonth}/${birthYear}`
    console.log("Formulário enviado:", {
      birthDate,
      weight,
      height,
      gender,
      hypertension,
      diabetes,
      stroke,
      cholesterol,
    })
    router.push("/home")
  }

  return (
    <div className="min-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold brand-text">Ficha Médica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label>Data de nascimento:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Dia */}
                  <Select value={birthDay} onValueChange={setBirthDay}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Mês */}
                  <Select value={birthMonth} onValueChange={setBirthMonth}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Ano */}
                  <Select value={birthYear} onValueChange={setBirthYear}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <Label htmlFor="weight">Peso:</Label>
                <div className="relative">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full h-10 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    kg
                  </span>
                </div>
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <Label htmlFor="gender">Sexo:</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Altura */}
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm):</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>

            {/* Histórico Médico */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold brand-text text-center">Histórico Médico</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hipertensão */}
                <div className="space-y-2">
                  <Label htmlFor="hypertension">Hipertensão:</Label>
                  <Select value={hypertension} onValueChange={setHypertension}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="nao-sei">Não sei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Diabetes */}
                <div className="space-y-2">
                  <Label htmlFor="diabetes">Diabetes:</Label>
                  <Select value={diabetes} onValueChange={setDiabetes}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="tipo1">Tipo 1</SelectItem>
                      <SelectItem value="tipo2">Tipo 2</SelectItem>
                      <SelectItem value="gestacional">Gestacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* AVC */}
                <div className="space-y-2">
                  <Label htmlFor="stroke">AVC:</Label>
                  <Select value={stroke} onValueChange={setStroke}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao-sei">Não sei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Colesterol Alto */}
                <div className="space-y-2">
                  <Label htmlFor="cholesterol">Colesterol alto:</Label>
                  <Select value={cholesterol} onValueChange={setCholesterol}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nao">Não</SelectItem>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="ja-teve">Já teve</SelectItem>
                      <SelectItem value="nao-sei">Não sei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Botão de Conclusão */}
            <div className="flex flex-col items-center space-y-4 pt-4">
              <Button
                type="submit"
                className="bg-[#e0004e] hover:bg-[#e0004e]/80 text-white px-8 py-2 h-10 rounded-md font-medium"
              >
                Concluir
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Esses dados podem ser alterados a qualquer momento no Perfil.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
