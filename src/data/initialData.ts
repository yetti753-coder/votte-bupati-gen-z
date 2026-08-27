import { Candidate, Voter, VoteRecord, AuditLog } from '../types';

export const KABUPATEN_NAME = 'KABUPATEN NUSANTARA RAYA';
export const ELECTION_YEAR = '2026';
export const ELECTION_STAGE = 'PEMUNGUTAN SUARA DIGITAL (E-VOTING)';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'paslon-01',
    noUrut: '01',
    namaBupati: 'Dr. Ir. H. Achmad Fauzan, M.Eng',
    gelarBupati: 'Bupati Visioner & Akademisi Tata Ruang',
    namaWakil: 'Hj. Siti Rahmawati, S.E., M.Si',
    gelarWakil: 'Praktisi Ekonomi Kerakyatan & UMKM',
    fotoBupati: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    fotoWakil: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    fotoPaslon: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    slogan: 'Nusantara Maju, Mandiri, Berkelanjutan & Berakhlaq',
    warnaTema: {
      primary: 'emerald',
      secondary: 'teal',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      badgeText: 'text-emerald-400',
      border: 'border-emerald-500',
      glow: 'shadow-emerald-500/20',
    },
    partaiPengusung: [
      { nama: 'Partai Kebangkitan Bangsa', singkatan: 'PKB', warna: '#10b981' },
      { nama: 'Partai Persatuan Pembangunan', singkatan: 'PPP', warna: '#059669' },
      { nama: 'Partai Gelora Indonesia', singkatan: 'GELORA', warna: '#0d9488' }
    ],
    visi: 'Mewujudkan Kabupaten Nusantara Raya yang Berkelanjutan, Mandiri Secara Pangan & Energi, serta Unggul dalam Pelayanan Publik Berbasis Teknologi.',
    misi: [
      'Peningkatan kualitas infrastruktur jalan desa dan konektivitas antarkecamatan bebas lubang.',
      'Transformasi digital birokrasi pemerintahan desa dan perizinan kilat 1 pintu tanpa pungli.',
      'Subsidi pupuk organik dan modernisasi alsintan untuk 50.000 petani dan nelayan lokal.',
      'Beasiswa penuh kuliah kedokteran, teknologi, dan kejuruan bagi 1.000 putra-putri daerah.'
    ],
    programUnggulan: [
      'Kartu Petani & Nelayan Nusantara Mandiri (Modal & Asuransi Panen)',
      '1 Desa 1 Fasilitas Kesehatan 24 Jam Siaga Ambulans',
      'Internet Desa Cepat Gratis & Sentra UMKM Digital',
      'Revitalisasi Pasar Tradisional Ber-AC dan Ramah Lingkungan'
    ],
    profilBupati: {
      usia: 49,
      pendidikanTerakhir: 'S3 Teknik Sipil & Lingkungan - Institut Teknologi Bandung (ITB)',
      pengalaman: [
        'Mantan Kepala Dinas PUPR Kabupaten (2018 - 2023)',
        'Dosen Tamu Perencanaan Wilayah Kota ITB & UGM',
        'Ketua Himpunan Insinyur Daerah (2019 - Sekarang)'
      ]
    },
    profilWakil: {
      usia: 44,
      pendidikanTerakhir: 'S2 Magister Manajemen Keuangan Publik - Universitas Indonesia (UI)',
      pengalaman: [
        'Ketua Ikatan Wanita Pengusaha Daerah (IWAPI) (2017 - 2022)',
        'Anggota Komisi Keuangan DPRD Kabupaten (2019 - 2024)',
        'Pendiri Koperasi Pemberdayaan Perempuan Berdaya'
      ]
    }
  },
  {
    id: 'paslon-02',
    noUrut: '02',
    namaBupati: 'Drs. H. Budi Santoso, M.M',
    gelarBupati: 'Birokrat Senior & Tokoh Pemerintahan Daerah',
    namaWakil: 'dr. Maya Anggraini, Sp.A, M.Kes',
    gelarWakil: 'Dokter Spesialis & Pejuang Nol Stunting',
    fotoBupati: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    fotoWakil: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    fotoPaslon: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    slogan: 'Keluarga Sehat, Rakyat Sejahtera, Lapangan Kerja Terbuka Luas',
    warnaTema: {
      primary: 'blue',
      secondary: 'indigo',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      badgeText: 'text-blue-400',
      border: 'border-blue-500',
      glow: 'shadow-blue-500/20',
    },
    partaiPengusung: [
      { nama: 'Partai Demokrasi Perjuangan', singkatan: 'PDIP', warna: '#ef4444' },
      { nama: 'Partai Golongan Karya', singkatan: 'GOLKAR', warna: '#eab308' },
      { nama: 'Partai NasDem', singkatan: 'NASDEM', warna: '#1e3a8a' },
      { nama: 'Partai Amanat Nasional', singkatan: 'PAN', warna: '#3b82f6' }
    ],
    visi: 'Terwujudnya Masyarakat Nusantara Raya yang Berdaya Saing, Sehat Jasmani Rohani, dengan Akses Pendidikan dan Kesehatan 100% Gratis.',
    misi: [
      'Menjamin Universal Health Coverage (UHC) BPJS Kesehatan gratis tanpa syarat bagi seluruh warga.',
      'Pemberantasan stunting tuntas hingga di bawah 5% melalui asupan nutrisi protein hewani harian.',
      'Membuka Kawasan Industri Terpadu ramah lingkungan dan menyerap 25.000 tenaga kerja lokal.',
      'Pembangunan 5 Rumah Sakit Tipe C di kecamatan pesisir dan kepulauan.'
    ],
    programUnggulan: [
      'Kartu Sehat Nusantara Bebas Biaya Rawat Inap & Obat',
      'Pemberian Makanan Bergizi Tambahan (PMT) Ibu Hamil & Balita Setiap Hari',
      'Pusat Pelatihan Vokasi & Sertifikasi Kerja BNSP Gratis untuk Pemuda',
      'Insentif Bulanan Guru Ngaji, Guru Honorer, Kader Posyandu & RT/RW'
    ],
    profilBupati: {
      usia: 56,
      pendidikanTerakhir: 'S2 Magister Manajemen Administrasi Publik - Universitas Gadjah Mada',
      pengalaman: [
        'Sekretaris Daerah (Sekda) Kabupaten (2016 - 2023)',
        'Kepala Badan Perencanaan Pembangunan Daerah (Bappeda)',
        'Peraih Penghargaan Satyalancana Karya Satya Presiden RI'
      ]
    },
    profilWakil: {
      usia: 41,
      pendidikanTerakhir: 'Spesialis Anak & S2 Magister Kesehatan Masyarakat - FK Universitas Airlangga',
      pengalaman: [
        'Direktur Pelayanan Medis RSUD Daerah (2020 - 2024)',
        'Ketua Satgas Penurunan Angka Kematian Ibu & Bayi (AKI/AKB)',
        'Relawan Medis Bencana Nasional IDI'
      ]
    }
  },
  {
    id: 'paslon-03',
    noUrut: '03',
    namaBupati: 'H. Mochamad Ridwan, S.Sos, M.I.Kom',
    gelarBupati: 'Tokoh Muda, Pengusaha Agribisnis & Aktivis Sosial',
    namaWakil: 'Hendra Pratama, S.Kom, M.T',
    gelarWakil: 'Inovator Smart City & Arsitek Keamanan Siber',
    fotoBupati: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    fotoWakil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    fotoPaslon: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    slogan: 'Inovasi Cepat, Transparansi Anggaran, Masa Depan Generasi Emas',
    warnaTema: {
      primary: 'amber',
      secondary: 'orange',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      badgeText: 'text-amber-400',
      border: 'border-amber-500',
      glow: 'shadow-amber-500/20',
    },
    partaiPengusung: [
      { nama: 'Partai Gerakan Indonesia Raya', singkatan: 'GERINDRA', warna: '#dc2626' },
      { nama: 'Partai Keadilan Sejahtera', singkatan: 'PKS', warna: '#f97316' },
      { nama: 'Partai Solidaritas Indonesia', singkatan: 'PSI', warna: '#ec4899' },
      { nama: 'Partai Demokrat', singkatan: 'DEMOKRAT', warna: '#2563eb' }
    ],
    visi: 'Membangun Kabupaten Pintar (Smart Regency) Berbasis Ekonomi Kreatif, Pariwisata Berkelas Dunia, dan Tata Kelola Anggaran Bersih Anti-Korupsi.',
    misi: [
      'Dashboard APBD Transparan Real-Time yang bisa diakses dan diawasi oleh seluruh warga lewat HP.',
      'Bantuan Permodalan Usaha Rp 20 - 50 Juta per UMKM Tanpa Bunga & Tanpa Agunan.',
      'Pengembangan 10 Desa Wisata Unggulan dan Ekowisata Berbasis Komunitas Lokal.',
      'Pendidikan Koding & AI untuk seluruh Sekolah Menengah dan Pesantren Daerah.'
    ],
    programUnggulan: [
      'Aplikasi Sapa Bupati: Respon Keluhan Warga Max 1x24 Jam Langsung Ditindak',
      'Nusantara Creative & Digital Hub di Setiap Kecamatan',
      'Program Insentif Rp 100 Juta / Desa per Tahun untuk Inovasi Pemuda',
      'Pembangunan Jaringan Irigasi Otomatis IoT Pertanian Modern'
    ],
    profilBupati: {
      usia: 38,
      pendidikanTerakhir: 'S2 Magister Komunikasi Politik - Universitas Padjadjaran',
      pengalaman: [
        'Ketua HIPMI (Himpunan Pengusaha Muda Indonesia) Daerah (2018 - 2023)',
        'Founder Nusantara Agri-Export (Eksportir Kopi & Rempah)',
        'Ketua Yayasan Rumah Yatim & Beasiswa Generasi Emas'
      ]
    },
    profilWakil: {
      usia: 35,
      pendidikanTerakhir: 'S2 Magister Teknik Informatika & Cybersecurity - Nanyang Technological University (NTU)',
      pengalaman: [
        'Konsultan Arsitektur Smart City Kementerian Komdigi',
        'Lead Security Architect Startup Unicorn Nasional',
        'Inisiator Komunitas Relawan TIK & Keamanan Siber Daerah'
      ]
    }
  }
];

