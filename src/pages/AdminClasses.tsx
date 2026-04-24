import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Copy,
  Download,
  Eye,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Unlock,
} from 'lucide-react';

interface ClassRow {
  id: string;
  name: string;
  school_name: string | null;
  join_code: string;
  session_closed: boolean;
  session_closed_at: string | null;
  created_at: string;
  enrolled_count: number;
  completed_count: number;
}

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I/L/O/0/1

function genCode() {
  let s = '';
  for (let i = 0; i < 4; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}

const AdminClasses = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data: classes, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const ids = (classes ?? []).map((c) => c.id);
    let enrollments: { class_id: string }[] = [];
    let completions: { class_id: string }[] = [];

    if (ids.length) {
      const [{ data: enr }, { data: comp }] = await Promise.all([
        supabase.from('class_enrollments').select('class_id').in('class_id', ids),
        supabase
          .from('assessment_results')
          .select('class_id')
          .in('class_id', ids),
      ]);
      enrollments = (enr ?? []) as { class_id: string }[];
      completions = (comp ?? []) as { class_id: string }[];
    }

    const enrollMap = new Map<string, number>();
    enrollments.forEach((e) =>
      enrollMap.set(e.class_id, (enrollMap.get(e.class_id) ?? 0) + 1)
    );
    const compMap = new Map<string, number>();
    completions.forEach((c) =>
      compMap.set(c.class_id, (compMap.get(c.class_id) ?? 0) + 1)
    );

    setRows(
      (classes ?? []).map((c) => ({
        ...c,
        enrolled_count: enrollMap.get(c.id) ?? 0,
        completed_count: compMap.get(c.id) ?? 0,
      })) as ClassRow[]
    );
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);

    let attempts = 0;
    let code = genCode();
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('classes')
        .select('id')
        .eq('join_code', code)
        .maybeSingle();
      if (!existing) break;
      code = genCode();
      attempts++;
    }

    const { error } = await supabase.from('classes').insert({
      name: name.trim(),
      school_name: schoolName.trim() || null,
      join_code: code,
    });

    if (error) {
      toast({ title: 'Gagal', description: error.message, variant: 'destructive' });
      setCreating(false);
      return;
    }

    setGeneratedCode(code);
    setCreating(false);
    setName('');
    setSchoolName('');
    fetchRows();
  };

  const toggleClosed = async (cls: ClassRow) => {
    const next = !cls.session_closed;
    const { error } = await supabase
      .from('classes')
      .update({
        session_closed: next,
        session_closed_at: next ? new Date().toISOString() : null,
      })
      .eq('id', cls.id);
    if (error) {
      toast({ title: 'Gagal', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: next ? 'Sesi ditutup' : 'Sesi dibuka',
      description: cls.name,
    });
    fetchRows();
  };

  const downloadCsv = async (cls: ClassRow) => {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('class_id', cls.id);
    if (error || !data) {
      toast({ title: 'Gagal export', description: error?.message ?? '', variant: 'destructive' });
      return;
    }
    if (!data.length) {
      toast({ title: 'Belum ada hasil', description: 'Kelas ini belum punya submission.' });
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    data.forEach((row) => {
      csvRows.push(
        headers
          .map((h) => {
            const v = (row as Record<string, unknown>)[h];
            if (v == null) return '';
            const s = typeof v === 'string' ? v : JSON.stringify(v);
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(',')
      );
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kelas-${cls.join_code}-${cls.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Disalin', description: `Kode ${code} ada di clipboard.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Lead Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchRows} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Buat Kelas
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {generatedCode ? 'Kelas Berhasil Dibuat' : 'Buat Kelas Baru'}
                  </DialogTitle>
                  {!generatedCode && (
                    <DialogDescription>
                      Kode 4 karakter dibuat otomatis. Bagikan ke siswa untuk gabung.
                    </DialogDescription>
                  )}
                </DialogHeader>

                {generatedCode ? (
                  <div className="space-y-4">
                    <div className="text-center py-6 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Kode kelas:
                      </p>
                      <p className="text-5xl font-heading font-bold tracking-widest text-primary">
                        {generatedCode}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => copyCode(generatedCode)}
                    >
                      <Copy className="w-4 h-4" /> Salin Kode
                    </Button>
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={() => {
                          setGeneratedCode(null);
                          setCreateOpen(false);
                        }}
                      >
                        Selesai
                      </Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cls-name">Nama Kelas</Label>
                      <Input
                        id="cls-name"
                        placeholder="XII IPA 1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cls-school">Nama Sekolah (opsional)</Label>
                      <Input
                        id="cls-school"
                        placeholder="SMA Negeri 1 Jakarta"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={creating} className="gap-2">
                        {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Buat Kelas
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Manajemen Kelas
          </h1>
          <p className="text-muted-foreground mt-1">
            Buat kelas, bagikan kode, lalu lihat hasil agregat sesi.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Sekolah</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Daftar / Selesai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Belum ada kelas. Klik "Buat Kelas" untuk mulai.
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                rows.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {cls.school_name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="font-mono font-bold text-primary tracking-widest hover:underline"
                        onClick={() => copyCode(cls.join_code)}
                      >
                        {cls.join_code}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{cls.enrolled_count}</span>
                      <span className="text-muted-foreground"> / </span>
                      <span className="font-medium">{cls.completed_count}</span>
                    </TableCell>
                    <TableCell>
                      {cls.session_closed ? (
                        <Badge variant="secondary">Ditutup</Badge>
                      ) : (
                        <Badge className="bg-accent text-accent-foreground">Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/class/${cls.id}/session`}>
                          <Button variant="ghost" size="icon" title="Lihat Sesi">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download CSV"
                          onClick={() => downloadCsv(cls)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title={cls.session_closed ? 'Buka kembali' : 'Tutup sesi'}
                            >
                              {cls.session_closed ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {cls.session_closed
                                  ? `Buka kembali kelas ${cls.name}?`
                                  : `Tutup sesi kelas ${cls.name}?`}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {cls.session_closed
                                  ? 'Siswa baru bisa kembali bergabung dengan kode ini.'
                                  : 'Siswa baru tidak bisa join lagi. Yang sudah join tetap bisa menyelesaikan asesmen.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => toggleClosed(cls)}>
                                {cls.session_closed ? 'Buka Kembali' : 'Tutup Sesi'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminClasses;
