import { 
  CheckCircle2, 
  Lock, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  BarChart3, 
  Download, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Voter, Candidate } from '../types';
import { maskNIK, maskKK, formatDateTimeIndo } from '../utils/crypto';
import { KABUPATEN_NAME, ELECTION_YEAR } from '../data/initialData';
import { useState } from 'react';

interface DigitalReceiptProps {
  voter: Voter;
  chosenCandidate?: Candidate | null;
  ballotHash: string;
  onViewResults: () => void;
  onLogout: () => void;
}

export function DigitalReceipt({
  voter,
  ballotHash,
  onViewResults,
  onLogout
}: DigitalReceiptProps) {
  const [copied, setCopied] = useState(false);
  const currentTime = voter.waktuMemilih || new Date().toISOString();

  const handleCopyHash = () => {
    navigator.clipboard.writeText(ballotHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="digital-receipt-view" className="max-w-3xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Success Status Banner */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/30 ring-8 ring-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold mb-2">
          <Lock className="w-3.5 h-3.5" />
          <span>HAK SUARA BERHASIL DIGUNAKAN • SUARA TERKUNCI</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          Terima Kasih Atas Partisipasi Anda!
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
          Suara Anda telah dienkripsi secara asimetris dan dicatat ke dalam database ledger PILBUP {KABUPATEN_NAME}.
        </p>
      </div>

      {/* Printable Official Digital Certificate / Receipt Card */}
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black">
        {/* Hologram / Security watermark */}
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800 print:border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl border border-amber-500/40">
              🗳️
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-amber-400 uppercase">
                KOMISI PEMILIHAN UMUM DAERAH
              </h2>
              <h3 className="text-base font-extrabold text-white print:text-black font-['Outfit']">
                KARTU BUKTI PEMILIH ELEKTRONIK (E-VOTING)
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Pemilihan Bupati & Wakil Bupati {KABUPATEN_NAME} {ELECTION_YEAR}
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold">
            STATUS: SUDAH MEMILIH
          </div>
        </div>

        {/* Voter Details & Audit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs">
          <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 print:bg-gray-50 print:border-gray-300">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              IDENTITAS PEMILIH DPT
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Nama Lengkap:</span>
              <span className="font-bold text-white print:text-black">{voter.nama}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">NIK (Masked):</span>
              <span className="font-mono font-bold text-amber-300 print:text-black">{maskNIK(voter.nik)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Nomor KK:</span>
              <span className="font-mono text-slate-300 print:text-black">{maskKK(voter.noKK)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Kecamatan:</span>
              <span className="font-medium text-slate-200 print:text-black">{voter.kecamatan}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Desa/Kelurahan:</span>
              <span className="font-medium text-slate-200 print:text-black">{voter.kelurahanDesa}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">TPS:</span>
              <span className="font-bold text-emerald-400 print:text-black">{voter.tps}</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between print:bg-gray-50 print:border-gray-300">
            <div>
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
                VERIFIKASI INTEGRITAS SUARA
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Waktu Pencatatan:</span>
                <span className="font-mono text-slate-200 print:text-black">{formatDateTimeIndo(currentTime)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Protokol Keamanan:</span>
                <span className="font-mono text-emerald-400 print:text-black font-semibold">LUBER-AES256-SHA</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Pemisahan Identitas:</span>
                <span className="text-emerald-400 font-bold print:text-black">TERJAMIN RAHASIA</span>
              </div>
            </div>

            {/* QR Code Graphic Box */}
            <div className="pt-2 flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl print:bg-white">
              <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-slate-950" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                <p className="font-bold text-slate-200">KODE QR AUDIT DOKUMEN</p>
                <p className="mt-0.5 font-mono text-[9px] text-slate-400 break-all">
                  TOKEN-{ballotHash.slice(0, 16).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Hash Proof Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 print:bg-gray-100 print:border-gray-400">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Kunci Hash Audit Suara (SHA-256 Ballot Ledger Proof):
            </span>
            <button
              onClick={handleCopyHash}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer print:hidden"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin Hash</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-[11px] text-emerald-300/90 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 select-all print:text-black">
            {ballotHash}
          </p>
          <p className="text-[10px] text-slate-400 mt-2">
            * Sesuai asas RAHASIA pada Pemilu LUBER JURDIL, pilihan paslon Anda tidak tercantum secara eksplisit pada tanda bukti ini untuk melindungi kerahasiaan pilihan Anda dari pihak manapun.
          </p>
        </div>

        {/* Official Footer Note */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-400 print:border-gray-300 print:text-gray-600">
          Dokumen elektronik ini sah dan diterbitkan secara otomatis oleh Sistem E-Voting Terpadu KPUD {KABUPATEN_NAME}.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          id="btn-print-receipt"
          onClick={handlePrint}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700 shadow-md"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Cetak Bukti Memilih (PDF)</span>
        </button>

        <button
          id="btn-view-quick-count"
          onClick={onViewResults}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Pantau Hasil Quick & Real Count</span>
        </button>

        <button
          id="btn-finish-logout"
          onClick={onLogout}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer border border-slate-800"
        >
          Selesai & Keluar Sesi
        </button>
      </div>
    </div>
  );
}
