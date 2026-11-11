// Tonggak 2a C.4: pengganti form nomor WA untuk anak dan tamu. Tidak menyimpan apa pun; membuka WhatsApp resmi IOU.
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KANAL_PENERIMAAN, TEKS_TARIK, VARIAN_AKTIF } from '@/data/izinKuliahContent';
import { TEKS_PINTU } from '@/data/pintuMasukContent';
import { tautanTarik } from '@/lib/izinKuliah';

export default function DaftarTungguTarik() {
  return (
    <div className="bg-secondary/60 border border-border rounded-2xl p-6 space-y-3">
      <p className="text-sm text-foreground">{TEKS_PINTU[VARIAN_AKTIF].daftarTungguAnak}</p>
      <div className="flex flex-wrap gap-3">
        {KANAL_PENERIMAAN.map((k) => (
          <Button key={k.nomorWa} asChild variant="outline">
            <a href={tautanTarik(k.nomorWa, [])} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              {TEKS_TARIK[VARIAN_AKTIF].tombol} · {k.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
