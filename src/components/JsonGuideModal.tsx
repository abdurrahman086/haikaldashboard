import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JsonGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const codeBlocks = [
  {
    title: '1. Switch Digital (0 atau 1)',
    code: `"lampu_teras": {\n  "type": "switch",\n  "value": 1\n}`,
  },
  {
    title: '2. Dimmer Analog (Slider)',
    code: `"kipas_angin": {\n  "type": "dimmer",\n  "value": 512,\n  "upper_limit": 1024,\n  "unit": "RPM"\n}`,
  },
  {
    title: '3. Sensor Telemetri (Grafik)',
    code: `"suhu_ruang": {\n  "type": "sensor",\n  "value": 28.5,\n  "upper_limit": 100,\n  "unit": "°C"\n}`,
  },
];

const JsonGuideModal = ({ open, onOpenChange }: JsonGuideModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg border-2 border-accent">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          📋 Panduan Struktur JSON
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Agar data Anda terbaca oleh web ini, format JSON di bawah node utama
          Anda harus seperti ini:
        </p>
        {codeBlocks.map((block) => (
          <div key={block.title}>
            <h4 className="mb-2 text-sm font-semibold text-foreground">{block.title}</h4>
            <pre className="overflow-x-auto rounded-lg bg-terminal p-3 font-mono text-xs text-terminal-foreground">
              {block.code}
            </pre>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default JsonGuideModal;
