// Tonggak 2a A.9 · admin menangani permintaan "Salah pilih? Minta dibuka". Hanya pengenal akun dan email, tanpa kontak lain.
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { bukaKunciOlehAdmin } from '@/lib/peran';

interface Baris { id: string; user_id: string; dibuat_pada: string }

export default function PermintaanBukaKunci() {
  const { toast } = useToast();
  const [baris, setBaris] = useState<Baris[]>([]);
  const muat = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).from('sulu_permintaan_buka_kunci').select('id, user_id, dibuat_pada').is('ditangani_pada', null).order('dibuat_pada');
    setBaris((data as Baris[]) ?? []);
  }, []);
  useEffect(() => { void muat(); }, [muat]);
  if (baris.length === 0) return null;
  const buka = async (b: Baris) => {
    if (!window.confirm('Buka kunci umur akun ini? Pemiliknya akan memilih peran dan umur lagi.')) return;
    const r = await bukaKunciOlehAdmin(b.user_id);
    if (r.galat) toast({ title: 'Belum berhasil', description: r.galat, variant: 'destructive' });
    void muat();
  };
  return (
    <section className="rounded-xl border border-border bg-card p-6 mb-6 space-y-3">
      <h2 className="text-lg font-heading font-bold">Permintaan buka kunci umur ({baris.length})</h2>
      {baris.map((b) => (
        <div key={b.id} className="flex items-center justify-between text-sm border-t border-border pt-2">
          <span className="font-mono text-xs">{b.user_id.slice(0, 8)}… · {new Date(b.dibuat_pada).toLocaleString('id-ID')}</span>
          <Button size="sm" variant="outline" onClick={() => buka(b)}>Buka kunci</Button>
        </div>
      ))}
    </section>
  );
}
