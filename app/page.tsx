import Header from "@/components/Header";
import Countdown from "@/components/Countdown";
import PrayerDashboard from "@/components/PrayerDashboard";



export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <div className="mx-auto min-h-screen max-w-[1440px] overflow-hidden bg-white shadow-sm">
        <Header />
        <PrayerDashboard/>
        
      </div>
    </main>
  );
}
