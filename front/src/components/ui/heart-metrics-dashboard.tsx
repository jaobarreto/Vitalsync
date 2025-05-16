"use client"

import { useState, useEffect } from "react"
import { HeartRateChart } from "./chart-heart-rate"
import { HeartRateVariabilityChart } from "./chart-heart-rate-variability"

export function HeartMetricsDashboard() {
  // Estado para controlar se os componentes devem ser renderizados
  const [isClient, setIsClient] = useState(false)

  // Este useEffect garante que os gráficos só sejam renderizados no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 min-h-[400px]">
        {isClient ? <HeartRateChart /> : <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-lg"></div>}
      </div>
      <div className="w-full md:w-1/2 min-h-[400px]">
        {isClient ? (
          <HeartRateVariabilityChart />
        ) : (
          <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-lg"></div>
        )}
      </div>
    </div>
  );
}
