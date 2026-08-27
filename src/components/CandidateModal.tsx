import React from 'react';
import { 
  X, 
  Award, 
  Target, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Vote,
  ShieldCheck,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { Candidate } from '../types';

interface CandidateModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSelectCandidate?: (candidate: Candidate) => void;
  onEditCandidate?: (candidate: Candidate) => void;
  canVote?: boolean;
}

export function CandidateModal({
  candidate,
  onClose,
  onSelectCandidate,
  onEditCandidate,
  canVote
}: CandidateModalProps) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="candidate-detail-modal"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-lg font-['Outfit'] shadow-md shadow-amber-500/20">
              {candidate.noUrut}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] leading-tight">
                Pasangan Calon Nomor Urut {candidate.noUrut}
              </h2>
              <p className="text-xs text-amber-400 font-medium">
                Calon Bupati & Wakil Bupati Kabupaten Nusantara Raya
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onEditCandidate && (
              <button
                type="button"
                onClick={() => {
                  onEditCandidate(candidate);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 hover:border-amber-400"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Data</span>
              </button>
            )}

            <button
              id="btn-close-candidate-modal"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Main Hero / Portrait Section */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bupati Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={candidate.fotoBupati}
                  alt={candidate.namaBupati}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                  CALON BUPATI
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {candidate.namaBupati}
              </h3>
              <p className="text-xs text-amber-300/90 mt-0.5">{candidate.gelarBupati}</p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-left w-full space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{candidate.profilBupati.pendidikanTerakhir}</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{candidate.profilBupati.pengalaman[0]}</span>
                </div>
              </div>
            </div>

            {/* Wakil Bupati Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={candidate.fotoWakil}
                  alt={candidate.namaWakil}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                  CALON WAKIL BUPATI
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {candidate.namaWakil}
              </h3>
              <p className="text-xs text-emerald-300/90 mt-0.5">{candidate.gelarWakil}</p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-left w-full space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{candidate.profilWakil.pendidikanTerakhir}</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{candidate.profilWakil.pengalaman[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-center">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Slogan & Tagline Paslon
            </span>
            <p className="text-sm sm:text-base font-bold text-amber-200 italic font-['Outfit']">
              "{candidate.slogan}"
            </p>
          </div>

          {/* Partai Pengusung & Koalisi */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Partai Politik Pengusung & Pendukung
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidate.partaiPengusung.map((partai, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: partai.warna }}></span>
                  <span className="text-white">{partai.singkatan}</span>
                  <span className="text-slate-400 text-[10px] font-normal">({partai.nama})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Visi */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Visi Utama
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "{candidate.visi}"
            </p>
          </div>

          {/* Misi */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Misi Pembangunan Daerah
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {candidate.misi.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 Program Unggulan */}
          <div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              4 Program Aksi Prioritas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {candidate.programUnggulan.map((prog, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="font-medium">{prog}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            Tutup Informasi
          </button>

          {canVote && onSelectCandidate && (
            <button
              id={`btn-pilih-modal-paslon-${candidate.noUrut}`}
              onClick={() => {
                onSelectCandidate(candidate);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Vote className="w-4 h-4" />
              Pilih Paslon {candidate.noUrut} di Bilik Suara
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
