import { useState } from 'react';
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
import { Save } from 'lucide-react';

interface LeadResult {
  id: string;
  student_name: string | null;
  student_email: string | null;
  student_phone: string | null;
  school_name: string | null;
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
}

interface LeadDetailDialogProps {
  lead: LeadResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, status: FollowUpStatus, notes: string) => void;
}

export function LeadDetailDialog({ lead, open, onOpenChange, onUpdate }: LeadDetailDialogProps) {
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

            <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
