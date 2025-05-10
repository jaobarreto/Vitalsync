"use client";

import Image from "next/image";
import Logo from "@/app/public/VitalSync-Logo.png";
import LoginImg from "@/app/public/Login-Img.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    const [form, setForm] = useState({
            email: "",
            password: "",
        });
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({...form, [e.target.name]: e.target.value});
        };
    
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            //fazer a lógica do cadastro conversando com a API
            console.log(form)
        };

    return(
        <div className="flex flex-col min-h-screen items-center justify-center">
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
                    <h1 className="font-bold text-2xl md:mt-5">Fazer login</h1>
                    <Image
                        src={LoginImg}
                        alt="Ícone da tela de login"
                        width={70}
                        height={80}
                    />
                </div>
                <div className="md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <Label htmlFor="email" className="mb-2">Email:</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border-2"
                />
            </div>
            <div>
                <Label htmlFor="password" className="mb-2">Senha:</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="border-2"
                />
            </div>
            <div className="text-center">
                <Link href="#" className="text-sm underline">
                  Esqueci minha senha
                </Link>
            </div>
            <div className="flex pt-4 justify-around">
                <Link href="#" className="text-sm md:mt-2">
                  Esqueci minha senha
                </Link>
                <Button type="submit" className="bg-white text-[#E0004E] hover:bg-pink-100">
                    Cadastrar-se
                </Button>
            </div>
        </form>
                </div>
            </div>
        </div>
    );
}
