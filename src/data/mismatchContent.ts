// src/data/mismatchContent.ts
// Mukadimah Insight: "kenapa & so-what" dari Kartu Penampar → membangunkan,
// lalu menjembatani ke Pak Evan. Inti: ada MISMATCH antara kebutuhan riil
// Indonesia (kartu penampar) dengan arah yang diambil anak muda & pendidikan.
// Semua siswa-facing ("kamu"). Angka ber-atribusi (lihat cite → references.ts).

export const mismatchMukadimah = {
  // Reframing kartu penampar
  snapshotKicker: 'Apa yang barusan kamu lihat',
  snapshotLead: 'Empat kartu tadi bukan sekadar angka. Itu potret Indonesia hari ini: guru madrasah yang menunggu giliran sertifikasi, desa yang kehilangan anak-anak terbaiknya, remaja yang memendam tekanan sendirian, ekonomi syariah yang ruangnya luas tapi sepi penggarap. Semuanya punya satu kesamaan: kebutuhan yang nyata, mendesak, dan belum terpenuhi.',

  // The turn: mismatch
  turnKicker: 'Lalu, ke mana arah kita?',
  turnLead: 'Anehnya, di saat kebutuhan-kebutuhan itu menganga, sebagian besar dari kita justru berebut menuju tempat yang sama: pekerjaan "aman" di sektor formal, menjadi PNS, atau merantau ke kota besar yang kursinya makin sempit. Bukan salah yang memilih itu. Tapi ketika hampir semua orang mengejar pintu yang sama, antrean menumpuk, sementara ruang-ruang yang benar-benar membutuhkan justru ditinggalkan.',

  // Structural reality
  realitaKicker: 'Padahal strukturnya sudah berubah',
  realita: [
    {
      judul: 'Mayoritas justru di luar sektor formal',
      body: 'Sekitar 99% usaha di Indonesia adalah UMKM, menyerap hampir semua tenaga kerja kita. Lebih dari separuh penduduk bekerja justru di sektor informal. Lapangan kerja yang sebenarnya, ada di sini.',
      cite: 'umkm-kemenkopukm',
    },
    {
      judul: 'Dunia bergerak ke arah yang lebih cair',
      body: 'Ekonomi gig dan kerja lepas tumbuh, kontrak menggantikan jabatan tetap, dan satu orang kini lazim memegang beberapa peran sekaligus. Dunia menjadi VUCA: bergejolak, tidak pasti, rumit, dan ambigu.',
      cite: 'bps-informal-mayoritas',
    },
    {
      judul: 'AI sudah merambah hampir semua sektor',
      body: 'Sementara itu kecerdasan buatan masuk ke hampir setiap bidang, sedangkan literasi digital kita baru di tingkat sedang. Yang dituntut bukan lagi sekadar gelar, melainkan kemampuan memadukan keahlian dengan keterampilan manusia yang tak tergantikan.',
      cite: 'literasi-digital-kominfo',
    },
  ],

  // The danger
  bahayaKicker: 'Di sinilah letak bahayanya',
  bahayaLead: 'Ada jurang antara apa yang Indonesia butuhkan dan ke mana anak mudanya bergerak. Pendidikan kita pun masih banyak mengejar gelar, bukan keterampilan dan kemampuan beradaptasi. Akibatnya, kebutuhan yang genting tak tergarap, sementara energi besar generasi muda mengalir ke arah yang menyempit. Jika dibiarkan, bonus demografi yang seharusnya jadi berkah bisa berbalik menjadi beban.',

  // Wake-up + bridge to Pak Evan
  bridgeLead: 'Tapi ini bukan untuk membuatmu putus asa. Justru sebaliknya: begitu kamu melihat jurang ini, kamu juga melihat peluang yang orang lain lewatkan. Maka langkah pertama adalah benar-benar memahami medannya, bukan dari kabar burung, tapi dari yang sudah puluhan tahun ada di dalamnya. Mari kita mulai dari Pak Evan.',
};
