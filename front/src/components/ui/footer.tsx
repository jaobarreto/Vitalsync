"use client"

import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full footer-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 footer-text-primary" />
            <span className="font-semibold footer-text-primary">VitalSync</span>
          </div>
          <div className="flex flex-col space-y-2 text-sm">
            <p className="footer-text-secondary footer-link footer-text-links">© 2025 Zonzzo Tecnologia em Saúde. Todos os direitos reservados.</p>
            <p className="text-xs footer-text-secondary footer-link footer-text-links">
              VitalSync é um projeto fictício criado apenas para fins acadêmicos.
            </p>
          </div>
          <div className="flex space-x-6 text-xs">
            <a href="#" className="footer-link footer-text-links">
              Política de Privacidade
            </a>
            <a href="#" className="footer-link footer-text-links">
              Termos de Uso
            </a>
            <a href="#" className="footer-link footer-text-links">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
