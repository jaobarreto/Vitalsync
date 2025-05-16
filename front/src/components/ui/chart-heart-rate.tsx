"use client"

import { Heart, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { hora: "22:00", bpm: 78 },
  { hora: "23:00", bpm: 72 },
  { hora: "00:00", bpm: 65 },
  { hora: "01:00", bpm: 58 },
  { hora: "02:00", bpm: 55 },
  { hora: "03:00", bpm: 54 },
  { hora: "04:00", bpm: 56 },
  { hora: "05:00", bpm: 82 }, // Valor alto para demonstrar o alerta
  { hora: "06:00", bpm: 68 },
]

const chartConfig = {
  bpm: {
    label: "BPM",
    color: "hsl(346, 84%, 61%)",
  },
} satisfies ChartConfig

export function HeartRateChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Batimentos Cardíacos</CardTitle>
        <CardDescription>Média de BPM por hora</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hora" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[50, 90]} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="bpm"
              type="natural"
              stroke="var(--color-bpm)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24
                // Só mostra o coração se o BPM for maior que 75 (limite de alerta)
                if (payload.bpm > 75) {
                  return (
                    <Heart
                      key={payload.hora}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill="hsl(0, 100%, 95%)"
                      stroke="hsl(0, 100%, 60%)"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  )
                }
                // Retorna null para não mostrar nada quando estiver abaixo do limite
                return null
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Redução de 30% durante o sono profundo <TrendingDown className="h-4 w-4 text-green-500" />
        </div>
        <div className="mt-2 flex items-center gap-2 text-red-500 font-medium">
          <Heart className="h-4 w-4 fill-red-100" /> Alertas quando BPM &gt; 75
        </div>
      </CardFooter>
    </Card>
  )
}
