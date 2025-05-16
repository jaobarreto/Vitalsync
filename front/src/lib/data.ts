// Dados simulados para diferentes datas
// Função para gerar dados aleatórios mas consistentes para cada data
import { addDays } from "date-fns"

// Função para gerar um número aleatório dentro de um intervalo, mas determinístico para uma data e semente
function getRandomNumber(min: number, max: number, date: Date, seed: number): number {
  // Criar um valor de semente baseado na data e no seed fornecido
  const dateValue = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const seedValue = (dateValue * seed) % 10000

  // Usar o seedValue para gerar um número "aleatório" entre 0 e 1
  const random = Math.sin(seedValue) * 10000 - Math.floor(Math.sin(seedValue) * 10000)

  // Mapear para o intervalo desejado
  return Math.floor(min + random * (max - min + 1))
}

// Gerar dados de batimentos cardíacos para uma data específica
export function generateHeartRateData(date: Date) {
  const baseData = [
    { hora: "22:00", bpm: 0 },
    { hora: "23:00", bpm: 0 },
    { hora: "00:00", bpm: 0 },
    { hora: "01:00", bpm: 0 },
    { hora: "02:00", bpm: 0 },
    { hora: "03:00", bpm: 0 },
    { hora: "04:00", bpm: 0 },
    { hora: "05:00", bpm: 0 },
    { hora: "06:00", bpm: 0 },
  ]

  // Preencher com valores baseados na data
  return baseData.map((item, index) => {
    // Diferentes sementes para diferentes horas
    const seed = index + 1

    // Gerar BPM baseado na hora e data
    let bpm
    if (index < 2) {
      // Primeiras horas: BPM mais alto (acordado)
      bpm = getRandomNumber(70, 85, date, seed)
    } else if (index >= 2 && index <= 5) {
      // Meio da noite: BPM mais baixo (sono profundo)
      bpm = getRandomNumber(50, 65, date, seed)
    } else {
      // Manhã: BPM aumentando (acordando)
      bpm = getRandomNumber(60, 75, date, seed)
    }

    // Adicionar alguns picos aleatórios para criar alertas
    // Usar a data como semente para que os picos sejam consistentes para a mesma data
    const dayOfMonth = date.getDate()
    if ((dayOfMonth + index) % 7 === 0) {
      bpm = getRandomNumber(80, 95, date, seed)
    }

    return { ...item, bpm }
  })
}

// Gerar dados de variabilidade cardíaca para uma data específica
export function generateHeartRateVariabilityData(date: Date) {
  const baseData = [
    { hora: "22:00", hrv: 0 },
    { hora: "23:00", hrv: 0 },
    { hora: "00:00", hrv: 0 },
    { hora: "01:00", hrv: 0 },
    { hora: "02:00", hrv: 0 },
    { hora: "03:00", hrv: 0 },
    { hora: "04:00", hrv: 0 },
    { hora: "05:00", hrv: 0 },
    { hora: "06:00", hrv: 0 },
  ]

  // Preencher com valores baseados na data
  return baseData.map((item, index) => {
    // Diferentes sementes para diferentes horas
    const seed = index + 10 // Usar uma semente diferente da função de BPM

    // Gerar HRV baseado na hora e data
    let hrv
    if (index < 2) {
      // Primeiras horas: HRV médio (acordado)
      hrv = getRandomNumber(40, 55, date, seed)
    } else if (index >= 2 && index <= 5) {
      // Meio da noite: HRV mais alto (sono profundo)
      hrv = getRandomNumber(65, 85, date, seed)
    } else {
      // Manhã: HRV diminuindo (acordando)
      hrv = getRandomNumber(45, 65, date, seed)
    }

    // Adicionar alguns vales aleatórios para criar alertas
    // Usar a data como semente para que os vales sejam consistentes para a mesma data
    const dayOfMonth = date.getDate()
    if ((dayOfMonth + index) % 9 === 0) {
      hrv = getRandomNumber(20, 30, date, seed)
    }

    return { ...item, hrv }
  })
}

// Função para obter dados para uma data específica
export function getDataForDate(date: Date) {
  return {
    heartRate: generateHeartRateData(date),
    heartRateVariability: generateHeartRateVariabilityData(date),
  }
}

// Função para obter a data mais recente com dados disponíveis
export function getMostRecentDate() {
  // Simular que temos dados até ontem
  return addDays(new Date(), -1)
}
