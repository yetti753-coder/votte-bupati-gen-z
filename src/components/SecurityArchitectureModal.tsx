import { 
  X, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  EyeOff, 
  Database, 
  CheckCircle2, 
  Users, 
  FileCheck2, 
  Layers 
} from 'lucide-react';

interface SecurityArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityArchitectureModal({
  isOpen,
  onClose
}: SecurityArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        id="security-architecture-modal"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-100 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-['Outfit']">
                Arsitektur Keamanan E-Voting Pilbup
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                Penerapan Asas LUBER JURDIL Berbasis Kriptografi Digital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Security Pillars */}
        <div className="space-y-4 text-xs">
          {/* Pillar 1: Single Vote Lock */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">
                1. Satu Pemilih = Satu Suara (Anti-Double Voting)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Setiap NIK yang telah melakukan konfirmasi voting otomatis dikunci secara permanen menjadi status <code>sudah_memilih</code>. Sistem akan menolak upaya login kedua kali secara otomatis dengan bukti token timestamp.
              </p>
            </div>
          </div>

          {/* Pillar 2: Identity Separation */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">
                2. Pemisahan Data Identitas (Asas Rahasia)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Data NIK & KK pemilih disimpan pada tabel otentikasi DPT yang terpisah dari tabel suara. Saat suara dikirim, sistem menggunakan token acak terenkripsi (Zero-Knowledge unlinkability) sehingga tidak ada pihak—termasuk admin KPUD atau Bawaslu—yang dapat mengetahui siapa memilih paslon nomor berapa.
              </p>
            </div>
          </div>

          {/* Pillar 3: Hash Chain Ledger */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">
                3. Rantai Hash SHA-256 (Anti-Manipulasi Suara)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Setiap suara membentuk blok transaksi yang diikat dengan hash suara sebelumnya. Mengubah satu suara akan merusak seluruh rantai kriptografi (blockchain-style ledger), memungkinkan audit real-time dengan akurasi 100%.
              </p>
            </div>
          </div>

          {/* Pillar 4: Audit Trail */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">
                4. Audit Log Terbuka & Komprehensif
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Semua interaksi seperti inisialisasi bilik suara, otentikasi, voting anonim, dan pembacaan rekapitulasi dicatat dengan stempel waktu terpresisi milidetik dan IP address mock untuk pengawasan transparan oleh Bawaslu dan saksi.
              </p>
            </div>
          </div>

          {/* Pillar 5: Multi-level RBAC */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">
                5. Hak Akses Bertingkat (Role-Based Access)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Pemisahan wewenang yang tegas antara <strong>Pemilih</strong> (hanya mencoblos 1 kali), <strong>Operator TPS</strong> (verifikasi fisik DPT), <strong>KPUD</strong> (rekapitulasi & penetapan), dan <strong>Bawaslu</strong> (audit pengawasan independen).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Standar KPU RI & BSSN (Badan Siber dan Sandi Negara)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
