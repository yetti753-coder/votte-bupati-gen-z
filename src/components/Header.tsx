import { useState, useEffect } from 'react';
import { 
  Vote, 
  ShieldCheck, 
  BarChart3, 
  UserCheck, 
  Lock, 
  Award,
  Clock,
  Sparkles,
  LogOut,
  Info
} from 'lucide-react';
import { ActiveTab, Voter } from '../types';
import { KABUPATEN_NAME, ELECTION_YEAR } from '../data/initialData';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentVoter: Voter | null;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenSecurityModal: () => void;
  onQuickDemoSelect: (type: 'belum' | 'sudah' | 'admin') => void;
}

export function Header({
  activeTab,
  setActiveTab,
  currentVoter,
  isAdmin,
  onLogout,
  onOpenSecurityModal,
  onQuickDemoSelect
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        new Intl.DateTimeFormat('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(now) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-red-900/80 via-slate-900 to-amber-950/80 border-b border-red-800/30 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SISTEM LIVE & TERVERIFIKASI
            </span>
            <span className="hidden sm:inline text-slate-300">
              Komisi Pemilihan Umum Daerah • Asas LUBER JURDIL
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeStr || 'Memuat waktu...'}</span>
            </div>

            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[11px] text-slate-400">Mode Cepat:</span>
              <button
                id="btn-demo-voter-new"
                onClick={() => onQuickDemoSelect('belum')}
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                title="Masuk sebagai Pemilih Belum Memilih"
              >
                Pemilih Baru
              </button>
              <span className="text-slate-600">|</span>
              <button
                id="btn-demo-voter-done"
                onClick={() => onQuickDemoSelect('sudah')}
                className="text-[11px] font-medium text-amber-400 hover:text-amber-300 underline cursor-pointer"
                title="Masuk sebagai Pemilih Sudah Memilih"
              >
                Sudah Coblos
              </button>
              <span className="text-slate-600">|</span>
              <button
                id="btn-demo-admin"
                onClick={() => onQuickDemoSelect('admin')}
                className="text-[11px] font-medium text-blue-400 hover:text-blue-300 underline cursor-pointer"
                title="Masuk ke Panel Admin KPUD"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Regency Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-red-600 to-slate-950 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Vote className="w-6 h-6 text-amber-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Outfit']">
                  E-VOTING <span className="text-amber-400">PILBUP</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {ELECTION_YEAR}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {KABUPATEN_NAME}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            <button
              id="nav-tab-bilik-suara"
              onClick={() => setActiveTab('bilik_suara')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bilik_suara'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Vote className="w-4 h-4" />
              Bilik Suara
            </button>

            <button
              id="nav-tab-kandidat"
              onClick={() => setActiveTab('kandidat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'kandidat'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Award className="w-4 h-4" />
              Profil Paslon
            </button>

            <button
              id="nav-tab-hasil"
              onClick={() => setActiveTab('hasil_suara')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hasil_suara'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Quick & Real Count
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab('admin_panel')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'admin_panel'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Lock className="w-4 h-4" />
              Panel KPUD
            </button>
          </nav>

          {/* User Session / Security Trigger */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-security-info"
              onClick={onOpenSecurityModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="Informasi Arsitektur Keamanan LUBER JURDIL"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Keamanan Enkripsi</span>
            </button>

            {currentVoter ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-200 leading-tight">
                    {currentVoter.nama}
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                    <UserCheck className="w-3 h-3" />
                    {currentVoter.tps} • {currentVoter.kecamatan.replace('Kecamatan ', '')}
                  </p>
                </div>
                <button
                  id="btn-logout-voter"
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/40 text-xs transition cursor-pointer"
                  title="Keluar dari sesi pemilih"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdmin ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <span className="px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50 text-xs font-bold font-mono">
                  ADMIN KPUD
                </span>
                <button
                  id="btn-logout-admin"
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition cursor-pointer"
                  title="Keluar mode admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-masuk-pemilih-header"
                onClick={() => setActiveTab('bilik_suara')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Vote className="w-4 h-4" />
                <span>Masuk Bilik</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-800 text-[11px] overflow-x-auto">
          <button
            onClick={() => setActiveTab('bilik_suara')}
            className={`flex-1 py-1.5 px-2 rounded font-semibold text-center whitespace-nowrap ${
              activeTab === 'bilik_suara' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Bilik Suara
          </button>
          <button
            onClick={() => setActiveTab('kandidat')}
            className={`flex-1 py-1.5 px-2 rounded font-semibold text-center whitespace-nowrap ${
              activeTab === 'kandidat' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Paslon
          </button>
          <button
            onClick={() => setActiveTab('hasil_suara')}
            className={`flex-1 py-1.5 px-2 rounded font-semibold text-center whitespace-nowrap ${
              activeTab === 'hasil_suara' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Hasil Suara
          </button>
          <button
            onClick={() => setActiveTab('admin_panel')}
            className={`flex-1 py-1.5 px-2 rounded font-semibold text-center whitespace-nowrap ${
              activeTab === 'admin_panel' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Admin KPUD
          </button>
        </div>
      </div>
    </header>
  );
}
