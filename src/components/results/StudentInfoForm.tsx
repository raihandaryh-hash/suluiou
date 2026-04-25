import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { PROVINCES } from '@/lib/constants';

export interface StudentInfo {
  name: string;
  email: string;
  phone: string;
  school: string;
  student_class: string;
  province: string;
  email_requested: boolean;
}

interface StudentInfoFormProps {
  onSubmit: (info: StudentInfo) => Promise<void>;
  saved: boolean;
  defaultProvince?: string;
  provinceUsed?: { value: string; source: 'form' | 'profile' | 'none' } | null;
}

export function StudentInfoForm({ onSubmit, saved, defaultProvince, provinceUsed }: StudentInfoFormProps) {
  const [info, setInfo] = useState<StudentInfo>({
    name: '',
    email: '',
    phone: '',
    school: '',
    student_class: '',
    province: defaultProvince ?? '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(info);
    setSubmitting(false);
  };

  if (saved) {
    const sourceLabel =
      provinceUsed?.source === 'form'
        ? 'diisi dari form'
        : provinceUsed?.source === 'profile'
        ? 'diambil dari Profil Awal'
        : null;
    return (
      <div className="glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-foreground text-sm">
            Data kamu sudah tersimpan. Tim IOU akan menghubungimu!
          </p>
        </div>
        {provinceUsed && provinceUsed.value && (
          <p className="text-xs text-muted-foreground pl-8">
            Provinsi tersimpan: <span className="text-foreground font-medium">{provinceUsed.value}</span>
            {sourceLabel && <span className="text-muted-foreground"> · {sourceLabel}</span>}
          </p>
        )}
        {provinceUsed && !provinceUsed.value && (
          <p className="text-xs text-amber-400 pl-8">
            Provinsi tidak terisi — tim IOU akan menanyakan saat menghubungi.
          </p>
        )}
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
          <Label htmlFor="sclass" className="text-xs">Kelas</Label>
          <Select
            value={info.student_class}
            onValueChange={(v) => setInfo((p) => ({ ...p, student_class: v }))}
          >
            <SelectTrigger id="sclass" className="bg-input border-border">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kelas 10">Kelas 10</SelectItem>
              <SelectItem value="Kelas 11">Kelas 11</SelectItem>
              <SelectItem value="Kelas 12">Kelas 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sprovince" className="text-xs">Provinsi</Label>
          <Select
            value={info.province}
            onValueChange={(v) => setInfo((p) => ({ ...p, province: v }))}
          >
            <SelectTrigger id="sprovince" className="bg-input border-border">
              <SelectValue placeholder="Pilih provinsi" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {PROVINCES.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            {submitting ? 'Menyimpan...' : 'Simpan & Hubungi Tim IOU'}
          </Button>
        </div>
      </form>
    </div>
  );
}
