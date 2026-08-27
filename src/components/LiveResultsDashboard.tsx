import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Users, 
  Vote, 
  CheckCircle2, 
  Filter, 
  Download, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Search,
  Printer,
  ChevronRight,
  TrendingUp,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { Candidate, Voter, VoteRecord } from '../types';
import { KABUPATEN_NAME, ELECTION_YEAR, KECAMATAN_LIST } from '../data/initialData';
import { formatDateTimeIndo } from '../utils/crypto';

interface LiveResultsDashboardProps {
  candidates: Candidate[];
  voters: Voter[];
  votes: VoteRecord[];
  onOpenReportModal: () => void;
}

export function LiveResultsDashboard({
  candidates,
  voters,
  votes,
  onOpenReportModal
}: LiveResultsDashboardProps) {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('SEMUA');
  const [searchTPS, setSearchTPS] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'ringkasan' | 'kecamatan' | 'tps' | 'audit_live'>('ringkasan');

  // Filtered votes by Kecamatan if selected
  const filteredVotes = useMemo(() => {
    if (selectedKecamatan === 'SEMUA') return votes;
    return votes.filter(v => v.kecamatan === selectedKecamatan);
  }, [votes, selectedKecamatan]);

  const totalDPT = voters.length;
  const totalSuaraMasuk = votes.length;
  const partisipasiPersen = totalDPT > 0 ? ((totalSuaraMasuk / totalDPT) * 100).toFixed(1) : '0';
  const totalBelumMemilih = Math.max(0, totalDPT - totalSuaraMasuk);

  // Candidate tallies
  const candidateStats = useMemo(() => {
    return candidates.map(cand => {
      const voteCount = filteredVotes.filter(v => v.candidateId === cand.id).length;
      const percentage = filteredVotes.length > 0 ? ((voteCount / filteredVotes.length) * 100).toFixed(1) : '0.0';
      return {
        ...cand,
        voteCount,
        percentage: parseFloat(percentage)
      };
    }).sort((a, b) => b.voteCount - a.voteCount);
  }, [candidates, filteredVotes]);

  // Data for Charts
  const pieData = useMemo(() => {
    return candidateStats.map(c => ({
      name: `Paslon ${c.noUrut}`,
      fullName: `${c.namaBupati} & ${c.namaWakil}`,
      value: c.voteCount,
      percentage: c.percentage,
      color: c.noUrut === '01' ? '#10b981' : c.noUrut === '02' ? '#3b82f6' : '#f59e0b'
    }));
  }, [candidateStats]);

  // Breakdown per Kecamatan for BarChart
  const kecamatanBarData = useMemo(() => {
    return KECAMATAN_LIST.map(kec => {
      const kecVotes = votes.filter(v => v.kecamatan === kec);
      const row: Record<string, any> = {
        kecamatan: kec.replace('Kecamatan ', ''),
        total: kecVotes.length,
      };
      candidates.forEach(cand => {
        row[`Paslon ${cand.noUrut}`] = kecVotes.filter(v => v.candidateId === cand.id).length;
      });
      return row;
    });
  }, [votes, candidates]);

  // Grouped by TPS for table view
  const tpsData = useMemo(() => {
    const map = new Map<string, { kecamatan: string; desa: string; tps: string; votesByPaslon: Record<string, number>; total: number }>();

    votes.forEach(v => {
      const key = `${v.kecamatan}-${v.tps}`;
      if (!map.has(key)) {
        map.set(key, {
          kecamatan: v.kecamatan,
          desa: v.kelurahanDesa,
          tps: v.tps,
          votesByPaslon: { '01': 0, '02': 0, '03': 0 },
          total: 0
        });
      }
      const entry = map.get(key)!;
      entry.votesByPaslon[v.noUrut] = (entry.votesByPaslon[v.noUrut] || 0) + 1;
      entry.total += 1;
    });

    let list = Array.from(map.values());
    if (selectedKecamatan !== 'SEMUA') {
      list = list.filter(item => item.kecamatan === selectedKecamatan);
    }
    if (searchTPS.trim()) {
      const query = searchTPS.toLowerCase();
      list = list.filter(item => 
        item.tps.toLowerCase().includes(query) || 
        item.desa.toLowerCase().includes(query) ||
        item.kecamatan.toLowerCase().includes(query)
      );
    }
    return list;
  }, [votes, selectedKecamatan, searchTPS]);

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'NO,KECAMATAN,DESA_KELURAHAN,TPS,PASLON_01,PASLON_02,PASLON_03,TOTAL_SUARA\n';

    tpsData.forEach((row, index) => {
      csvContent += `${index + 1},"${row.kecamatan}","${row.desa}","${row.tps}",${row.votesByPaslon['01'] || 0},${row.votesByPaslon['02'] || 0},${row.votesByPaslon['03'] || 0},${row.total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekapitulasi-pilbup-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="live-results-dashboard" className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Top Banner with Real Count Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              REAL COUNT TERDESENTRALISASI & TERVERIFIKASI
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Dashboard Hasil Pemilihan Bupati
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Data rekapitulasi perolehan suara resmi Pemilihan Bupati {KABUPATEN_NAME} {ELECTION_YEAR}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV / Excel</span>
          </button>

          <button
            id="btn-cetak-berita-acara"
            onClick={onOpenReportModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Berita Acara Model C1</span>
          </button>
        </div>
      </div>

      {/* Top 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total DPT */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Pemilih (DPT)</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono font-['Outfit']">
            {totalDPT.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Daftar Pemilih Terdaftar</p>
        </div>

        {/* Total Suara Masuk */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Suara Sah Masuk</span>
            <Vote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono font-['Outfit']">
            {totalSuaraMasuk.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Telah diverifikasi & dicatat</p>
        </div>

        {/* Partisipasi Pemilih */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tingkat Partisipasi</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono font-['Outfit']">
            {partisipasiPersen}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, parseFloat(partisipasiPersen))}%` }}
            ></div>
          </div>
        </div>

        {/* Belum Memilih */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Belum Memilih</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-mono font-['Outfit']">
            {totalBelumMemilih.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">DPT yang belum menggunakan hak</p>
        </div>
      </div>

      {/* Filter by Kecamatan & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 pl-1">
            <Filter className="w-3.5 h-3.5" /> Wilayah:
          </span>
          <button
            onClick={() => setSelectedKecamatan('SEMUA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedKecamatan === 'SEMUA'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Semua Wilayah ({votes.length})
          </button>
          {KECAMATAN_LIST.map((kec) => {
            const count = votes.filter(v => v.kecamatan === kec).length;
            return (
              <button
                key={kec}
                onClick={() => setSelectedKecamatan(kec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedKecamatan === kec
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {kec.replace('Kecamatan ', '')} ({count})
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveViewMode('ringkasan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeViewMode === 'ringkasan' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveViewMode('kecamatan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeViewMode === 'kecamatan' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Grafik Kecamatan
          </button>
          <button
            onClick={() => setActiveViewMode('tps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeViewMode === 'tps' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rekap TPS
          </button>
        </div>
      </div>

      {/* Main Results View */}
      {activeViewMode === 'ringkasan' && (
        <div className="space-y-6">
          {/* Candidates Scoreboard Ranking Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidateStats.map((cand, index) => {
              const isLeading = index === 0 && cand.voteCount > 0;

              return (
                <div
                  key={cand.id}
                  className={`relative bg-slate-900 border rounded-3xl p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    isLeading
                      ? 'border-amber-500/80 ring-2 ring-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  {isLeading && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                      ★ PEROLEHAN SUARA TERTINGGI SEMENTARA
                    </div>
                  )}

                  <div>
                    {/* Header Urut & Percentage */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-700 text-amber-400 font-extrabold flex items-center justify-center text-lg font-['Outfit'] shadow">
                          {cand.noUrut}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            PASLON NO. {cand.noUrut}
                          </span>
                          <h3 className="text-sm font-extrabold text-white line-clamp-1">
                            {cand.namaBupati}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Photos duo */}
                    <div className="flex justify-center gap-2 mb-4">
                      <img
                        src={cand.fotoBupati}
                        alt={cand.namaBupati}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <img
                        src={cand.fotoWakil}
                        alt={cand.namaWakil}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center text-xs text-slate-300 mb-4">
                      <p className="font-bold text-white">{cand.namaBupati}</p>
                      <p className="text-slate-400">& {cand.namaWakil}</p>
                    </div>

                    {/* Vote Count & Large Percentage Display */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-1 mb-4">
                      <div className="text-3xl font-black text-white font-mono tracking-tight font-['Outfit']">
                        {cand.percentage.toFixed(1)}%
                      </div>
                      <p className="text-xs text-amber-400 font-mono font-bold">
                        {cand.voteCount.toLocaleString('id-ID')} Suara Sah
                      </p>
                    </div>

                    {/* Percentage Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cand.noUrut === '01'
                            ? 'bg-emerald-500'
                            : cand.noUrut === '02'
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, cand.percentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Koalisi:</span>
                    <span className="font-bold text-slate-300">
                      {cand.partaiPengusung.map(p => p.singkatan).join(', ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distribution Chart & Quick Count Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-amber-400" />
                  Proporsi Perolehan Suara
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Distribusi persentase perolehan suara antar pasangan calon
                </p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                        formatter={(val: any, name: any, item: any) => [
                          `${val} Suara (${item.payload.percentage}%)`,
                          item.payload.fullName
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-bold text-slate-200">{item.name}:</span>
                      <span className="text-slate-400 truncate max-w-[140px]">{item.fullName}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{item.value} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Encrypted Ballot Stream Log */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      Feed Suara Masuk Real-Time (Audit Ledger)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Suara terenkripsi yang masuk ke database tanpa mengungkap identitas
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    LIVE
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {votes.slice(-6).reverse().map((v, i) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{v.id}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-200">{v.tps}</span>
                          <span className="text-[10px] text-slate-400">({v.kecamatan.replace('Kecamatan ', '')})</span>
                        </div>
                        <p className="font-mono text-[10px] text-emerald-400/80 truncate">
                          HASH: {v.ballotHash}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {formatDateTimeIndo(v.timestamp).split(',')[1]}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          TERVERIFIKASI
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Kerahasiaan Suara Dijamin Asas LUBER JURDIL
                </span>
                <span className="font-mono text-slate-300">
                  {votes.length} Total Transaksi Suara
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kecamatan Breakdown Bar Chart */}
      {activeViewMode === 'kecamatan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                Perolehan Suara Per Kecamatan
              </h3>
              <p className="text-xs text-slate-400">
                Grafik komparasi perolehan suara masing-masing pasangan calon di 5 wilayah kecamatan
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              5 Kecamatan Terdata
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kecamatanBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="kecamatan" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="Paslon 01" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paslon 02" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paslon 03" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Rekapitulasi per TPS Table View */}
      {activeViewMode === 'tps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Tabel Rekapitulasi TPS
              </h3>
              <p className="text-xs text-slate-400">
                Rincian suara perolehan Paslon berdasarkan Tempat Pemungutan Suara (TPS)
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari TPS atau Desa..."
                value={searchTPS}
                onChange={(e) => setSearchTPS(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Kecamatan</th>
                  <th className="py-3 px-4">Kelurahan/Desa</th>
                  <th className="py-3 px-4">TPS</th>
                  <th className="py-3 px-4 text-center text-emerald-400">Paslon 01</th>
                  <th className="py-3 px-4 text-center text-blue-400">Paslon 02</th>
                  <th className="py-3 px-4 text-center text-amber-400">Paslon 03</th>
                  <th className="py-3 px-4 text-right">Total Suara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tpsData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                      Tidak ada data TPS yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  tpsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-sans text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{row.kecamatan}</td>
                      <td className="py-3 px-4 font-sans text-slate-300">{row.desa}</td>
                      <td className="py-3 px-4 font-bold text-amber-400">{row.tps}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">
                        {row.votesByPaslon['01'] || 0}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-400">
                        {row.votesByPaslon['02'] || 0}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-400">
                        {row.votesByPaslon['03'] || 0}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        {row.total}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
