import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  defaultInsightContent,
  neetBarColorOptions,
  toneOptions,
  type InsightContent,
  type StatCardContent,
  type NeetRow,
  type OpportunityItem,
  type Tone,
} from '@/data/insightContent';
import { fetchInsightContent, saveInsightContent } from '@/lib/insightContentStore';

type SetFn = (updater: (prev: InsightContent) => InsightContent) => void;

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <section className="border border-border rounded-2xl bg-card p-6 space-y-4">
    <header>
      <h2 className="font-heading font-semibold text-lg text-foreground">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </header>
    <div className="space-y-4">{children}</div>
  </section>
);

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-foreground">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

// ---------- Stat-card array editor ----------
function StatCardEditor({
  cards,
  onChange,
}: {
  cards: StatCardContent[];
  onChange: (next: StatCardContent[]) => void;
}) {
  const update = (i: number, patch: Partial<StatCardContent>) => {
    onChange(cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  };
  const remove = (i: number) => onChange(cards.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...cards,
      { value: '', label: '', detail: '', source: '', tone: 'neutral' },
    ]);

  return (
    <div className="space-y-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="border border-border rounded-xl p-4 bg-secondary/30 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              KARTU #{i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Angka utama" hint="cth: 19,44%">
              <Input
                value={c.value}
                onChange={(e) => update(i, { value: e.target.value })}
              />
            </Field>
            <Field label="Tone warna">
              <Select
                value={c.tone ?? 'neutral'}
                onValueChange={(v) => update(i, { tone: v as Tone })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sumber" hint="cth: BPS Sakernas 2025">
              <Input
                value={c.source}
                onChange={(e) => update(i, { source: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Label di bawah angka">
            <Input
              value={c.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
          </Field>
          <Field label="Detail (muncul saat kartu di-expand)">
            <Textarea
              rows={4}
              value={c.detail}
              onChange={(e) => update(i, { detail: e.target.value })}
            />
          </Field>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Tambah kartu
      </Button>
    </div>
  );
}

// ---------- NEET row editor ----------
function NeetEditor({
  rows,
  onChange,
}: {
  rows: NeetRow[];
  onChange: (next: NeetRow[]) => void;
}) {
  const update = (i: number, patch: Partial<NeetRow>) => {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([...rows, { country: '', value: 0, color: 'bg-primary' }]);

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div
          key={i}
          className="border border-border rounded-xl p-3 bg-secondary/30 grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
        >
          <div className="md:col-span-4">
            <Field label="Negara">
              <Input
                value={r.country}
                onChange={(e) => update(i, { country: e.target.value })}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Nilai (%)">
              <Input
                type="number"
                step="0.01"
                value={r.value}
                onChange={(e) =>
                  update(i, { value: Number(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
          <div className="md:col-span-5">
            <Field label="Warna bar">
              <Select
                value={r.color}
                onValueChange={(v) => update(i, { color: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {neetBarColorOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="md:col-span-1 flex md:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Tambah baris
      </Button>
    </div>
  );
}

// ---------- Opportunities editor ----------
function OpportunitiesEditor({
  items,
  onChange,
}: {
  items: OpportunityItem[];
  onChange: (next: OpportunityItem[]) => void;
}) {
  const update = (i: number, patch: Partial<OpportunityItem>) => {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { title: '', body: '' }]);

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="border border-border rounded-xl p-4 bg-secondary/30 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              PELUANG #{i + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
            </Button>
          </div>
          <Field label="Judul">
            <Input
              value={it.title}
              onChange={(e) => update(i, { title: e.target.value })}
            />
          </Field>
          <Field label="Deskripsi">
            <Textarea
              rows={3}
              value={it.body}
              onChange={(e) => update(i, { body: e.target.value })}
            />
          </Field>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Tambah peluang
      </Button>
    </div>
  );
}

// ---------- Page ----------
const AdminInsight = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [content, setContent] = useState<InsightContent>(defaultInsightContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInsightContent().then((c) => {
      setContent(c);
      setLoading(false);
    });
  }, []);

  const set: SetFn = (updater) => setContent((prev) => updater(prev));

  const handleSave = async () => {
    setSaving(true);
    const { error } = await saveInsightContent(content, user?.id ?? null);
    setSaving(false);
    if (error) {
      toast({
        title: 'Gagal menyimpan',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Tersimpan',
      description: 'Konten halaman /insight sudah diperbarui.',
    });
  };

  const handleReset = () => {
    if (
      confirm(
        'Reset semua field ke konten default? Perubahan yang belum disimpan akan hilang.'
      )
    ) {
      setContent(defaultInsightContent);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Memuat konten…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Button>
            <div>
              <h1 className="font-heading font-semibold text-base text-foreground">
                Edit Halaman Insight
              </h1>
              <p className="text-xs text-muted-foreground">
                Perubahan langsung tampil di /insight setelah disimpan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/insight" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Preview
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset default
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        {/* META */}
        <Section
          title="Pengaturan umum"
          description="Konfigurasi countdown dan skala grafik."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Tanggal target countdown (ISO)"
              hint="cth: 2030-01-01"
            >
              <Input
                value={content.meta.countdownTargetIso}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    meta: { ...p.meta, countdownTargetIso: e.target.value },
                  }))
                }
              />
            </Field>
            <Field
              label="Skala maksimum bar chart NEET (%)"
              hint="Bar 100% = nilai ini. Default 25."
            >
              <Input
                type="number"
                value={content.meta.neetChartMaxPercent}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    meta: {
                      ...p.meta,
                      neetChartMaxPercent: Number(e.target.value) || 25,
                    },
                  }))
                }
              />
            </Field>
          </div>
        </Section>

        {/* HERO */}
        <Section title="Section 1 — Hero">
          <Field label="Judul baris 1">
            <Input
              value={content.hero.titleLine1}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  hero: { ...p.hero, titleLine1: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Judul baris 2 (warna muted)">
            <Input
              value={content.hero.titleLine2}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  hero: { ...p.hero, titleLine2: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Subtitle">
            <Textarea
              rows={2}
              value={content.hero.subtitle}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  hero: { ...p.hero, subtitle: e.target.value },
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Suffix countdown 'tahun'">
              <Input
                value={content.hero.countdown.yearsSuffix}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    hero: {
                      ...p.hero,
                      countdown: {
                        ...p.hero.countdown,
                        yearsSuffix: e.target.value,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Suffix countdown 'bulan'">
              <Input
                value={content.hero.countdown.monthsSuffix}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    hero: {
                      ...p.hero,
                      countdown: {
                        ...p.hero.countdown,
                        monthsSuffix: e.target.value,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Angka demografi" hint="cth: 208 juta">
              <Input
                value={content.hero.countdown.demographic.value}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    hero: {
                      ...p.hero,
                      countdown: {
                        ...p.hero.countdown,
                        demographic: {
                          ...p.hero.countdown.demographic,
                          value: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Label demografi">
              <Input
                value={content.hero.countdown.demographic.label}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    hero: {
                      ...p.hero,
                      countdown: {
                        ...p.hero.countdown,
                        demographic: {
                          ...p.hero.countdown.demographic,
                          label: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Label tombol CTA">
              <Input
                value={content.hero.cta.label}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    hero: { ...p.hero, cta: { ...p.hero.cta, label: e.target.value } },
                  }))
                }
              />
            </Field>
            <Field label="Link tombol CTA" hint="cth: /assessment atau /">
              <Input
                value={content.hero.cta.href}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    hero: { ...p.hero, cta: { ...p.hero.cta, href: e.target.value } },
                  }))
                }
              />
            </Field>
          </div>
        </Section>

        {/* INDONESIA */}
        <Section
          title="Section 2 — Indonesia hari ini"
          description="Kartu statistik kondisi Indonesia."
        >
          <Field label="Eyebrow (label kecil di atas grid)">
            <Input
              value={content.indonesiaSection.eyebrow}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  indonesiaSection: {
                    ...p.indonesiaSection,
                    eyebrow: e.target.value,
                  },
                }))
              }
            />
          </Field>
          <StatCardEditor
            cards={content.indonesiaSection.cards}
            onChange={(next) =>
              set((p) => ({
                ...p,
                indonesiaSection: { ...p.indonesiaSection, cards: next },
              }))
            }
          />
        </Section>

        {/* NEET CHART */}
        <Section
          title="Section 3 — Bar chart NEET ASEAN"
          description="Perbandingan NEET antar negara."
        >
          <Field label="Eyebrow">
            <Input
              value={content.neetSection.eyebrow}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  neetSection: { ...p.neetSection, eyebrow: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Caption sumber (di bawah chart)">
            <Input
              value={content.neetSection.source}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  neetSection: { ...p.neetSection, source: e.target.value },
                }))
              }
            />
          </Field>
          <NeetEditor
            rows={content.neetSection.rows}
            onChange={(next) =>
              set((p) => ({
                ...p,
                neetSection: { ...p.neetSection, rows: next },
              }))
            }
          />
        </Section>

        {/* WORLD */}
        <Section
          title="Section 4 — Dunia 2025–2030"
          description="Kartu statistik tren global."
        >
          <Field label="Eyebrow">
            <Input
              value={content.worldSection.eyebrow}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  worldSection: { ...p.worldSection, eyebrow: e.target.value },
                }))
              }
            />
          </Field>
          <StatCardEditor
            cards={content.worldSection.cards}
            onChange={(next) =>
              set((p) => ({
                ...p,
                worldSection: { ...p.worldSection, cards: next },
              }))
            }
          />
        </Section>

        {/* OPPORTUNITIES */}
        <Section
          title="Section 5 — Peluang yang belum diisi"
          description="Kartu sektor dengan shortage SDM."
        >
          <Field label="Eyebrow">
            <Input
              value={content.opportunitiesSection.eyebrow}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  opportunitiesSection: {
                    ...p.opportunitiesSection,
                    eyebrow: e.target.value,
                  },
                }))
              }
            />
          </Field>
          <OpportunitiesEditor
            items={content.opportunitiesSection.items}
            onChange={(next) =>
              set((p) => ({
                ...p,
                opportunitiesSection: {
                  ...p.opportunitiesSection,
                  items: next,
                },
              }))
            }
          />
        </Section>

        {/* CTA */}
        <Section title="Section 6 — CTA penutup">
          <Field label="Judul baris 1">
            <Input
              value={content.ctaSection.titleLine1}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  ctaSection: { ...p.ctaSection, titleLine1: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Judul baris 2 (warna primary)">
            <Input
              value={content.ctaSection.titleLine2}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  ctaSection: { ...p.ctaSection, titleLine2: e.target.value },
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Label tombol utama">
              <Input
                value={content.ctaSection.primaryCta.label}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    ctaSection: {
                      ...p.ctaSection,
                      primaryCta: {
                        ...p.ctaSection.primaryCta,
                        label: e.target.value,
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Link tombol utama">
              <Input
                value={content.ctaSection.primaryCta.href}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    ctaSection: {
                      ...p.ctaSection,
                      primaryCta: {
                        ...p.ctaSection.primaryCta,
                        href: e.target.value,
                      },
                    },
                  }))
                }
              />
            </Field>
          </div>
          <Field
            label="Teks footer (gunakan Enter untuk pisah baris)"
          >
            <Textarea
              rows={3}
              value={content.ctaSection.footer.body}
              onChange={(e) =>
                set((p) => ({
                  ...p,
                  ctaSection: {
                    ...p.ctaSection,
                    footer: { ...p.ctaSection.footer, body: e.target.value },
                  },
                }))
              }
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Label tombol footer">
              <Input
                value={content.ctaSection.footer.cta.label}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    ctaSection: {
                      ...p.ctaSection,
                      footer: {
                        ...p.ctaSection.footer,
                        cta: {
                          ...p.ctaSection.footer.cta,
                          label: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
            </Field>
            <Field label="Link tombol footer">
              <Input
                value={content.ctaSection.footer.cta.href}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    ctaSection: {
                      ...p.ctaSection,
                      footer: {
                        ...p.ctaSection.footer,
                        cta: {
                          ...p.ctaSection.footer.cta,
                          href: e.target.value,
                        },
                      },
                    },
                  }))
                }
              />
            </Field>
          </div>
        </Section>

        {/* NAV + LABELS */}
        <Section title="Navigasi & label">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Label tombol kembali (header)">
              <Input
                value={content.nav.backLabel}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    nav: { ...p.nav, backLabel: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Link tombol kembali">
              <Input
                value={content.nav.backHref}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    nav: { ...p.nav, backHref: e.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Prefix sumber" hint="cth: Sumber:">
              <Input
                value={content.labels.sourcePrefix}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    labels: { ...p.labels, sourcePrefix: e.target.value },
                  }))
                }
              />
            </Field>
          </div>
        </Section>

        {/* Bottom save bar */}
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset default
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan…' : 'Simpan perubahan'}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AdminInsight;
