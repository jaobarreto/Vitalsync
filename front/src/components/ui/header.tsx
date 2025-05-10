import Image from "next/image";
import Logo from "@/app/public/VitalSync-Logo.png";
import Link from "next/link";

export default function Header() {
    return(
        <nav className="p-6 flex text-[#656565] font-semibold text-lg w-full shadow-lg">
            <div className="w-1/3 flex justify-center">
               <Image
                 src={Logo}
                 alt="Logo da VitalSync"
                 width={150}
                 height={150}
               />
            </div>
            <div className="w-2/3 flex justify-around">
                <Link href="#" className="hover:text-[#E0004E]">
                    Home
                </Link>
                <Link href="#" className="hover:text-[#E0004E]">
                    Sobre o AVC
                </Link>
                <Link href="#" className="hover:text-[#E0004E]">
                    User
                </Link>
            </div>
        </nav>
    );
}
