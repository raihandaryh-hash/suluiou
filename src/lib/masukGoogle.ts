// Ajakan "Masuk dengan Google" dari tengah perjalanan (mis. Jalan Bakti saat fitur AI menjawab 401).
// Tamu kelas diberi klaim supaya halaman Login tidak menawarkan "Lanjutkan sebagai tamu" lagi,
// lalu sesudah masuk siswa dikembalikan ke halaman asal lewat sulu.returnTo.
import { lovable } from "@/integrations/lovable";
import { getStudentSession } from "@/lib/classSession";
import { clearPendingClaim, setPendingClaim } from "@/lib/claimGuestResult";

export async function masukDenganGoogle(kembaliKe: string): Promise<{ error?: Error | null }> {
  try { sessionStorage.setItem("sulu.returnTo", kembaliKe); } catch { /* abaikan */ }
  const s = getStudentSession();
  if (s?.kind === "guest") {
    setPendingClaim({
      resultId: null,
      guestIdentifier: s.guestIdentifier,
      studentName: s.name,
      classId: s.classId,
      className: s.className,
      asal: "jalan-bakti",
    });
  }
  const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" });
  const error = (r as { error?: Error | null }).error ?? null;
  if (error) clearPendingClaim();
  return { error };
}
