"use client"

import { AlertCircle, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BloodOxygenChartProps {
  data: Array<{ hora: string; spo2: number }>
}

export function BloodOxygenChart({ data }: BloodOxygenChartProps) {
  // Calcular a média de SpO2 durante o sono profundo (2h-4h)
  const sleepSpo2 = data.slice(3, 6).reduce((sum, item) => sum + item.spo2, 0) / 3
  // Calcular a média de SpO2 ao adormecer (22h-23h)
  const awakeSpo2 = data.slice(0, 2).reduce((sum, item) => sum + item.spo2, 0) / 2
  // Calcular a redução percentual (geralmente pequena para SpO2)
  const reduction = Math.round(((awakeSpo2 - sleepSpo2) / awakeSpo2) * 100 * 10) / 10

  const chartConfig = {
    spo2: {
      label: "SpO2 (%)",
      color: "hsl(180, 70%, 45%)",
    },
  } satisfies ChartConfig

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Oxigenação do Sangue</CardTitle>
        <CardDescription>Saturação de oxigênio (SpO2) por hora</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hora" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[90, 100]} tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="spo2"
              type="natural"
              stroke="hsl(180, 70%, 45%)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24
                // Só mostra o alerta se o SpO2 for menor que 94% (limite de alerta)
                if (payload.spo2 < 94) {
                  return (
                    <AlertCircle
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
                // Retorna um grupo SVG vazio quando estiver acima do limite
                return <g key={payload.hora} />
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {reduction > 0 ? (
            <>
              Redução de {reduction}% durante o sono profundo <TrendingDown className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>Níveis estáveis durante toda a noite</>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-red-500 font-medium">
          <AlertCircle className="h-4 w-4 fill-red-100" /> Alertas quando SpO2 &lt; 94%
        </div>
      </CardFooter>
    </Card>
  );
}
