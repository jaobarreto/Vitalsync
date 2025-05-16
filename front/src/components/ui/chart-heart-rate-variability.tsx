"use client"

import { AlertTriangle, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { hora: "22:00", hrv: 45 },
  { hora: "23:00", hrv: 52 },
  { hora: "00:00", hrv: 68 },
  { hora: "01:00", hrv: 75 },
  { hora: "02:00", hrv: 82 },
  { hora: "03:00", hrv: 85 },
  { hora: "04:00", hrv: 80 },
  { hora: "05:00", hrv: 25 }, // Valor baixo para demonstrar o alerta
  { hora: "06:00", hrv: 50 },
]

const chartConfig = {
  hrv: {
    label: "HRV (ms)",
    color: "hsl(215, 84%, 61%)",
  },
} satisfies ChartConfig

export function HeartRateVariabilityChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Variabilidade Cardíaca</CardTitle>
        <CardDescription>HRV (ms) por hora</CardDescription>
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
            <YAxis domain={[20, 90]} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="hrv"
              type="natural"
              stroke="var(--color-hrv)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24
                // Só mostra o alerta se o HRV for menor que 30 (limite de alerta)
                if (payload.hrv < 30) {
                  return (
                    <AlertTriangle
                      key={payload.hora}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill="hsl(38, 100%, 95%)"
                      stroke="hsl(38, 100%, 50%)"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  )
                }
                // Retorna null para não mostrar nada quando estiver acima do limite
                return null
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Aumento de 80% durante o sono profundo <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="mt-2 flex items-center gap-2 text-amber-500 font-medium">
          <AlertTriangle className="h-4 w-4 fill-amber-100" /> Alertas quando HRV &lt; 30
        </div>
      </CardFooter>
    </Card>
  )
}
