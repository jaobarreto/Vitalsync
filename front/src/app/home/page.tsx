import Header from "@/components/ui/header";
import { HeartMetricsDashboard } from "@/components/ui/heart-metrics-dashboard";
import { Footer } from "@/components/ui/footer";
export default function Home() {
    return(
        <div>
            <Header />
            <div className="flex flex-col text-center items-center mt-10 mb-32">
                <main>
                    <h1 className="text-2xl font-medium mb-10 text-[#E0004E]">Métricas Cardíacas Durante o Sono</h1>
                    <HeartMetricsDashboard />
                </main>
            </div>
            <Footer />
        </div>
    );
}
