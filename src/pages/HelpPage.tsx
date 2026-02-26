import JsonGuideModal from "@/components/JsonGuideModal";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const HelpPage = () => {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="min-h-screen pb-28">
      <div className="mx-auto max-w-3xl space-y-8 px-4 pt-8">
        <h1 className="text-2xl font-bold text-foreground">Bantuan</h1>
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Cara Menggunakan Dashboard</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Buka tab <strong>Config</strong> dan masukkan API Key serta Database URL Firebase Anda.</li>
            <li>Tentukan <strong>Path</strong> ke node data IoT Anda (misalnya <code>/iot/monitoring</code>).</li>
            <li>Klik <strong>Connect Database</strong> untuk menghubungkan.</li>
            <li>Dashboard akan otomatis menampilkan perangkat berdasarkan struktur JSON.</li>
            <li>Gunakan <strong>Builder</strong> untuk menambah perangkat baru ke database.</li>
            <li>Gunakan <strong>Simulator</strong> untuk menghasilkan data dummy.</li>
          </ol>
          <button
            onClick={() => setShowGuide(true)}
            className="text-sm font-medium text-accent hover:underline"
          >
            Lihat Panduan Struktur JSON →
          </button>
        </div>
      </div>
      <JsonGuideModal open={showGuide} onOpenChange={setShowGuide} />
      <BottomNav />
    </div>
  );
};

export default HelpPage;
