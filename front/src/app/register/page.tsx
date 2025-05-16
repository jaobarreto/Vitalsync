import RegisterForm  from "@/components/ui/registerForm";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/public/VitalSync-Logo.png";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <Image
          src={Logo}
          alt="Logo da VitalSync"
          width={200}
          height={250}
          className="mb-5"
        />
      </div>
      <div className="bg-gradient-to-b from-[#E0004E] to-[#8E0032] text-white rounded-2xl p-10 w-full max-w-4xl shadow-lg flex flex-col md:flex-row">
        <div className="md:w-1/2 flex flex-col text-center justify-between">
            <h1 className="font-bold text-2xl pr-5 mt-5">Criar uma conta</h1>
            <Link href="/login" className="text-sm underline text-white md:mb-4">
              Já possui uma conta? Fazer login
            </Link>
        </div>
        <div className="md:w-1/2">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
