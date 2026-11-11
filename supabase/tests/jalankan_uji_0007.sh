B=/usr/lib/postgresql/16/bin; D=/var/tmp/pg2a
su postgres -c "$B/pg_ctl -D $D stop -m fast" >/dev/null 2>&1; rm -rf $D; mkdir -p $D; chown postgres $D
su postgres -c "$B/initdb -D $D -A trust >/dev/null && $B/pg_ctl -D $D -o '-p 5499 -k /var/tmp' -l $D/log start >/dev/null"; sleep 2
cp /home/claude/suluiou/supabase/tests/uji_0007*.sql /home/claude/suluiou/drizzle/migrations/0007_pintu_masuk_2a.sql /var/tmp/
su postgres -c "cd /var/tmp && psql -h /var/tmp -p 5499 -q -v ON_ERROR_STOP=1 -f uji_0007_prasyarat.sql -f uji_0007_data.sql -f 0007_pintu_masuk_2a.sql -f uji_0007.sql" 2>&1 | grep -E "ERROR|GAGAL|LULUS|lulus" 
