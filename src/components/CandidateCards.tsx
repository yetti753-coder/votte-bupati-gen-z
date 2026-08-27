import React from 'react';
import { 
  Award, 
  Eye, 
  Vote, 
  Target, 
  Users, 
  Sparkles, 
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { Candidate } from '../types';
import { KABUPATEN_NAME, ELECTION_YEAR } from '../data/initialData';

interface CandidateCardsProps {
  candidates: Candidate[];
  onOpenDetail: (candidate: Candidate) => void;
  onSelectPaslon?: (candidate: Candidate) => void;
  onEditCandidate?: (candidate: Candidate) => void;
  selectedCandidateId?: string | null;
  isVotingMode?: boolean;
}

export function CandidateCards({
  candidates,
  onOpenDetail,
  onSelectPaslon,
  onEditCandidate,
  selectedCandidateId,
  isVotingMode = false
}: CandidateCardsProps) {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      {!isVotingMode && (
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Daftar Resmi Pasangan Calon Pilbup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Kandidat Calon Bupati & Wakil Bupati
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Kenali profil, visi & misi, serta program unggulan setiap pasangan calon sebelum menentukan pilihan di bilik suara digital {KABUPATEN_NAME} {ELECTION_YEAR}.
          </p>
        </div>
      )}

      {/* Grid of 3 Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((cand) => {
          const isSelected = selectedCandidateId === cand.id;

          return (
            <div
              key={cand.id}
              id={`candidate-card-${cand.noUrut}`}
              className={`relative bg-slate-900/90 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group ${
                isSelected
                  ? 'border-amber-400 ring-4 ring-amber-500/30 shadow-2xl shadow-amber-500/20 transform -translate-y-1'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
              }`}
            >
              {/* Top Urut Header */}
              <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-sm font-['Outfit'] shadow-md">
                    {cand.noUrut}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    PASLON NO. {cand.noUrut}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {onEditCandidate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCandidate(cand);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer border border-slate-700 hover:border-amber-400"
                      title="Ubah Foto & Nama Paslon"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400 group-hover:text-inherit" />
                      <span>Ubah</span>
                    </button>
                  )}

                  {cand.partaiPengusung.slice(0, 2).map((p, idx) => (
                    <span 
                      key={idx} 
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                    >
                      {p.singkatan}
                    </span>
                  ))}
                  {cand.partaiPengusung.length > 2 && (
                    <span className="text-[9px] text-slate-400">+{cand.partaiPengusung.length - 2}</span>
                  )}
                </div>
              </div>

              {/* Photos & Names */}
              <div className="p-5 space-y-4 flex-1">
                {/* Duo Portraits */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Bupati */}
                  <div className="text-center">
                    <div className="relative mx-auto mb-2 aspect-square max-w-[120px]">
                      <img
                        src={cand.fotoBupati}
                        alt={cand.namaBupati}
                        className="w-full h-full object-cover rounded-2xl border-2 border-slate-700 shadow-md group-hover:scale-102 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow">
                        BUPATI
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-white leading-tight line-clamp-2">
                      {cand.namaBupati}
                    </h3>
                  </div>

                  {/* Wakil */}
                  <div className="text-center">
                    <div className="relative mx-auto mb-2 aspect-square max-w-[120px]">
                      <img
                        src={cand.fotoWakil}
                        alt={cand.namaWakil}
                        className="w-full h-full object-cover rounded-2xl border-2 border-slate-700 shadow-md group-hover:scale-102 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow">
                        WAKIL
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xs text-white leading-tight line-clamp-2">
                      {cand.namaWakil}
                    </h3>
                  </div>
                </div>

                {/* Slogan */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-xs italic text-amber-300 font-medium line-clamp-2">
                    "{cand.slogan}"
                  </p>
                </div>

                {/* Visi preview */}
                <div className="space-y-1 text-xs text-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Visi Utama:
                  </span>
                  <p className="line-clamp-2 text-slate-300 text-[11px] leading-relaxed">
                    {cand.visi}
                  </p>
                </div>

                {/* Top Program */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Program Unggulan:
                  </span>
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/50 p-2 rounded-lg line-clamp-2">
                    ★ {cand.programUnggulan[0]}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <button
                  id={`btn-detail-paslon-${cand.noUrut}`}
                  type="button"
                  onClick={() => onOpenDetail(cand)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visi & Profil</span>
                </button>

                {isVotingMode && onSelectPaslon && (
                  <button
                    id={`btn-coblos-paslon-${cand.noUrut}`}
                    type="button"
                    onClick={() => onSelectPaslon(cand)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>{isSelected ? '✓ Terpilih' : 'PILIH (COBLOS)'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
