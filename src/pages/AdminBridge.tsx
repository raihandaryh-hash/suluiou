import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

// Admin view — Jembatan Manusia MVP (spec 1-SPEC-dua-pintu-jembatan-manusia.md §3).
// Admin-mediated by design: wa_contact narasumber TIDAK PERNAH dikirim ke siswa dari
// UI manapun selain halaman ini. Pencatatan jam LM tetap manual di luar sistem.

interface BridgeRequestRow {
  id: string;
  user_id: string;
  role_text: string;
  question_text: string;
  province: string | null;
  status: 'pending' | 'matched' | 'done';
  matched_lm_id: string | null;
  created_at: string;
}

interface NarasumberRow {
  id: string;
  nama: string;
  profesi: string;
  provinsi: string | null;
  wa_contact: string;
  aktif: boolean;
  created_at: string;
}

const statusLabel: Record<BridgeRequestRow['status'], string> = {
  pending: 'Menunggu',
  matched: 'Sudah dijodohkan',
  done: 'Selesai',
};

const AdminBridge = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<BridgeRequestRow[]>([]);
  const [narasumber, setNarasumber] = useState<NarasumberRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState('');
  const [profesi, setProfesi] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [waContact, setWaContact] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: reqData, error: reqErr }, { data: nsData, error: nsErr }] = await Promise.all([
      supabase.from('bridge_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('lm_narasumber').select('*').order('created_at', { ascending: false }),
    ]);
    if (reqErr) toast({ title: 'Gagal memuat antrean', description: reqErr.message, variant: 'destructive' });
    if (nsErr) toast({ title: 'Gagal memuat narasumber', description: nsErr.message, variant: 'destructive' });
    setRequests((reqData ?? []) as BridgeRequestRow[]);
    setNarasumber((nsData ?? []) as NarasumberRow[]);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleMatch = async (reqId: string, lmId: string) => {
    const { error } = await supabase
      .from('bridge_requests')
      .update({ status: 'matched', matched_lm_id: lmId })
      .eq('id', reqId);
    if (error) {
      toast({ title: 'Gagal menjodohkan', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Dijodohkan', description: 'Hubungkan siswa dan narasumber lewat WhatsApp.' });
    fetchAll();
  };

  const handleDone = async (reqId: string) => {
    const { error } = await supabase
      .from('bridge_requests')
      .update({ status: 'done' })
      .eq('id', reqId);
    if (error) {
      toast({ title: 'Gagal', description: error.message, variant: 'destructive' });
      return;
    }
    fetchAll();
  };

  const handleAddNarasumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !profesi.trim() || !waContact.trim()) return;
    setCreating(true);
    const { error } = await supabase.from('lm_narasumber').insert({
      nama: nama.trim(),
      profesi: profesi.trim(),
      provinsi: provinsi.trim() || null,
      wa_contact: waContact.trim(),
    });
    setCreating(false);
    if (error) {
      toast({ title: 'Gagal menambah', description: error.message, variant: 'destructive' });
      return;
    }
    setNama('');
    setProfesi('');
    setProvinsi('');
    setWaContact('');
    toast({ title: 'Narasumber ditambahkan' });
    fetchAll();
  };

  const toggleAktif = async (n: NarasumberRow) => {
    const { error } = await supabase
      .from('lm_narasumber')
      .update({ aktif: !n.aktif })
      .eq('id', n.id);
    if (error) {
      toast({ title: 'Gagal', description: error.message, variant: 'destructive' });
      return;
    }
    fetchAll();
  };

  const narasumberById = new Map(narasumber.map((n) => [n.id, n]));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="font-heading font-semibold text-lg">Jembatan Manusia</h1>
          <Button variant="ghost" size="icon" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-10">
        {/* Antrean bridge_requests */}
        <section className="space-y-4">
          <h2 className="font-heading font-semibold text-base">
            Antrean permintaan ({requests.filter((r) => r.status === 'pending').length} menunggu)
          </h2>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada permintaan.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peran/bidang</TableHead>
                  <TableHead>Pertanyaan</TableHead>
                  <TableHead>Provinsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jodohkan ke</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.role_text}</TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground truncate" title={r.question_text}>
                      {r.question_text}
                    </TableCell>
                    <TableCell>{r.province || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'pending' ? 'outline' : 'default'}>
                        {statusLabel[r.status]}
                      </Badge>
                      {r.matched_lm_id && narasumberById.get(r.matched_lm_id) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {narasumberById.get(r.matched_lm_id)?.nama} · {narasumberById.get(r.matched_lm_id)?.wa_contact}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.status !== 'done' && (
                        <Select onValueChange={(lmId) => handleMatch(r.id, lmId)} value={r.matched_lm_id ?? undefined}>
                          <SelectTrigger className="w-44">
                            <SelectValue placeholder="Pilih narasumber" />
                          </SelectTrigger>
                          <SelectContent>
                            {narasumber.filter((n) => n.aktif).map((n) => (
                              <SelectItem key={n.id} value={n.id}>
                                {n.nama} — {n.profesi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.status === 'matched' && (
                        <Button size="sm" variant="outline" onClick={() => handleDone(r.id)}>
                          Tandai selesai
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>

        {/* Registrasi narasumber (mahasiswa IOU LM) — MVP: admin-entered */}
        <section className="space-y-4">
          <h2 className="font-heading font-semibold text-base">Narasumber terdaftar</h2>
          <form onSubmit={handleAddNarasumber} className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-3xl">
            <div className="space-y-1">
              <Label htmlFor="ns-nama">Nama</Label>
              <Input id="ns-nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ns-profesi">Profesi</Label>
              <Input id="ns-profesi" value={profesi} onChange={(e) => setProfesi(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ns-provinsi">Provinsi</Label>
              <Input id="ns-provinsi" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ns-wa">WhatsApp</Label>
              <Input id="ns-wa" value={waContact} onChange={(e) => setWaContact(e.target.value)} required />
            </div>
            <div className="sm:col-span-4">
              <Button type="submit" disabled={creating}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Tambah narasumber
              </Button>
            </div>
          </form>

          {narasumber.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Profesi</TableHead>
                  <TableHead>Provinsi</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Aktif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {narasumber.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>{n.nama}</TableCell>
                    <TableCell>{n.profesi}</TableCell>
                    <TableCell>{n.provinsi || '—'}</TableCell>
                    <TableCell>{n.wa_contact}</TableCell>
                    <TableCell>
                      <Button size="sm" variant={n.aktif ? 'outline' : 'ghost'} onClick={() => toggleAktif(n)}>
                        {n.aktif ? 'Aktif' : 'Nonaktif'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminBridge;
