import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, CheckCircle } from 'lucide-react';

interface StudentInfo {
  name: string;
  email: string;
  phone: string;
  school: string;
}

interface StudentInfoFormProps {
  onSubmit: (info: StudentInfo) => Promise<void>;
  saved: boolean;
}

export function StudentInfoForm({ onSubmit, saved }: StudentInfoFormProps) {
  const [info, setInfo] = useState<StudentInfo>({ name: '', email: '', phone: '', school: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(info);
    setSubmitting(false);
  };

  if (saved) {
    return (
      <div className="glass rounded-2xl p-6 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <p className="text-foreground text-sm">
          Data kamu sudah tersimpan. Tim IOU akan menghubungimu!
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <h3 className="text-lg font-heading font-semibold mb-1">
        Simpan Hasilmu
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Isi data berikut agar tim IOU bisa menghubungimu untuk konsultasi gratis.
      </p>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="sname" className="text-xs">Nama Lengkap</Label>
          <Input
            id="sname"
            placeholder="Nama kamu"
            value={info.name}
            onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
            className="bg-input border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="semail" className="text-xs">Email</Label>
          <Input
            id="semail"
            type="email"
            placeholder="email@example.com"
            value={info.email}
            onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
            className="bg-input border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sphone" className="text-xs">No. WhatsApp</Label>
          <Input
            id="sphone"
            placeholder="08xxxxxxxxxx"
            value={info.phone}
            onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))}
            className="bg-input border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sschool" className="text-xs">Asal Sekolah</Label>
          <Input
            id="sschool"
            placeholder="SMA/SMK/MA"
            value={info.school}
            onChange={(e) => setInfo((p) => ({ ...p, school: e.target.value }))}
            className="bg-input border-border"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting} className="w-full gap-2">
            <Save className="w-4 h-4" />
            {submitting ? 'Menyimpan...' : 'Simpan & Dapatkan Konsultasi Gratis'}
          </Button>
        </div>
      </form>
    </div>
  );
}
