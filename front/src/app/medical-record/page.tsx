import { MedicalForm } from "@/components/ui/medical-form"

export default function MedicalFormPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <MedicalForm />
        </div>
      </main>
    </div>
  )
}
