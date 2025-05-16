import Header from "@/components/ui/header";
import { HeartMetricsDashboard } from "@/components/ui/heart-metrics-dashboard";

export default function Home() {
    return(
        <div>
            <Header />
            <div className="flex flex-col text-center items-center mt-10">
                <main>
                    <h1 className="text-2xl font-medium mb-5 text-[#E0004E]">Métricas Cardíacas Durante o Sono</h1>
                    <HeartMetricsDashboard />
                </main>
            </div>
        </div>
    );
}