export const INITIAL_VOTERS: Voter[] = [
  {
    nik: '3201010101850001',
    noKK: '3201010102140005',
    nama: 'Bambang Wijaya Kusuma',
    tanggalLahir: '1985-01-01',
    jenisKelamin: 'L',
    alamat: 'Jl. Merdeka No. 45, RT 02 / RW 04',
    kecamatan: 'Kecamatan Sukasari',
    kelurahanDesa: 'Desa Sukamaju',
    tps: 'TPS 01',
    status: 'belum_memilih',
    noHpMasked: '0812-****-3321'
  },
  {
    nik: '3201010203900002',
    noKK: '3201010102140005',
    nama: 'Dewi Sartika Putri',
    tanggalLahir: '1990-03-02',
    jenisKelamin: 'P',
    alamat: 'Jl. Merdeka No. 45, RT 02 / RW 04',
    kecamatan: 'Kecamatan Sukasari',
    kelurahanDesa: 'Desa Sukamaju',
    tps: 'TPS 01',
    status: 'belum_memilih',
    noHpMasked: '0813-****-9812'
  },
  {
    nik: '3202020405880003',
    noKK: '3202020101150009',
    nama: 'Rahmat Hidayatullah',
    tanggalLahir: '1988-05-04',
    jenisKelamin: 'L',
    alamat: 'Kp. Nelayan Indah Blok B3, RT 01 / RW 02',
    kecamatan: 'Kecamatan Tanjungpura',
    kelurahanDesa: 'Kelurahan Pesisir Mandiri',
    tps: 'TPS 03',
    status: 'belum_memilih',
    noHpMasked: '0857-****-4567'
  },
  {
    nik: '3203030607920004',
    noKK: '3203030101180011',
    nama: 'Nur Halimah, S.Pd',
    tanggalLahir: '1992-07-06',
    jenisKelamin: 'P',
    alamat: 'Perumahan Cempaka Asri No. 12',
    kecamatan: 'Kecamatan Cempaka Mas',
    kelurahanDesa: 'Desa Cempaka Putih',
    tps: 'TPS 05',
    status: 'belum_memilih',
    noHpMasked: '0821-****-1109'
  },
  {
    nik: '3204040809950005',
    noKK: '3204040101200017',
    nama: 'Fajar Nugroho Pratama',
    tanggalLahir: '1995-09-08',
    jenisKelamin: 'L',
    alamat: 'Dusun Harapan Baru RT 04 / RW 01',
    kecamatan: 'Kecamatan Bukit Harapan',
    kelurahanDesa: 'Desa Harapan Jaya',
    tps: 'TPS 07',
    status: 'belum_memilih',
    noHpMasked: '0878-****-6643'
  },
  {
    nik: '3205051011980006',
    noKK: '3205050101220023',
    nama: 'Siti Zulaikha Rahmadani',
    tanggalLahir: '1998-11-10',
    jenisKelamin: 'P',
    alamat: 'Jl. Samudera Raya No. 88, RT 03 / RW 05',
    kecamatan: 'Kecamatan Teluk Intan',
    kelurahanDesa: 'Desa Intan Sari',
    tps: 'TPS 09',
    status: 'sudah_memilih',
    waktuMemilih: '2026-08-27T08:14:22.000Z',
    tokenBuktiHash: 'a7c9f823e41b9d0e21a78345c6b90123fe45d6789abc1234def5678901234567',
    noHpMasked: '0896-****-8871'
  },
  {
    nik: '3201011212820007',
    noKK: '3201010101120033',
    nama: 'Agus Salim Wibowo',
    tanggalLahir: '1982-12-12',
    jenisKelamin: 'L',
    alamat: 'Jl. Flamboyan No. 19, RT 05 / RW 02',
    kecamatan: 'Kecamatan Sukasari',
    kelurahanDesa: 'Desa Sukasari Tengah',
    tps: 'TPS 02',
    status: 'sudah_memilih',
    waktuMemilih: '2026-08-27T08:30:15.000Z',
    tokenBuktiHash: 'b2e1f409c87a54321d89e012fa34b567cd89ef01234567890abcdef123456789',
    noHpMasked: '0811-****-5544'
  },
  {
    nik: '3202021503930008',
    noKK: '3202020101170045',
    nama: 'Eka Putri Lestari',
    tanggalLahir: '1993-03-15',
    jenisKelamin: 'P',
    alamat: 'Jl. Pelabuhan Lama No. 04',
    kecamatan: 'Kecamatan Tanjungpura',
    kelurahanDesa: 'Desa Dermaga Sejahtera',
    tps: 'TPS 04',
    status: 'belum_memilih',
    noHpMasked: '0852-****-7719'
  }
];

