import Image from "next/image";
import Logo from "@/app/public/VitalSync-Logo.png";
import Link from "next/link";
import { UserRound } from 'lucide-react';

export default function Header() {
    return(
        <nav className="p-6 flex text-[#656565] font-medium text-lg w-full shadow-lg items-center">
            <div className="w-1/3 flex justify-center">
               <Image
                 src={Logo}
                 alt="Logo da VitalSync"
                 width={150}
                 height={150}
               />
            </div>
            <div className="w-2/3 flex flex-row-reverse gap-28 pr-5">
                <div className="flex gap-2 hover:text-[#E0004E]">
                    <UserRound /> Luiz
                </div>
                <Link href="#" className="hover:text-[#E0004E]">
                    Sobre o AVC
                </Link>
                <Link href="/home" className="hover:text-[#E0004E]">
                    Home
                </Link>
            </div>
        </nav>
    );
}
