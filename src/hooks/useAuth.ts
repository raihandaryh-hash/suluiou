import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Waktu muat Spine B (23 Nov 2026): tiap komponen yang memanggil useAuth dulu mengirim sendiri
// user_roles + auth/v1/user + admin_users (6 komponen -> 18 permintaan, berantai, 4-8 detik sebelum isi halaman).
// Kini satu pemeriksaan per akun dibagi semua komponen, dan email dibaca dari sesi lokal, bukan dari server.
const cacheAdmin = new Map<string, Promise<{ admin: boolean; superAdmin: boolean }>>();

function cekAdmin(userId: string): Promise<{ admin: boolean; superAdmin: boolean }> {
  const ada = cacheAdmin.get(userId);
  if (ada) return ada;
  const janji = (async () => {
    const { data: s } = await supabase.auth.getSession();
    const email = s.session?.user?.email?.toLowerCase();
    const [peran, admin] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle(),
      email
        ? supabase.from('admin_users').select('is_super_admin').ilike('email', email).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    const emailAdmin = (admin.data as { is_super_admin: boolean | null } | null) ?? null;
    return { admin: !!peran.data || !!emailAdmin, superAdmin: !!emailAdmin?.is_super_admin };
  })();
  janji.catch(() => cacheAdmin.delete(userId));
  cacheAdmin.set(userId, janji);
  return janji;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { admin, superAdmin } = await cekAdmin(userId);
      setIsAdmin(admin);
      setIsSuperAdmin(superAdmin);
    } catch {
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: displayName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    cacheAdmin.clear();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };

  return { user, session, isAdmin, isSuperAdmin, loading, signIn, signUp, signOut };
}