export const INITIAL_VOTES: VoteRecord[] = [
  {
    id: 'VOTE-001',
    candidateId: 'paslon-01',
    noUrut: '01',
    kecamatan: 'Kecamatan Sukasari',
    kelurahanDesa: 'Desa Sukasari Tengah',
    tps: 'TPS 01',
    timestamp: '2026-08-27T07:15:10.000Z',
    ballotHash: '3f7b2c91a0e8d47b5f190e21a78345c6b90123fe45d6789abc1234def5678901',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    verificationNonce: 'NONCE-847291',
    isVerified: true
  },
  {
    id: 'VOTE-002',
    candidateId: 'paslon-02',
    noUrut: '02',
    kecamatan: 'Kecamatan Sukasari',
    kelurahanDesa: 'Desa Sukamaju',
    tps: 'TPS 02',
    timestamp: '2026-08-27T07:22:45.000Z',
    ballotHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    previousHash: '3f7b2c91a0e8d47b5f190e21a78345c6b90123fe45d6789abc1234def5678901',
    verificationNonce: 'NONCE-194820',
    isVerified: true
  },
  {
    id: 'VOTE-003',
    candidateId: 'paslon-03',
    noUrut: '03',
    kecamatan: 'Kecamatan Tanjungpura',
    kelurahanDesa: 'Kelurahan Pesisir Mandiri',
    tps: 'TPS 03',
    timestamp: '2026-08-27T07:45:00.000Z',
    ballotHash: '11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff',
    previousHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    verificationNonce: 'NONCE-392817',
    isVerified: true
  },
  {
    id: 'VOTE-004',
    candidateId: 'paslon-01',
    noUrut: '01',
    kecamatan: 'Kecamatan Cempaka Mas',
    kelurahanDesa: 'Desa Cempaka Putih',
    tps: 'TPS 05',
    timestamp: '2026-08-27T08:02:18.000Z',
    ballotHash: 'ccddeeff00112233445566778899aabb11223344556677889900aabbccddeeff',
    previousHash: '11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff',
    verificationNonce: 'NONCE-746201',
    isVerified: true
  },
  {
    id: 'VOTE-005',
    candidateId: 'paslon-02',
    noUrut: '02',
    kecamatan: 'Kecamatan Teluk Intan',
    kelurahanDesa: 'Desa Intan Sari',
    tps: 'TPS 09',
    timestamp: '2026-08-27T08:14:22.000Z',
    ballotHash: 'a7c9f823e41b9d0e21a78345c6b90123fe45d6789abc1234def5678901234567',
    previousHash: 'ccddeeff00112233445566778899aabb11223344556677889900aabbccddeeff',
    verificationNonce: 'NONCE-558291',
    isVerified: true
  },
  {
    id: 'VOTE-006',
    candidateId: 'paslon-03',
    noUrut: '03',
    kecamatan: 'Kecamatan Bukit Harapan',
    kelurahanDesa: 'Desa Harapan Jaya',
    tps: 'TPS 07',
    timestamp: '2026-08-27T08:25:40.000Z',
    ballotHash: 'e41b9d0e21a78345c6b90123fe45d6789abc1234def5678901234567a7c9f823',
    previousHash: 'a7c9f823e41b9d0e21a78345c6b90123fe45d6789abc1234def5678901234567',
    verificationNonce: 'NONCE-918234',
    isVerified: true
  },
  {
    id: 'VOTE-007',
    candidateId: 'paslon-01',
    noUrut: '01',
    kecamatan: 'Kecamatan Sukasari',
    kelurahanDesa: 'Desa Sukasari Tengah',
    tps: 'TPS 02',
    timestamp: '2026-08-27T08:30:15.000Z',
    ballotHash: 'b2e1f409c87a54321d89e012fa34b567cd89ef01234567890abcdef123456789',
    previousHash: 'e41b9d0e21a78345c6b90123fe45d6789abc1234def5678901234567a7c9f823',
    verificationNonce: 'NONCE-629104',
    isVerified: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-08-27T07:00:00.000Z',
    action: 'INISIALISASI_BILIK_SUARA',
    actor: 'Ketua KPUD Kabupaten',
    role: 'ADMIN_KPUD',
    details: 'Sistem E-Voting PILBUP resmi dibuka serentak di 5 Kecamatan & seluruh TPS terdaftar.',
    ipMock: '192.168.10.1',
    severity: 'info'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-08-27T07:00:05.000Z',
    action: 'VERIFIKASI_INTEGRITAS_DATABASE',
    actor: 'Server Kriptografi E-Voting',
    role: 'SISTEM_ENKRIPSI',
    details: 'Genesis block ledger suara terverifikasi aman dengan hash SHA-256 valid.',
    ipMock: '10.0.0.1',
    severity: 'success'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-08-27T07:15:10.000Z',
    action: 'PENCOBLOSAN_SUARA_TERENKRIPSI',
    actor: 'Pemilih TPS 01 (Anonim)',
    role: 'PEMILIH',
    details: '1 Suara terenkripsi berhasil masuk ke ledger tanpa tautan identitas NIK.',
    ipMock: '180.252.11.45',
    hashReference: '3f7b2c91a0e8d47b5f190e21a78345c6b90123fe45d6789abc1234def5678901',
    severity: 'info'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-08-27T07:22:45.000Z',
    action: 'PENCOBLOSAN_SUARA_TERENKRIPSI',
    actor: 'Pemilih TPS 02 (Anonim)',
    role: 'PEMILIH',
    details: '1 Suara terenkripsi berhasil dicatat ke rantai hash suara.',
    ipMock: '180.252.12.89',
    hashReference: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    severity: 'info'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-08-27T07:30:00.000Z',
    action: 'AUDIT_BERKALA_PENGAWAS',
    actor: 'Tim Pengawas Bawaslu Daerah',
    role: 'PENGAWAS_BAWASLU',
    details: 'Pemeriksaan audit log: 0 anomali, 0 percobaan double-voting terdeteksi.',
    ipMock: '10.10.2.14',
    severity: 'success'
  }
];

export const KECAMATAN_LIST = [
  'Kecamatan Sukasari',
  'Kecamatan Tanjungpura',
  'Kecamatan Cempaka Mas',
  'Kecamatan Bukit Harapan',
  'Kecamatan Teluk Intan'
];
