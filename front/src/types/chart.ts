export interface HeartRateData {
  bpm: number
  hora: string
}

export interface HeartRateVariabilityData {
  hrv: number
  hora: string
}

export interface BloodOxygenData {
  spo2: number
  hora: string
}

export interface ChartData {
  heartRate: HeartRateData[]
  heartRateVariability: HeartRateVariabilityData[]
  bloodOxygen: BloodOxygenData[]
} 