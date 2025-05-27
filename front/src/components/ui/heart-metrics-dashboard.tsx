"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { HeartRateChart } from "./chart-heart-rate"
import { HeartRateVariabilityChart } from "./chart-heart-rate-variability"
import { BloodOxygenChart } from "./chart-blood-oxygen"
import { DatePicker } from "./date-picker"
import { getDataForDate, getMostRecentDate } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { type ChartData } from "@/types/chart"

export function HeartMetricsDashboard() {
  // Estado para controlar se os componentes devem ser renderizados
  const [isClient, setIsClient] = useState(false)
  // Estado para a data selecionada
  const [selectedDate, setSelectedDate] = useState<Date>(getMostRecentDate())
  // Estado para os dados dos gráficos
  const [chartData, setChartData] = useState<ChartData>({
    heartRate: [],
    heartRateVariability: [],
    bloodOxygen: [],
  })
  // Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(true)

  // Este useEffect garante que os gráficos só sejam renderizados no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Este useEffect atualiza os dados quando a data selecionada muda
  useEffect(() => {
    if (isClient) {
      setIsLoading(true)
      // Simular um pequeno atraso de carregamento
      setTimeout(() => {
        const data = getDataForDate(selectedDate)
        setChartData(data)
        setIsLoading(false)
      }, 500)
    }
  }, [selectedDate, isClient])

  return (
    <div className="w-full space-y-6 mb-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold brand-text">
          Dados de {isClient ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "carregando..."}
        </h2>
        <div className="w-full sm:w-auto">
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
        </div>
      </div>

      {/* Gráficos de batimentos cardíacos e variabilidade lado a lado */}
      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 min-h-[400px]">
          {isClient ? (
            isLoading ? (
              <Card className="w-full h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin loading-spinner"></div>
                </CardContent>
              </Card>
            ) : (
              <HeartRateChart data={chartData.heartRate} />
            )
          ) : (
            <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-lg"></div>
          )}
        </div>
        <div className="w-full md:w-1/2 min-h-[400px]">
          {isClient ? (
            isLoading ? (
              <Card className="w-full h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin loading-spinner"></div>
                </CardContent>
              </Card>
            ) : (
              <HeartRateVariabilityChart data={chartData.heartRateVariability} />
            )
          ) : (
            <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-lg"></div>
          )}
        </div>
      </div>

      {/* Gráfico de oxigenação do sangue centralizado abaixo com o mesmo tamanho */}
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 min-h-[400px]">
          {isClient ? (
            isLoading ? (
              <Card className="w-full h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin loading-spinner"></div>
                </CardContent>
              </Card>
            ) : (
              <BloodOxygenChart data={chartData.bloodOxygen} />
            )
          ) : (
            <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-lg"></div>
          )}
        </div>
      </div>
    </div>
  )
}
