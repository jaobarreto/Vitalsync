"use client"

import { LiveHeartMonitor } from "./live-heart-monitor"
import Header from "./header"

export function LiveMonitorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold brand-text">Monitor Cardíaco em Tempo Real</h1>
            <p className="text-gray-600">Acompanhe seus batimentos cardíacos ao vivo</p>
          </div>
          <div className="flex justify-center">
            <LiveHeartMonitor />
          </div>
        </div>
      </main>
    </div>
  )
}
