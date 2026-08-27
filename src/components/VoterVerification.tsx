import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  CreditCard, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Search,
  ArrowRight,
  Info,
  QrCode,
  FileCheck2
} from 'lucide-react';
import { Voter } from '../types';
import { maskNIK, maskKK, formatDateTimeIndo } from '../utils/crypto';
import { KABUPATEN_NAME } from '../data/initialData';

interface VoterVerificationProps {
  voters: Voter[];
  onVerified: (voter: Voter) => void;
  onOpenSecurityModal: () => void;
}

export function VoterVerification({
  voters,
  onVerified,
  onOpenSecurityModal
}: VoterVerificationProps) {
  const [nikInput, setNikInput] = useState('');
  const [noKKInput, setNoKKInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedDemoVoter, setSelectedDemoVoter] = useState<string>('');

  const handleSelectDemo = (nik: string) => {
    const voter = voters.find(v => v.nik === nik);
    if (voter) {
      setSelectedDemoVoter(nik);
      setNikInput(voter.nik);
      setNoKKInput(voter.noKK);
      setErrorMsg(null);
      // Auto prefill OTP simulation for smooth test flow
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setOtpInput(mockOtp);
      setOtpSent(true);
    }
  };

  const handleSendOtp = () => {
    if (!nikInput || nikInput.length !== 16) {
      setErrorMsg('Harap masukkan 16 digit NIK yang terdaftar pada KTP elektronik.');
      return;
    }
    if (!noKKInput || noKKInput.length !== 16) {
      setErrorMsg('Harap masukkan 16 digit Nomor Kartu Keluarga (KK).');
      return;
    }

    const voter = voters.find(v => v.nik === nikInput && v.noKK === noKKInput);
    if (!voter) {
      setErrorMsg('Kombinasi NIK dan Nomor KK tidak ditemukan pada Daftar Pemilih Tetap (DPT) Kabupaten. Silakan cek kembali atau hubungi petugas KPUD.');
      return;
    }

    setErrorMsg(null);
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setOtpInput(mockOtp); // auto populate for seamless user experience
  };

  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nikInput || nikInput.length !== 16) {
      setErrorMsg('NIK harus terdiri dari 16 digit angka.');
      return;
    }
    if (!noKKInput || noKKInput.length !== 16) {
      setErrorMsg('Nomor KK harus terdiri dari 16 digit angka.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const voter = voters.find(v => v.nik === nikInput && v.noKK === noKKInput);

      if (!voter) {
        setErrorMsg('Data NIK / No. KK tidak cocok dengan database DPT KPUD. Pastikan data identitas Anda valid.');
        return;
      }

      onVerified(voter);
    }, 600);
  };

  return (
    <div id="voter-verification-section" className="max-w-4xl mx-auto py-6 px-4">
      {/* Header Announcement Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Verifikasi Identitas Resmi Pemilih Pilbup</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
          Bilik Suara Elektronik Pilbup
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Silakan masukkan NIK dan Nomor KK Anda yang terdaftar pada DPT {KABUPATEN_NAME} untuk membuka surat suara digital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Form (Left / Main) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Autentikasi Pemilih</h2>
                <p className="text-xs text-slate-400">Verifikasi NIK KTP-el & Kartu Keluarga</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              DPT AKTIF
            </span>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Verifikasi Gagal</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyAndProceed} className="space-y-4">
            {/* NIK Input */}
            <div>
              <label htmlFor="input-nik" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-nik"
                  type="text"
                  maxLength={16}
                  value={nikInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setNikInput(val);
                  }}
                  placeholder="Contoh: 3201010101850001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 tracking-wider"
                  required
                />
                <div className="absolute right-3 top-3 text-slate-500 text-xs font-mono">
                  {nikInput.length}/16
                </div>
              </div>
            </div>

            {/* Nomor KK Input */}
            <div>
              <label htmlFor="input-nokk" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nomor Kartu Keluarga (KK 16 Digit) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-nokk"
                  type="text"
                  maxLength={16}
                  value={noKKInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setNoKKInput(val);
                  }}
                  placeholder="Contoh: 3201010102140005"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 tracking-wider"
                  required
                />
                <div className="absolute right-3 top-3 text-slate-500 text-xs font-mono">
                  {noKKInput.length}/16
                </div>
              </div>
            </div>

            {/* Kode Verifikasi / OTP */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-otp" className="text-xs font-semibold text-slate-300">
                  Kode OTP / Token Verifikasi TPS
                </label>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
                  >
                    Kirim Token Verifikasi
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Token Siap
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-otp"
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="6 Digit Kode (Auto-generated)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-center tracking-widest text-lg font-bold"
                />
                <div className="absolute right-3 top-3.5">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              {otpSent && generatedOtp && (
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Token Verifikasi Anda: <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">{generatedOtp}</span> (Simulasi verifikasi cepat)
                </p>
              )}
            </div>

            <button
              id="btn-submit-verifikasi"
              type="submit"
              disabled={isVerifying}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm py-3.5 rounded-xl transition duration-150 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memeriksa Status DPT & Kunci Enkripsi...</span>
                </>
              ) : (
                <>
                  <span>Verifikasi & Masuk Bilik Suara</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Footnote */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Enkripsi Asimetris SHA-256
            </span>
            <button
              onClick={onOpenSecurityModal}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Cara Kami Lindungi Kerahasiaan Suara →
            </button>
          </div>
        </div>

        {/* Quick Demo & DPT Directory (Right) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Pemilih Testing Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Pilih Akun Pemilih Simulasi (Demo DPT)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Klik salah satu data pemilih di bawah untuk menguji alur verifikasi, pencoblosan, ataupun proteksi double-voting:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {voters.map((v) => (
                <button
                  key={v.nik}
                  id={`demo-voter-${v.nik.slice(-4)}`}
                  type="button"
                  onClick={() => handleSelectDemo(v.nik)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                    selectedDemoVoter === v.nik
                      ? 'bg-amber-500/10 border-amber-500/60 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-2">
                      <span>{v.nama}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({v.jenisKelamin})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      NIK: {maskNIK(v.nik)} • {v.tps}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {v.kelurahanDesa}, {v.kecamatan.replace('Kecamatan ', '')}
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {v.status === 'sudah_memilih' ? (
                      <span className="px-2 py-1 rounded-md bg-amber-950/80 border border-amber-800/60 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        Sudah Coblos
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3 text-emerald-400" />
                        Siap Memilih
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DPT Integrity Stats Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold">Wilayah Pemilihan:</span>
              <span className="font-bold text-amber-300">{KABUPATEN_NAME}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold">Total Terdaftar (DPT):</span>
              <span className="font-mono font-bold text-white">{voters.length} Pemilih Terdaftar</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold">Status Hak Suara:</span>
              <span className="text-emerald-400 font-semibold">1 Orang = 1 Suara (Terkunci)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
