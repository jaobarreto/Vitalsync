import Header from "@/components/ui/header";
import { Component } from "@/components/ui/chartLineDots";

export default function Home() {
    return(
        <div className="min-h-screen">
            <Header />
            <div className="flex flex-col text-center justify-center items-center mt-10">
                <h1 className="text-2xl text-[#E0004E] font-medium">Dashboard</h1>
                <div className="flex min-h-12 max-w-1/2 flex-col items-center justify-center mt-5">
                    <Component />
                </div>
            </div>
        </div>
    );
}