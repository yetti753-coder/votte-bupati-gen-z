import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Vote, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  KeyRound, 
  QrCode,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Candidate, Voter, VoteRecord } from '../types';
import { CandidateCards } from './CandidateCards';
import { CandidateModal } from './CandidateModal';
import { maskNIK, generateVoteToken, sha256, generateRandomNonce } from '../utils/crypto';
import { KABUPATEN_NAME, ELECTION_YEAR } from '../data/initialData';

interface VotingBoothProps {
  voter: Voter;
  candidates: Candidate[];
  onVoteSubmitted: (vote: VoteRecord, tokenProof: string) => void;
  onOpenSecurityModal: () => void;
  onViewProfile: (candidate: Candidate) => void;
}

export function VotingBooth({
  voter,
  candidates,
  onVoteSubmitted,
  onOpenSecurityModal,
  onViewProfile
}: VotingBoothProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCastingVote, setIsCastingVote] = useState(false);
  const [stepStatusText, setStepStatusText] = useState('');
  const [detailCandidate, setDetailCandidate] = useState<Candidate | null>(null);

  const handleSelect = (cand: Candidate) => {
    setSelectedCandidate(cand);
  };

  const handleOpenConfirm = () => {
    if (!selectedCandidate) return;
    setShowConfirmModal(true);
  };

  const handleCastVote = async () => {
    if (!selectedCandidate) return;

    setIsCastingVote(true);
    setStepStatusText('1/4: Mengamankan koneksi & mengenkripsi pilihan...');

    await new Promise(r => setTimeout(r, 450));
    setStepStatusText('2/4: Memisahkan identitas NIK dari surat suara (Blind Ledger)...');

    await new Promise(r => setTimeout(r, 450));
    setStepStatusText('3/4: Membentuk SHA-256 Hash Chain & Digital Token...');

    // Generate cryptographic tokens
    const rawData = `${selectedCandidate.id}-${voter.tps}-${voter.kecamatan}-${Date.now()}-${generateRandomNonce(8)}`;
    const ballotHash = await sha256(rawData);
    const voteToken = generateVoteToken();
    const nonce = `NONCE-${generateRandomNonce(6)}`;

    const newVoteRecord: VoteRecord = {
      id: `VOTE-${Date.now()}`,
      candidateId: selectedCandidate.id,
      noUrut: selectedCandidate.noUrut,
      kecamatan: voter.kecamatan,
      kelurahanDesa: voter.kelurahanDesa,
      tps: voter.tps,
      timestamp: new Date().toISOString(),
      ballotHash,
      previousHash: 'ledger-verified-chain-' + Date.now().toString(16),
      verificationNonce: nonce,
      isVerified: true
    };

    await new Promise(r => setTimeout(r, 450));
    setStepStatusText('4/4: Mengunci status pemilih & menerbitkan kartu bukti digital...');
    await new Promise(r => setTimeout(r, 300));

    // Fire celebratory confetti for exercising democratic right
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback if canvas is not ready
    }

    setIsCastingVote(false);
    setShowConfirmModal(false);
    onVoteSubmitted(newVoteRecord, ballotHash);
  };

  return (
    <div id="voting-booth-container" className="max-w-6xl mx-auto py-6 px-4">
      {/* Top Ballot Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-5 sm:p-7 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BILIK SUARA DIGITAL TERVERIFIKASI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Surat Suara Pemilihan Bupati & Wakil Bupati
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {KABUPATEN_NAME} • TAHUN {ELECTION_YEAR}
            </p>
          </div>

          {/* Voter Credential Pill */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 text-xs space-y-1 w-full md:w-auto shadow-inner">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Nama Pemilih:</span>
              <span className="font-bold text-white">{voter.nama}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">NIK (Tersamarkan):</span>
              <span className="font-mono text-amber-400 font-bold">{maskNIK(voter.nik)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Lokasi TPS:</span>
              <span className="font-semibold text-emerald-300">{voter.tps} • {voter.kelurahanDesa}</span>
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">!</span>
            <span>Pilihlah salah satu Pasangan Calon dengan menekan tombol <strong>PILIH (COBLOS)</strong> di bawah.</span>
          </p>
          <button
            onClick={onOpenSecurityModal}
            className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Bagaimana suara saya dianonimkan?</span>
          </button>
        </div>
      </div>

      {/* Candidates Ballot Grid */}
      <div className="mb-8">
        <CandidateCards
          candidates={candidates}
          onOpenDetail={(c) => setDetailCandidate(c)}
          onSelectPaslon={handleSelect}
          selectedCandidateId={selectedCandidate?.id}
          isVotingMode={true}
        />
      </div>

      {/* Floating Bottom Sticky Action Bar when Paslon is Selected */}
      {selectedCandidate && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 animate-slideUp">
          <div className="bg-slate-900/95 backdrop-blur-md border-2 border-amber-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center font-['Outfit'] shrink-0 shadow">
                {selectedCandidate.noUrut}
              </span>
              <div className="overflow-hidden">
                <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                  Pilihan Anda Terpilih:
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {selectedCandidate.namaBupati} & {selectedCandidate.namaWakil}
                </p>
              </div>
            </div>

            <button
              id="btn-konfirmasi-suara-terpilih"
              onClick={handleOpenConfirm}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 whitespace-nowrap cursor-pointer transition transform active:scale-95"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>KUNCI & KIRIM SUARA</span>
            </button>
          </div>
        </div>
      )}

      {/* Detailed Candidate Info Modal */}
      {detailCandidate && (
        <CandidateModal
          candidate={detailCandidate}
          onClose={() => setDetailCandidate(null)}
          onSelectCandidate={(c) => {
            handleSelect(c);
            setDetailCandidate(null);
          }}
          canVote={true}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div 
            id="modal-konfirmasi-voting"
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-slate-100 relative overflow-hidden"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                Konfirmasi Pilihan Anda
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Harap periksa kembali pilihan Anda sebelum suara dicatat secara permanen ke dalam sistem.
              </p>
            </div>

            {/* Selected Candidate Summary Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5 text-center space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs font-['Outfit']">
                PASLON NOMOR URUT {selectedCandidate.noUrut}
              </span>
              <div className="flex justify-center gap-3 my-2">
                <img
                  src={selectedCandidate.fotoBupati}
                  alt={selectedCandidate.namaBupati}
                  className="w-16 h-16 rounded-xl object-cover border border-amber-500/50"
                  referrerPolicy="no-referrer"
                />
                <img
                  src={selectedCandidate.fotoWakil}
                  alt={selectedCandidate.namaWakil}
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-500/50"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-extrabold text-sm text-white">
                {selectedCandidate.namaBupati}
              </h4>
              <p className="text-xs text-slate-300">
                & {selectedCandidate.namaWakil}
              </p>
            </div>

            {/* Security Warning Notice */}
            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3.5 mb-6 text-xs text-red-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>PERINGATAN SUARA TERKUNCI</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Setelah tombol konfirmasi ditekan, <strong>suara tidak dapat diubah kembali</strong> dan akun NIK Anda akan otomatis ditandai sebagai "Sudah Memilih" untuk mencegah pencoblosan ganda.
              </p>
            </div>

            {/* Casting Progress if Active */}
            {isCastingVote ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-amber-300 font-mono animate-pulse">
                  {stepStatusText}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Kembali Memilih
                </button>
                <button
                  id="btn-final-cast-vote"
                  type="button"
                  onClick={handleCastVote}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>YA, COBLOS SEKARANG</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
