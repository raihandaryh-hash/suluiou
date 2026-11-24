import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/data/flags", () => ({ ASESMEN_TERBUKA: false, ASESMEN_DEWASA_TERBUKA: true }));
vi.mock("@/lib/classSession", () => ({ getStudentSession: () => (globalThis as { __sesi?: unknown }).__sesi ?? null }));

import { asesmenTerbuka, catatAdmin } from "@/lib/aksesAsesmen";

function pasangAuth(id: string, dewasa: boolean) {
  localStorage.setItem("sb-x-auth-token", JSON.stringify({ user: { id, app_metadata: { dewasa } } }));
}

describe("akses asesmen", () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); (globalThis as { __sesi?: unknown }).__sesi = null; });
  it("tamu tidak pernah masuk", () => {
    (globalThis as { __sesi?: unknown }).__sesi = { kind: "guest", guestIdentifier: "tamu_x" };
    expect(asesmenTerbuka()).toBe(false);
  });
  it("akun di bawah 18 tertutup", () => {
    (globalThis as { __sesi?: unknown }).__sesi = { kind: "google", userId: "u1" };
    pasangAuth("u1", false);
    expect(asesmenTerbuka()).toBe(false);
  });
  it("akun dewasa terbuka bila flag dewasa menyala", () => {
    (globalThis as { __sesi?: unknown }).__sesi = { kind: "google", userId: "u1" };
    pasangAuth("u1", true);
    expect(asesmenTerbuka()).toBe(true);
  });
  it("token akun lain tidak dipakai", () => {
    (globalThis as { __sesi?: unknown }).__sesi = { kind: "google", userId: "u1" };
    pasangAuth("u2", true);
    expect(asesmenTerbuka()).toBe(false);
  });
  it("admin selalu bisa meninjau", () => {
    (globalThis as { __sesi?: unknown }).__sesi = { kind: "google", userId: "u1" };
    pasangAuth("u1", false);
    catatAdmin("u1", true);
    expect(asesmenTerbuka()).toBe(true);
  });
});
