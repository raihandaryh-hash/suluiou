import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  getLeadPriority,
  priorityConfig,
  statusConfig,
  followUpStatuses,
  type FollowUpStatus,
} from '@/lib/leadScoring';
import { traitLabels } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';
import { Save, Eye, MessageCircle } from 'lucide-react';

function normalizeWa(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('62')) return digits;
  return digits;
}

interface LeadResult {
  id: string;
  student_name: string | null;
  student_email: string | null;
  student_phone: string | null;
  school_name: string | null;
  student_class: string | null;
  student_province: string | null;
  province: string | null;
  family_background: string | null;
  aspiration: string | null;
  scores: Record<string, number>;
  top_pathway_id: string;
  top_pathway_name: string;
  match_percentage: number;
  all_matches: Array<{ pathway: { id: string; name: string; icon: string }; matchPercentage: number }>;
  projection: string | null;
  lead_score: number;
  follow_up_status: string;
  notes: string | null;
  submitted_at: string;
  lm_name: string | null;
  lm_id: string | null;
  parent_consent?: boolean | null;
  parent_name?: string | null;
  parent_phone?: string | null;
}

interface LeadDetailDialogProps {
  lead: LeadResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, status: FollowUpStatus, notes: string) => void;
}

export function LeadDetailDialog({ lead, open, onOpenChange, onUpdate }: LeadDetailDialogProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(lead?.follow_up_status || 'new');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [saving, setSaving] = useState(false);

  if (!lead) return null;

  const priority = getLeadPriority(lead.lead_score);
  const config = priorityConfig[priority];

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(lead.id, status as FollowUpStatus, notes);
    setSaving(false);
    onOpenChange(false);
  };

  const topDimensions = Object.entries(lead.scores || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Detail Lead: {lead.student_name || 'Anonim'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Priority & Score */}
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1.5 rounded-full border text-sm font-medium ${config.bgColor}`}>
              {config.label} — Skor {lead.lead_score}
            </div>
            <div className="text-sm text-muted-foreground">
              Match: <span className="text-primary font-semibold">{lead.match_percentage}%</span> — {lead.top_pathway_name}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm text-foreground">{lead.student_email || '—'}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Telepon</Label>
              <p className="text-sm text-foreground">{lead.student_phone || '—'}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Sekolah</Label>
              <p className="text-sm text-foreground">{lead.school_name || '—'}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tanggal</Label>
              <p className="text-sm text-foreground">
                {new Date(lead.submitted_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground">Learning Mentor</Label>
              <p className="text-sm text-foreground">{lead.lm_name || '—'}</p>
            </div>
          </div>

          {/* Profil Awal Siswa */}
          <div className="border-t border-border pt-4">
            <Label className="text-xs text-muted-foreground mb-3 block font-semibold uppercase tracking-wider">
              Profil Awal Siswa
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Kelas</Label>
                <p className="text-sm text-foreground">{lead.student_class || '—'}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Provinsi</Label>
                <p className="text-sm text-foreground">{lead.student_province || lead.province || '—'}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Latar Belakang Keluarga</Label>
                <p className="text-sm text-foreground">{lead.family_background || '—'}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Aspirasi</Label>
                <p className="text-sm text-foreground italic">{lead.aspiration || '—'}</p>
              </div>
            </div>
          </div>

          {/* Data Orang Tua */}
          <div className="border-t border-border pt-4">
            <Label className="text-xs text-muted-foreground mb-3 block font-semibold uppercase tracking-wider">
              Data Orang Tua
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Consent</Label>
                <p className="text-sm text-foreground">
                  {lead.parent_consent ? (
                    <span className="text-green-500 font-medium">✓ Diberikan</span>
                  ) : (
                    <span className="text-muted-foreground">Belum diberikan</span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Nama Orang Tua</Label>
                <p className="text-sm text-foreground">{lead.parent_name || '—'}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">No. WhatsApp Orang Tua</Label>
                <p className="text-sm text-foreground flex items-center gap-2">
                  <span>{lead.parent_phone || '—'}</span>
                  {(() => {
                    const wa = normalizeWa(lead.parent_phone);
                    return wa ? (
                      <a
                        href={`https://wa.me/${wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[hsl(142,70%,40%)] hover:underline"
                      >
                        <MessageCircle className="w-3 h-3" /> Chat
                      </a>
                    ) : null;
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Top dimensions */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Top 5 Dimensi</Label>
            <div className="flex flex-wrap gap-2">
              {topDimensions.map(([dim, val]) => (
                <span
                  key={dim}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {traitLabels[dim as Dimension] || dim}: {(val as number).toFixed(1)}
                </span>
              ))}
            </div>
          </div>

          {/* All matches */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Semua Pathway Match</Label>
            <div className="space-y-1">
              {(lead.all_matches || []).map((m) => (
                <div key={m.pathway.id} className="flex items-center gap-2 text-sm">
                  <span>{m.pathway.icon}</span>
                  <span className="text-foreground">{m.pathway.name}</span>
                  <span className="text-muted-foreground ml-auto">{m.matchPercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projection */}
          {lead.projection && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Proyeksi 2030</Label>
              <p className="text-sm text-foreground/80 italic bg-muted/30 p-3 rounded-lg">
                &ldquo;{lead.projection}&rdquo;
              </p>
            </div>
          )}

          {/* Admin actions */}
          <div className="border-t border-border pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Status Follow-up</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {followUpStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusConfig[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catatan Admin</Label>
              <Textarea
                placeholder="Tambahkan catatan tentang lead ini..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-input border-border min-h-[80px]"
              />
            </div>

            {(() => {
              const wa = normalizeWa(lead.student_phone);
              return wa ? (
                <Button
                  asChild
                  variant="outline"
                  className="w-full gap-2 border-[hsl(142,70%,40%)]/40 text-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,40%)]/10"
                >
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" />
                    Hubungi via WA ({lead.student_phone})
                  </a>
                </Button>
              ) : null;
            })()}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/admin/results/${lead.id}`);
                }}
              >
                <Eye className="w-4 h-4" />
                Lihat POV Peserta
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
