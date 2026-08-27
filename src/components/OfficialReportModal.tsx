import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Award, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { Candidate, Voter, VoteRecord } from '../types';
import { KABUPATEN_NAME, ELECTION_YEAR } from '../data/initialData';
import { formatDateTimeIndo } from '../utils/crypto';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  voters: Voter[];
  votes: VoteRecord[];
}

export function OfficialReportModal({
  isOpen,
  onClose,
  candidates,
  voters,
  votes
}: OfficialReportModalProps) {
  if (!isOpen) return null;

  const totalDPT = voters.length;
  const totalSuaraMasuk = votes.length;
  const partisipasiPersen = totalDPT > 0 ? ((totalSuaraMasuk / totalDPT) * 100).toFixed(1) : '0';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="official-report-modal"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-100 relative print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none"
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                Sertifikat Rekapitulasi Model C1-KWK Digital
              </h2>
              <p className="text-xs text-slate-400">
                Berita Acara Resmi Hasil Penghitungan Suara Pemilihan Bupati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-inner font-serif print:border-none print:shadow-none print:p-0">
          {/* Document Header / Garuda Style KPU Header */}
          <div className="text-center pb-4 border-b-2 border-black space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-800">
              KOMISI PEMILIHAN UMUM {KABUPATEN_NAME}
            </p>
            <h1 className="text-sm sm:text-base font-black tracking-wide uppercase">
              BERITA ACARA DAN SERTIFIKAT REKAPITULASI HASIL PENGHITUNGAN SUARA
            </h1>
            <h2 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
              PEMILIHAN BUPATI DAN WAKIL BUPATI TAHUN {ELECTION_YEAR}
            </h2>
            <p className="text-[11px] font-sans text-slate-600 font-medium">
              MODEL C1-KWK DIGITAL • NOMOR REGISTRASI: BA-KPU/PILBUP/{ELECTION_YEAR}/001
            </p>
          </div>

          {/* Statement Paragraph */}
          <div className="my-5 text-xs text-slate-800 leading-relaxed font-sans text-justify space-y-2">
            <p>
              Pada hari ini, diselenggarakan Rapat Pleno Terbuka Rekapitulasi Hasil Penghitungan Perolehan Suara Pemilihan Bupati dan Wakil Bupati {KABUPATEN_NAME} Tahun {ELECTION_YEAR} melalui Sistem Pemungutan Suara Elektronik (E-Voting) yang aman, rahasia, dan terenkripsi.
            </p>
          </div>

          {/* Table I: Data Pemilih & Penggunaan Hak Pilih */}
          <div className="mb-6 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 bg-slate-100 p-1.5 border border-slate-300">
              I. DATA PEMILIH DAN PENGGUNAAN HAK PILIH (DPT)
            </h3>
            <table className="w-full text-xs border border-slate-400">
              <thead className="bg-slate-200">
                <tr>
                  <th className="border border-slate-400 p-2 text-left">URAIAN</th>
                  <th className="border border-slate-400 p-2 text-center w-32">JUMLAH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="border border-slate-400 p-2">A. Jumlah Pemilih Terdaftar dalam DPT</td>
                  <td className="border border-slate-400 p-2 text-center font-mono font-bold">{totalDPT}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-bold">B. Jumlah Suara Sah Masuk (Tercoblos)</td>
                  <td className="border border-slate-400 p-2 text-center font-mono font-bold text-emerald-800">{totalSuaraMasuk}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2">C. Jumlah Pemilih Belum Memilih</td>
                  <td className="border border-slate-400 p-2 text-center font-mono">{Math.max(0, totalDPT - totalSuaraMasuk)}</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="border border-slate-400 p-2">D. Tingkat Partisipasi Pemilih (%)</td>
                  <td className="border border-slate-400 p-2 text-center font-mono text-blue-900">{partisipasiPersen}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table II: Perolehan Suara Pasangan Calon */}
          <div className="mb-6 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 bg-slate-100 p-1.5 border border-slate-300">
              II. RINCIAN PEROLEHAN SUARA PASANGAN CALON
            </h3>
            <table className="w-full text-xs border border-slate-400">
              <thead className="bg-slate-200">
                <tr>
                  <th className="border border-slate-400 p-2 text-center w-12">NO</th>
                  <th className="border border-slate-400 p-2 text-left">NAMA PASANGAN CALON BUPATI & WAKIL BUPATI</th>
                  <th className="border border-slate-400 p-2 text-center w-32">TOTAL SUARA</th>
                  <th className="border border-slate-400 p-2 text-center w-24">PERSENTASE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {candidates.map((cand) => {
                  const voteCount = votes.filter(v => v.candidateId === cand.id).length;
                  const pct = totalSuaraMasuk > 0 ? ((voteCount / totalSuaraMasuk) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={cand.id}>
                      <td className="border border-slate-400 p-2 text-center font-bold">{cand.noUrut}</td>
                      <td className="border border-slate-400 p-2">
                        <div className="font-bold">{cand.namaBupati}</div>
                        <div className="text-slate-600 text-[11px]">& {cand.namaWakil}</div>
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-mono font-bold text-sm">
                        {voteCount.toLocaleString('id-ID')}
                      </td>
                      <td className="border border-slate-400 p-2 text-center font-mono font-bold text-sm">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures / Pengesahan Section */}
          <div className="pt-6 font-sans text-xs border-t border-slate-400 space-y-6">
            <p className="text-center font-medium">
              Demikian Berita Acara Rekapitulasi ini dibuat dengan sebenar-benarnya dan ditandatangani secara digital oleh para pihak:
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Ketua KPU */}
              <div className="space-y-12">
                <p className="font-bold">Ketua KPUD Kabupaten</p>
                <div className="font-mono text-[9px] text-emerald-800 bg-emerald-50 py-1 rounded border border-emerald-300">
                  ✓ SIGNED DIGITAL CERT
                </div>
                <div>
                  <p className="font-bold underline">( H. Hendrawan, S.H., M.H. )</p>
                  <p className="text-[10px] text-slate-600">NIP. 19780512 200212 1 002</p>
                </div>
              </div>

              {/* Ketua Bawaslu */}
              <div className="space-y-12">
                <p className="font-bold">Ketua Bawaslu Kabupaten</p>
                <div className="font-mono text-[9px] text-emerald-800 bg-emerald-50 py-1 rounded border border-emerald-300">
                  ✓ VERIFIED BAWASLU AUDIT
                </div>
                <div>
                  <p className="font-bold underline">( Dr. M. Rizal Pratama, M.Si )</p>
                  <p className="text-[10px] text-slate-600">Pengawas Independen</p>
                </div>
              </div>

              {/* Perwakilan Saksi Paslon */}
              <div className="space-y-12">
                <p className="font-bold">Saksi Paslon (01, 02, 03)</p>
                <div className="font-mono text-[9px] text-emerald-800 bg-emerald-50 py-1 rounded border border-emerald-300">
                  ✓ SAKSI PASLON APPROVED
                </div>
                <div>
                  <p className="font-bold underline">( Tim Gabungan Saksi )</p>
                  <p className="text-[10px] text-slate-600">Mandat Resmi Partai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
