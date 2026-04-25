import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getLeadPriority,
  priorityConfig,
  statusConfig,
  followUpStatuses,
  type FollowUpStatus,
} from '@/lib/leadScoring';
import { LeadDetailDialog } from './LeadDetailDialog';
import { Eye, Search, SlidersHorizontal, MessageCircle } from 'lucide-react';

function normalizeWa(phone: string | null): string | null {
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
}

interface LeadsTableProps {
  leads: LeadResult[];
  onUpdate: (id: string, status: FollowUpStatus, notes: string) => void;
}

export function LeadsTable({ leads, onUpdate }: LeadsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = leads.filter((lead) => {
    const matchSearch =
      !search ||
      (lead.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.student_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.school_name || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || lead.follow_up_status === statusFilter;

    const matchPriority =
      priorityFilter === 'all' || getLeadPriority(lead.lead_score) === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, sekolah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-input border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-input border-border">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {followUpStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusConfig[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px] bg-input border-border">
              <SelectValue placeholder="Prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="hot">🔥 Hot</SelectItem>
              <SelectItem value="warm">🌤️ Warm</SelectItem>
              <SelectItem value="cold">❄️ Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Prioritas</TableHead>
              <TableHead className="text-muted-foreground">Nama</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Sekolah</TableHead>
              <TableHead className="text-muted-foreground">Program Pilihan</TableHead>
              <TableHead className="text-muted-foreground text-center">Skor</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {leads.length === 0 ? 'Belum ada data assessment.' : 'Tidak ada hasil yang cocok.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => {
                const priority = getLeadPriority(lead.lead_score);
                const pConfig = priorityConfig[priority];
                const sConfig = statusConfig[lead.follow_up_status as FollowUpStatus] || statusConfig.new;

                return (
                  <TableRow key={lead.id} className="border-border">
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full border ${pConfig.bgColor}`}>
                        {pConfig.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {lead.student_name || 'Anonim'}
                        </p>
                        <p className="text-xs text-muted-foreground">{lead.student_email || '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {lead.school_name || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {lead.top_pathway_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-foreground">{lead.lead_score}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${sConfig.color}`}>
                        {sConfig.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLead(lead);
                            setDialogOpen(true);
                          }}
                          title="Lihat detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(() => {
                          const wa = normalizeWa(lead.student_phone);
                          return wa ? (
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              title="Hubungi via WhatsApp"
                            >
                              <a
                                href={`https://wa.me/${wa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MessageCircle className="w-4 h-4 text-[hsl(142,70%,40%)]" />
                              </a>
                            </Button>
                          ) : null;
                        })()}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground text-right">
        Menampilkan {filtered.length} dari {leads.length} leads
      </div>

      <LeadDetailDialog
        lead={selectedLead}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={onUpdate}
      />
    </div>
  );
}
