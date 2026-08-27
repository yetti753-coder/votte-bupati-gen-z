export type VoterStatus = 'belum_memilih' | 'sudah_memilih';

export interface Voter {
  nik: string;
  noKK: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  kecamatan: string;
  kelurahanDesa: string;
  tps: string;
  status: VoterStatus;
  waktuMemilih?: string;
  tokenBuktiHash?: string;
  noHpMasked?: string;
}

export interface Candidate {
  id: string;
  noUrut: string; // '01', '02', '03'
  namaBupati: string;
  gelarBupati: string;
  namaWakil: string;
  gelarWakil: string;
  fotoBupati: string;
  fotoWakil: string;
  fotoPaslon: string;
  slogan: string;
  warnaTema: {
    primary: string;
    secondary: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    glow: string;
  };
  partaiPengusung: {
    nama: string;
    singkatan: string;
    warna: string;
  }[];
  visi: string;
  misi: string[];
  programUnggulan: string[];
  profilBupati: {
    usia: number;
    pendidikanTerakhir: string;
    pengalaman: string[];
  };
  profilWakil: {
    usia: number;
    pendidikanTerakhir: string;
    pengalaman: string[];
  };
}

export interface VoteRecord {
  id: string;
  candidateId: string; // Paslon id
  noUrut: string;
  kecamatan: string;
  kelurahanDesa: string;
  tps: string;
  timestamp: string;
  ballotHash: string; // SHA-256 style encrypted hash
  previousHash: string; // Blockchain ledger continuity
  verificationNonce: string;
  isVerified: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: 'PEMILIH' | 'SISTEM_ENKRIPSI' | 'ADMIN_KPUD' | 'PENGAWAS_BAWASLU' | 'TPS_OPERATOR';
  details: string;
  ipMock: string;
  hashReference?: string;
  severity: 'info' | 'success' | 'warning' | 'security';
}

export type ActiveTab = 'bilik_suara' | 'kandidat' | 'hasil_suara' | 'admin_panel' | 'audit_keamanan';
