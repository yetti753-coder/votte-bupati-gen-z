import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Save, 
  User, 
  Award,
  Link,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Candidate } from '../types';

interface EditCandidateModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onSave: (updatedCandidate: Candidate) => void;
}

// Koleksi Foto Potret Formal Rekomendasi (Preset Siap Pakai)
export const PRESET_AVATARS = [
  {
    category: 'Pria / Tokoh Formal',
    items: [
      {
        name: 'Jas Hitam & Dasi Formal',
        url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Eksekutif Muda / Birokrat',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Tokoh Pengusaha / Inovator',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Profesional Senior',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Akademisi / Dosen',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    category: 'Wanita / Tokoh Formal',
    items: [
      {
        name: 'Eksekutif Wanita / Hijab Formal',
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Dokter / Praktisi Kesehatan',
        url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Pemimpin Perempuan / Blazer',
        url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Profesional Muda Kreatif',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Aktivis Sosial / Komunitas',
        url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

export function EditCandidateModal({
  isOpen,
  candidate,
  onClose,
  onSave
}: EditCandidateModalProps) {
  if (!isOpen || !candidate) return null;

  // Form State
  const [namaBupati, setNamaBupati] = useState(candidate.namaBupati);
  const [gelarBupati, setGelarBupati] = useState(candidate.gelarBupati || '');
  const [fotoBupati, setFotoBupati] = useState(candidate.fotoBupati);

  const [namaWakil, setNamaWakil] = useState(candidate.namaWakil);
  const [gelarWakil, setGelarWakil] = useState(candidate.gelarWakil || '');
  const [fotoWakil, setFotoWakil] = useState(candidate.fotoWakil);

  const [slogan, setSlogan] = useState(candidate.slogan);
  const [visi, setVisi] = useState(candidate.visi);

  // Active sub-tab for selecting photos: 'url' | 'upload' | 'preset'
  const [bupatiPhotoTab, setBupatiPhotoTab] = useState<'upload' | 'url' | 'preset'>('upload');
  const [wakilPhotoTab, setWakilPhotoTab] = useState<'upload' | 'url' | 'preset'>('upload');

  const bupatiFileInputRef = useRef<HTMLInputElement>(null);
  const wakilFileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when candidate changes
  useEffect(() => {
    if (candidate) {
      setNamaBupati(candidate.namaBupati);
      setGelarBupati(candidate.gelarBupati || '');
      setFotoBupati(candidate.fotoBupati);

      setNamaWakil(candidate.namaWakil);
      setGelarWakil(candidate.gelarWakil || '');
      setFotoWakil(candidate.fotoWakil);

      setSlogan(candidate.slogan);
      setVisi(candidate.visi);
    }
  }, [candidate]);

  // Handle Local File Upload (Bupati)
  const handleBupatiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFotoBupati(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Local File Upload (Wakil)
  const handleWakilFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFotoWakil(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaBupati.trim() || !namaWakil.trim()) {
      alert('Nama Calon Bupati dan Wakil Bupati tidak boleh kosong!');
      return;
    }

    const updatedCandidate: Candidate = {
      ...candidate,
      namaBupati: namaBupati.trim(),
      gelarBupati: gelarBupati.trim(),
      fotoBupati: fotoBupati.trim(),
      namaWakil: namaWakil.trim(),
      gelarWakil: gelarWakil.trim(),
      fotoWakil: fotoWakil.trim(),
      slogan: slogan.trim(),
      visi: visi.trim()
    };

    onSave(updatedCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="edit-candidate-modal"
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-100 relative"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-['Outfit'] text-lg">
              {candidate.noUrut}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  PENGATURAN DATA PASLON NO. {candidate.noUrut}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  EDIT MODE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-['Outfit']">
                Ubah Nama & Foto Pasangan Calon
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
          {/* 2-Column Section for Bupati and Wakil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. CALON BUPATI BOX */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Calon Bupati (Nomor Urut {candidate.noUrut})
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  KEPALA DAERAH
                </span>
              </div>

              {/* Photo Preview & Upload Controls */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">Foto Calon Bupati</label>
                <div className="flex items-start gap-4">
                  {/* Live Avatar Preview */}
                  <div className="relative shrink-0">
                    <img
                      src={fotoBupati || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                      alt="Preview Bupati"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-500/60 shadow-md bg-slate-900"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback on broken URL
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                      PREVIEW
                    </span>
                  </div>

                  {/* Photo Method Tabs */}
                  <div className="flex-1 space-y-2">
                    <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setBupatiPhotoTab('upload')}
                        className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          bupatiPhotoTab === 'upload' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Unggah File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBupatiPhotoTab('preset')}
                        className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          bupatiPhotoTab === 'preset' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Preset</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBupatiPhotoTab('url')}
                        className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          bupatiPhotoTab === 'url' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Link className="w-3 h-3" />
                        <span>Link URL</span>
                      </button>
                    </div>

                    {/* Sub-Panel: Upload File */}
                    {bupatiPhotoTab === 'upload' && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                        <input
                          ref={bupatiFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBupatiFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => bupatiFileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Perangkat</span>
                        </button>
                        <p className="text-[10px] text-slate-400">
                          Format JPG, PNG, atau WEBP dari galeri/laptop Anda
                        </p>
                      </div>
                    )}

                    {/* Sub-Panel: Preset Gallery */}
                    {bupatiPhotoTab === 'preset' && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Klik salah satu foto preset:</span>
                        <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto">
                          {PRESET_AVATARS.flatMap(g => g.items).map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFotoBupati(preset.url)}
                              className={`relative rounded-lg overflow-hidden border transition cursor-pointer aspect-square ${
                                fotoBupati === preset.url ? 'border-amber-400 ring-2 ring-amber-400' : 'border-slate-700 hover:border-slate-500'
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              {fotoBupati === preset.url && (
                                <div className="absolute inset-0 bg-amber-500/40 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white font-bold" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sub-Panel: URL Link */}
                    {bupatiPhotoTab === 'url' && (
                      <div className="space-y-1">
                        <input
                          type="url"
                          placeholder="https://contoh.com/foto-bupati.jpg"
                          value={fotoBupati}
                          onChange={(e) => setFotoBupati(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Title Inputs */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nama Lengkap Calon Bupati <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Ir. H. Achmad Fauzan, M.Eng"
                  value={namaBupati}
                  onChange={(e) => setNamaBupati(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-semibold text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Gelar / Keterangan Singkat Bupati
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bupati Visioner & Akademisi Tata Ruang"
                  value={gelarBupati}
                  onChange={(e) => setGelarBupati(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* 2. CALON WAKIL BUPATI BOX */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Calon Wakil Bupati (Nomor Urut {candidate.noUrut})
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  WAKIL KEPALA DAERAH
                </span>
              </div>

              {/* Photo Preview & Upload Controls */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">Foto Calon Wakil Bupati</label>
                <div className="flex items-start gap-4">
                  {/* Live Avatar Preview */}
                  <div className="relative shrink-0">
                    <img
                      src={fotoWakil || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                      alt="Preview Wakil"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md bg-slate-900"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                      PREVIEW
                    </span>
                  </div>

                  {/* Photo Method Tabs */}
                  <div className="flex-1 space-y-2">
                    <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setWakilPhotoTab('upload')}
                        className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          wakilPhotoTab === 'upload' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Unggah File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWakilPhotoTab('preset')}
                        className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          wakilPhotoTab === 'preset' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Preset</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWakilPhotoTab('url')}
                        className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          wakilPhotoTab === 'url' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Link className="w-3 h-3" />
                        <span>Link URL</span>
                      </button>
                    </div>

                    {/* Sub-Panel: Upload File */}
                    {wakilPhotoTab === 'upload' && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                        <input
                          ref={wakilFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleWakilFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => wakilFileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Perangkat</span>
                        </button>
                        <p className="text-[10px] text-slate-400">
                          Format JPG, PNG, atau WEBP dari galeri/laptop Anda
                        </p>
                      </div>
                    )}

                    {/* Sub-Panel: Preset Gallery */}
                    {wakilPhotoTab === 'preset' && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Klik salah satu foto preset:</span>
                        <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto">
                          {PRESET_AVATARS.flatMap(g => g.items).map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFotoWakil(preset.url)}
                              className={`relative rounded-lg overflow-hidden border transition cursor-pointer aspect-square ${
                                fotoWakil === preset.url ? 'border-emerald-400 ring-2 ring-emerald-400' : 'border-slate-700 hover:border-slate-500'
                              }`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              {fotoWakil === preset.url && (
                                <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white font-bold" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sub-Panel: URL Link */}
                    {wakilPhotoTab === 'url' && (
                      <div className="space-y-1">
                        <input
                          type="url"
                          placeholder="https://contoh.com/foto-wakil.jpg"
                          value={fotoWakil}
                          onChange={(e) => setFotoWakil(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Title Inputs */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nama Lengkap Calon Wakil Bupati <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hj. Siti Rahmawati, S.E., M.Si"
                  value={namaWakil}
                  onChange={(e) => setNamaWakil(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-semibold text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Gelar / Keterangan Singkat Wakil
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Praktisi Ekonomi Kerakyatan & UMKM"
                  value={gelarWakil}
                  onChange={(e) => setGelarWakil(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Slogan & Visi Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Slogan & Visi Pasangan Calon
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Slogan / Tagline Paslon</label>
                <input
                  type="text"
                  placeholder="Contoh: Nusantara Maju, Mandiri, Berkelanjutan"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-200 italic font-medium text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Visi Utama Paslon</label>
                <textarea
                  rows={2}
                  placeholder="Visi pembangunan daerah..."
                  value={visi}
                  onChange={(e) => setVisi(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400">
              Perubahan akan langsung diperbarui di Bilik Suara, Kartu Suara, dan Berita Acara.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
