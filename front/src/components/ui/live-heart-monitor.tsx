"use client"

import { useState, useEffect } from "react"
import { Heart, Wifi, WifiOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface HeartData {
  bpm: number
  status: "Normal" | "Elevado" | "Baixo" | "Crítico"
  timestamp: Date
}

export function LiveHeartMonitor() {
  const [heartData, setHeartData] = useState<HeartData>({
    bpm: 72,
    status: "Normal",
    timestamp: new Date(),
  })
  const [isConnected, setIsConnected] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simular possível desconexão (5% de chance)
      if (Math.random() < 0.05) {
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
        return
      }

      setIsConnected(true)
      setIsAnimating(true)

      const baseBpm = 72
      const variation = Math.random() * 20 - 10 // Variação de -10 a +10
      const newBpm = Math.round(Math.max(45, Math.min(120, baseBpm + variation)))

      // Determinar status baseado no BPM
      let status: HeartData["status"]
      if (newBpm < 60) {
        status = "Baixo"
      } else if (newBpm > 100) {
        status = "Elevado"
      } else if (newBpm > 110) {
        status = "Crítico"
      } else {
        status = "Normal"
      }

      setHeartData({
        bpm: newBpm,
        status,
        timestamp: new Date(),
      })

      setTimeout(() => setIsAnimating(false), 300)
    }, 2000) // Atualizar a cada 2 segundos

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: HeartData["status"]) => {
    switch (status) {
      case "Normal":
        return "text-green-600"
      case "Elevado":
        return "text-yellow-600"
      case "Baixo":
        return "text-blue-600"
      case "Crítico":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getIndicatorColor = (status: HeartData["status"]) => {
    switch (status) {
      case "Normal":
        return "bg-green-500"
      case "Elevado":
        return "bg-yellow-500"
      case "Baixo":
        return "bg-blue-500"
      case "Crítico":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <div
                className={`w-8 h-8 rounded-full transition-all duration-300 ${getIndicatorColor(
                  heartData.status,
                )} ${isAnimating ? "scale-110" : "scale-100"}`}
              />
            </div>
            <div className="absolute -top-1 -right-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Batimento Cardíaco:</span>
            </div>
            <div className="flex items-center space-x-1">
              <span
                className={`text-lg font-bold transition-all duration-300 ${
                  isAnimating ? "scale-110 text-brand" : getStatusColor(heartData.status)
                }`}
              >
                {isConnected ? heartData.bpm : "--"}
              </span>
              <span className="text-sm text-gray-500">bpm</span>
              {isAnimating}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Status:</span>
            <span
              className={`font-bold transition-all duration-300 ${
                isConnected ? getStatusColor(heartData.status) : "text-gray-400"
              }`}
            >
              {isConnected ? heartData.status : "Desconectado"}
            </span>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Última atualização:</span>
              <span>
                {isConnected
                  ? heartData.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "Sem conexão"}
              </span>
            </div>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">AO VIVO</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
