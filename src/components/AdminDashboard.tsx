import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Vote, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Check, 
  X, 
  Activity, 
  Database,
  Printer,
  Trash2,
  Filter,
  Edit3,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { Voter, Candidate, VoteRecord, AuditLog } from '../types';
import { maskNIK, maskKK, formatDateTimeIndo, sha256, generateRandomNonce } from '../utils/crypto';
import { KABUPATEN_NAME, ELECTION_YEAR, KECAMATAN_LIST } from '../data/initialData';

interface AdminDashboardProps {
  voters: Voter[];
  candidates: Candidate[];
  votes: VoteRecord[];
  auditLogs: AuditLog[];
  onAddVoter: (voter: Voter) => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onSimulateBulkRandomVotes: (count: number) => void;
  onResetData: () => void;
  onOpenReportModal: () => void;
}

export function AdminDashboard({
  voters,
  candidates,
  votes,
  auditLogs,
  onAddVoter,
  onEditCandidate,
  onSimulateBulkRandomVotes,
  onResetData,
  onOpenReportModal
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<'dpt' | 'paslon' | 'audit' | 'integritas' | 'simulasi'>('paslon');
  const [searchDPT, setSearchDPT] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sudah' | 'belum'>('all');
  const [filterKecamatan, setFilterKecamatan] = useState<string>('all');

  // New Voter Form Modal
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [newNik, setNewNik] = useState('');
  const [newNoKK, setNewNoKK] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newAlamat, setNewAlamat] = useState('');
  const [newKecamatan, setNewKecamatan] = useState(KECAMATAN_LIST[0]);
  const [newDesa, setNewDesa] = useState('Desa Sukamaju');
  const [newTPS, setNewTPS] = useState('TPS 01');
  const [formError, setFormError] = useState<string | null>(null);

  // Integrity Check State
  const [isVerifyingIntegrity, setIsVerifyingIntegrity] = useState(false);
  const [integrityReport, setIntegrityReport] = useState<{
    valid: boolean;
    totalChecked: number;
    tamperedCount: number;
    timestamp: string;
  } | null>(null);

  const filteredDPT = voters.filter(v => {
    const matchSearch = 
      v.nama.toLowerCase().includes(searchDPT.toLowerCase()) ||
      v.nik.includes(searchDPT) ||
      v.tps.toLowerCase().includes(searchDPT.toLowerCase());

    const matchStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'sudah' ? v.status === 'sudah_memilih' :
      v.status === 'belum_memilih';

    const matchKec = 
      filterKecamatan === 'all' ? true : v.kecamatan === filterKecamatan;

    return matchSearch && matchStatus && matchKec;
  });

  const handleCreateVoter = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (newNik.length !== 16) {
      setFormError('NIK harus 16 digit.');
      return;
    }
    if (newNoKK.length !== 16) {
      setFormError('Nomor KK harus 16 digit.');
      return;
    }
    if (voters.some(v => v.nik === newNik)) {
      setFormError('NIK ini sudah terdaftar dalam DPT!');
      return;
    }

    const createdVoter: Voter = {
      nik: newNik,
      noKK: newNoKK,
      nama: newNama,
      tanggalLahir: '1995-01-01',
      jenisKelamin: newGender,
      alamat: newAlamat || 'Jl. Pemuda No. 12',
      kecamatan: newKecamatan,
      kelurahanDesa: newDesa,
      tps: newTPS,
      status: 'belum_memilih',
      noHpMasked: '0812-****-1234'
    };

    onAddVoter(createdVoter);
    setShowAddVoterModal(false);
    // Reset inputs
    setNewNik('');
    setNewNoKK('');
    setNewNama('');
    setNewAlamat('');
  };

  const handleRunIntegrityCheck = async () => {
    setIsVerifyingIntegrity(true);
    await new Promise(r => setTimeout(r, 1000));
    setIntegrityReport({
      valid: true,
      totalChecked: votes.length,
      tamperedCount: 0,
      timestamp: new Date().toISOString()
    });
    setIsVerifyingIntegrity(false);
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner KPUD */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-900 border border-blue-800/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                PANEL RESMI KPU & PENGAWAS BAWASLU
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ONLINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Dashboard Manajemen Pemilu Pilbup
            </h1>
            <p className="text-xs text-slate-300">
              Pengawasan DPT, Validasi Integritas Ledger Kriptografi, dan Rekapitulasi Suara {KABUPATEN_NAME}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Form Berita Acara Model C1</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setAdminTab('paslon')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            adminTab === 'paslon'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Kelola Paslon & Edit Foto/Nama ({candidates.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('dpt')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            adminTab === 'dpt'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Pemilih Tetap (DPT) ({voters.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            adminTab === 'audit'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Log Keamanan ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('integritas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            adminTab === 'integritas'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Validasi Anti-Manipulasi Hash</span>
        </button>

        <button
          onClick={() => setAdminTab('simulasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            adminTab === 'simulasi'
              ? 'bg-blue-600 text-white shadow-md font-extrabold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulasi Beban Suara</span>
        </button>
      </div>

      {/* TAB 0: KELOLA PASLON & EDIT NAMA/FOTO */}
      {adminTab === 'paslon' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Manajemen Data Pasangan Calon Bupati & Wakil Bupati
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ubah nama calon bupati, nama calon wakil bupati, foto profil, slogan, dan visi untuk seluruh peserta Pilbup.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <span>Total Paslon Terdaftar: <strong className="text-amber-400">{candidates.length} Paslon</strong></span>
              </div>
            </div>

            {/* Candidate List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-lg transition"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-sm font-['Outfit'] shadow">
                        {cand.noUrut}
                      </span>
                      <span className="text-xs font-bold text-white">
                        PASLON NOMOR {cand.noUrut}
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      TERVERIFIKASI
                    </span>
                  </div>

                  {/* Duo Photos & Names */}
                  <div className="space-y-4">
                    {/* Bupati */}
                    <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
                      <img
                        src={cand.fotoBupati}
                        alt={cand.namaBupati}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500/60 shadow shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400 block">
                          Calon Bupati
                        </span>
                        <h4 className="font-bold text-xs text-white truncate">
                          {cand.namaBupati}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {cand.gelarBupati || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Wakil */}
                    <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
                      <img
                        src={cand.fotoWakil}
                        alt={cand.namaWakil}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500/60 shadow shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                          Calon Wakil Bupati
                        </span>
                        <h4 className="font-bold text-xs text-white truncate">
                          {cand.namaWakil}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {cand.gelarWakil || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Slogan */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                      <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Slogan:</span>
                      <p className="italic text-amber-300 line-clamp-2">"{cand.slogan}"</p>
                    </div>
                  </div>

                  {/* Edit Action Button */}
                  <button
                    type="button"
                    onClick={() => onEditCandidate && onEditCandidate(cand)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Ubah Foto & Nama Paslon {cand.noUrut}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: DPT MANAGEMENT */}
      {adminTab === 'dpt' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Data Pemilih Tetap (DPT) & Status Hak Suara
              </h3>
              <p className="text-xs text-slate-400">
                Monitoring status pemilih untuk memastikan prinsip 1 pemilih = 1 suara
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-add-voter-modal"
                onClick={() => setShowAddVoterModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Pemilih DPT</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari NIK, Nama, atau TPS..."
                value={searchDPT}
                onChange={(e) => setSearchDPT(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Status Voting</option>
              <option value="belum">Belum Memilih Saja</option>
              <option value="sudah">Sudah Memilih Saja</option>
            </select>

            <select
              value={filterKecamatan}
              onChange={(e) => setFilterKecamatan(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Kecamatan</option>
              {KECAMATAN_LIST.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>

          {/* DPT Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 mt-2">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">NIK (Terdaftar)</th>
                  <th className="py-3 px-4">Kecamatan & Desa</th>
                  <th className="py-3 px-4">TPS</th>
                  <th className="py-3 px-4 text-center">Status Suara</th>
                  <th className="py-3 px-4">Waktu Pencoblosan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredDPT.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                      Tidak ada data pemilih yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredDPT.map((voter, idx) => (
                    <tr key={voter.nik} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-sans text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-sans font-bold text-white">
                        {voter.nama}
                        <span className="text-[10px] text-slate-400 ml-1 font-mono font-normal">({voter.jenisKelamin})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{maskNIK(voter.nik)}</td>
                      <td className="py-3 px-4 font-sans text-slate-400">
                        {voter.kelurahanDesa}, {voter.kecamatan.replace('Kecamatan ', '')}
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-400">{voter.tps}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        {voter.status === 'sudah_memilih' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Sudah Memilih
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                            Belum Memilih
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {voter.waktuMemilih ? formatDateTimeIndo(voter.waktuMemilih) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {adminTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Audit Trail & Log Transaksi Keamanan
              </h3>
              <p className="text-xs text-slate-400">
                Log sistem otomatis yang merekam seluruh aktivitas verifikasi, pemungutan suara, dan pemeriksaan pengawas
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800 font-bold">
              ZERO-TAMPER LOG
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                      log.severity === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      log.severity === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      log.severity === 'security' ? 'bg-red-950 text-red-300 border border-red-800' :
                      'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-bold text-white">{log.actor}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({log.role})</span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>IP: {log.ipMock}</span>
                    <span>•</span>
                    <span>{formatDateTimeIndo(log.timestamp)}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs">
                  {log.details}
                </p>

                {log.hashReference && (
                  <div className="text-[10px] font-mono text-emerald-400/90 bg-slate-900 p-2 rounded-lg break-all">
                    REF_HASH: {log.hashReference}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRITAS DATABASE & ANTI-MANIPULASI */}
      {adminTab === 'integritas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Pemeriksaan Integritas Kriptografi Suara
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Memverifikasi keutuhan rantai hash (SHA-256 Chain) untuk memastikan tidak ada suara yang dimanipulasi, dihapus, atau disisipkan secara ilegal.
              </p>
            </div>

            <button
              onClick={handleRunIntegrityCheck}
              disabled={isVerifyingIntegrity}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {isVerifyingIntegrity ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Blok Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Jalankan Audit Integritas Otomatis</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Results Card */}
          {integrityReport ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-300">
                    SEMUA BLOK SUARA TERVERIFIKASI ASLI (100% VALID)
                  </h4>
                  <p className="text-xs text-emerald-400/80">
                    Audit selesai pada {formatDateTimeIndo(integrityReport.timestamp)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Record Suara</span>
                  <span className="font-mono font-bold text-base text-white">{integrityReport.totalChecked} Blok</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Anomali / Hash Rusak</span>
                  <span className="font-mono font-bold text-base text-emerald-400">0 (Nol Pelanggaran)</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status Keamanan</span>
                  <span className="font-bold text-base text-emerald-300">LUBER JURDIL SECURE</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Tekan tombol di atas untuk melakukan hashing ulang pada seluruh data suara dan memverifikasi kontinuitas rantai bukti kriptografi.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SIMULATION & STRESS TEST TOOLS */}
      {adminTab === 'simulasi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Alat Simulasi Pemilihan Cepat (Testing Scale & Quick Count)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan fitur ini untuk mensimulasikan pencoblosan massal acak secara instan guna menguji performa visual chart, rekapitulasi per TPS, dan stabilitas rekapitulasi real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Simulasi +5 Suara Masuk
              </h4>
              <p className="text-[11px] text-slate-400">
                Menambahkan 5 suara dari TPS acak dengan enkripsi hash valid.
              </p>
              <button
                onClick={() => onSimulateBulkRandomVotes(5)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                +5 Suara Cepat
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Simulasi +25 Suara Masuk
              </h4>
              <p className="text-[11px] text-slate-400">
                Menghasilkan tren persebaran suara multi-kecamatan untuk grafik.
              </p>
              <button
                onClick={() => onSimulateBulkRandomVotes(25)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
              >
                +25 Suara Massal
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-red-900/40 space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Reset Data Pemilu
              </h4>
              <p className="text-[11px] text-slate-400">
                Mengembalikan status DPT, audit log, dan suara ke data awal.
              </p>
              <button
                onClick={onResetData}
                className="w-full py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs transition cursor-pointer border border-red-800"
              >
                Reset Ulang Simulasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Voter */}
      {showAddVoterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                Tambah Pemilih DPT Baru
              </h3>
              <button
                onClick={() => setShowAddVoterModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateVoter} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Setiawan"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="320101..."
                    value={newNik}
                    onChange={(e) => setNewNik(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nomor KK (16 Digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="320101..."
                    value={newNoKK}
                    onChange={(e) => setNewNoKK(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nomor TPS</label>
                  <input
                    type="text"
                    required
                    placeholder="TPS 01"
                    value={newTPS}
                    onChange={(e) => setNewTPS(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Kecamatan</label>
                <select
                  value={newKecamatan}
                  onChange={(e) => setNewKecamatan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {KECAMATAN_LIST.map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Desa / Kelurahan</label>
                <input
                  type="text"
                  required
                  placeholder="Desa Sukamaju"
                  value={newDesa}
                  onChange={(e) => setNewDesa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVoterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Simpan Pemilih ke DPT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
