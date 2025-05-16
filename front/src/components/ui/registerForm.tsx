"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //fazer a lógica do cadastro conversando com a API
        router.push("/home");
        console.log(form);
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-2">
            <div>
                <Label htmlFor="name" className="mb-2">Nome Completo:</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border-2"
                />
            </div>
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
            <div>
                <Label htmlFor="confirmPassword" className="mb-2">Repetir senha:</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="border-2"
                />
            </div>
            <div className="flex items-center justify-center pt-4">
                <Button type="submit" className="bg-white text-[#E0004E] hover:bg-pink-100">
                    Cadastrar-se
                </Button>
            </div>
        </form>
    );
}
