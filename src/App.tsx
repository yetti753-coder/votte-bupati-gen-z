import { useState, useEffect } from 'react';
import { 
  Voter, 
  Candidate, 
  VoteRecord, 
  AuditLog, 
  ActiveTab 
} from './types';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_VOTERS, 
  INITIAL_VOTES, 
  INITIAL_AUDIT_LOGS,
  KABUPATEN_NAME,
  ELECTION_YEAR,
  KECAMATAN_LIST
} from './data/initialData';
import { Header } from './components/Header';
import { VoterVerification } from './components/VoterVerification';
import { CandidateCards } from './components/CandidateCards';
import { CandidateModal } from './components/CandidateModal';
import { EditCandidateModal } from './components/EditCandidateModal';
import { VotingBooth } from './components/VotingBooth';
import { DigitalReceipt } from './components/DigitalReceipt';
import { LiveResultsDashboard } from './components/LiveResultsDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SecurityArchitectureModal } from './components/SecurityArchitectureModal';
import { OfficialReportModal } from './components/OfficialReportModal';
import { sha256, generateRandomNonce } from './utils/crypto';
import { ShieldCheck, Vote, Award, BarChart3, AlertCircle } from 'lucide-react';

export default function App() {
  // Application State with LocalStorage fallbacks
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('pilbup_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  const [voters, setVoters] = useState<Voter[]>(() => {
    const saved = localStorage.getItem('pilbup_voters');
    return saved ? JSON.parse(saved) : INITIAL_VOTERS;
  });
  const [votes, setVotes] = useState<VoteRecord[]>(() => {
    const saved = localStorage.getItem('pilbup_votes');
    return saved ? JSON.parse(saved) : INITIAL_VOTES;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('pilbup_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // UI Navigation & Session State
  const [activeTab, setActiveTab] = useState<ActiveTab>('bilik_suara');
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [justVotedReceipt, setJustVotedReceipt] = useState<{
    voter: Voter;
    ballotHash: string;
  } | null>(null);

  // Modals
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<Candidate | null>(null);
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showOfficialReportModal, setShowOfficialReportModal] = useState(false);

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('pilbup_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('pilbup_voters', JSON.stringify(voters));
  }, [voters]);

  useEffect(() => {
    localStorage.setItem('pilbup_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('pilbup_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Handle Candidate Updates (Ubah Nama & Foto Paslon)
  const handleUpdateCandidate = (updated: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
    
    // Also log audit event
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'UPDATE_DATA_PASLON',
      actor: 'Admin KPUD',
      role: 'ADMIN_KPUD',
      details: `Perubahan data Paslon No. ${updated.noUrut}: Calon Bupati "${updated.namaBupati}" & Wakil "${updated.namaWakil}".`,
      ipMock: '192.168.1.10',
      severity: 'info'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handle Voter Authentication
  const handleVoterVerified = (voter: Voter) => {
    setCurrentVoter(voter);
    setIsAdmin(false);

    // If voter has already voted, directly show their receipt & restrict voting
    if (voter.status === 'sudah_memilih') {
      setJustVotedReceipt({
        voter,
        ballotHash: voter.tokenBuktiHash || 'a7c9f823e41b9d0e21a78345c6b90123fe45d6789abc1234def5678901234567'
      });
    } else {
      setJustVotedReceipt(null);
    }
    setActiveTab('bilik_suara');

    // Add Audit Log
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'AUTENTIKASI_PEMILIH_BERHASIL',
      actor: `Pemilih NIK ${voter.nik.slice(0, 4)}...${voter.nik.slice(-4)}`,
      role: 'PEMILIH',
      details: `Verifikasi identitas DPT sukses di ${voter.tps} (${voter.kecamatan}).`,
      ipMock: `180.252.${Math.floor(10 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 80)}`,
      severity: 'info'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handle Vote Submission from Voting Booth
  const handleVoteSubmitted = (newVote: VoteRecord, ballotHash: string) => {
    if (!currentVoter) return;

    const timestamp = new Date().toISOString();

    // 1. Update Voter status to SUDAH MEMILIH
    const updatedVoter: Voter = {
      ...currentVoter,
      status: 'sudah_memilih',
      waktuMemilih: timestamp,
      tokenBuktiHash: ballotHash
    };

    setVoters(prev => prev.map(v => v.nik === currentVoter.nik ? updatedVoter : v));
    setCurrentVoter(updatedVoter);

    // 2. Append to Anonymous Vote Ledger
    setVotes(prev => [...prev, newVote]);

    // 3. Create Audit Log
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp,
      action: 'PENCOBLOSAN_SUARA_TERKUNCI',
      actor: `Pemilih Anonim ${currentVoter.tps}`,
      role: 'SISTEM_ENKRIPSI',
      details: `1 Suara sah berhasil dicatat dengan SHA-256 Hash Chain di ${currentVoter.kecamatan}. Identitas pemilih terputus.`,
      ipMock: `180.252.${Math.floor(10 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 80)}`,
      hashReference: ballotHash,
      severity: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // 4. Show Digital Receipt
    setJustVotedReceipt({
      voter: updatedVoter,
      ballotHash
    });
  };

  // Add new voter from Admin panel
  const handleAddVoter = (newVoter: Voter) => {
    setVoters(prev => [newVoter, ...prev]);
    const log: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'PENAMBAHAN_DPT_BARU',
      actor: 'Admin KPUD',
      role: 'ADMIN_KPUD',
      details: `Pemilih baru (${newVoter.nama} - ${newVoter.tps}) ditambahkan ke database DPT.`,
      ipMock: '192.168.1.10',
      severity: 'info'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Simulate Bulk Random Votes
  const handleSimulateBulkRandomVotes = async (count: number) => {
    const newVotesList: VoteRecord[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const randomCand = candidates[Math.floor(Math.random() * candidates.length)];
      const randomKec = KECAMATAN_LIST[Math.floor(Math.random() * KECAMATAN_LIST.length)];
      const randomTPS = `TPS 0${Math.floor(1 + Math.random() * 9)}`;
      const rawData = `${randomCand.id}-${randomKec}-${randomTPS}-${now}-${i}`;
      const ballotHash = await sha256(rawData);

      newVotesList.push({
        id: `VOTE-SIM-${now}-${i + 1}`,
        candidateId: randomCand.id,
        noUrut: randomCand.noUrut,
        kecamatan: randomKec,
        kelurahanDesa: `Kelurahan ${randomKec.replace('Kecamatan ', '')}`,
        tps: randomTPS,
        timestamp: new Date(now - (count - i) * 60000).toISOString(),
        ballotHash,
        previousHash: 'chain-block-' + (now - i).toString(16),
        verificationNonce: `NONCE-${generateRandomNonce(6)}`,
        isVerified: true
      });
    }

    setVotes(prev => [...prev, ...newVotesList]);

    const log: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'SIMULASI_SUARA_MASSAL',
      actor: 'Sistem Pengujian Beban KPUD',
      role: 'SISTEM_ENKRIPSI',
      details: `${count} Suara simulasi terenkripsi berhasil diinjeksi ke ledger untuk pengujian dashboard.`,
      ipMock: '127.0.0.1',
      severity: 'warning'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Reset demo data
  const handleResetData = () => {
    localStorage.removeItem('pilbup_candidates');
    localStorage.removeItem('pilbup_voters');
    localStorage.removeItem('pilbup_votes');
    localStorage.removeItem('pilbup_audit');
    setCandidates(INITIAL_CANDIDATES);
    setVoters(INITIAL_VOTERS);
    setVotes(INITIAL_VOTES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentVoter(null);
    setJustVotedReceipt(null);
    setIsAdmin(false);
    setActiveTab('bilik_suara');
  };

  // Logout session
  const handleLogout = () => {
    setCurrentVoter(null);
    setJustVotedReceipt(null);
    setIsAdmin(false);
    setActiveTab('bilik_suara');
  };

  // Quick Demo Preset Switcher
  const handleQuickDemoSelect = (type: 'belum' | 'sudah' | 'admin') => {
    if (type === 'belum') {
      const voter = voters.find(v => v.status === 'belum_memilih') || voters[0];
      handleVoterVerified(voter);
      setActiveTab('bilik_suara');
    } else if (type === 'sudah') {
      const voter = voters.find(v => v.status === 'sudah_memilih') || voters[5];
      handleVoterVerified(voter);
      setActiveTab('bilik_suara');
    } else if (type === 'admin') {
      setIsAdmin(true);
      setCurrentVoter(null);
      setJustVotedReceipt(null);
      setActiveTab('admin_panel');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentVoter={currentVoter}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onOpenSecurityModal={() => setShowSecurityModal(true)}
        onQuickDemoSelect={handleQuickDemoSelect}
      />

      {/* Main App Body */}
      <main className="flex-1">
        {/* TAB: BILIK SUARA (VOTING BOOTH / VERIFICATION) */}
        {activeTab === 'bilik_suara' && (
          <div>
            {!currentVoter ? (
              // Step 1: Verification / DPT Login
              <VoterVerification
                voters={voters}
                onVerified={handleVoterVerified}
                onOpenSecurityModal={() => setShowSecurityModal(true)}
              />
            ) : justVotedReceipt ? (
              // Step 3 / Post-Voting: Digital Proof Receipt (Suara Terkunci)
              <DigitalReceipt
                voter={justVotedReceipt.voter}
                ballotHash={justVotedReceipt.ballotHash}
                onViewResults={() => setActiveTab('hasil_suara')}
                onLogout={handleLogout}
              />
            ) : currentVoter.status === 'sudah_memilih' ? (
              // Case: Voter already voted earlier
              <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-white font-['Outfit']">
                    Hak Suara Telah Digunakan
                  </h2>
                  <p className="text-xs text-slate-300">
                    Sistem mendeteksi NIK <strong>{currentVoter.nik}</strong> ({currentVoter.nama}) telah memberikan suara pada {currentVoter.waktuMemilih ? new Date(currentVoter.waktuMemilih).toLocaleString('id-ID') : 'Sesi Ini'}.
                  </p>
                  <p className="text-[11px] text-amber-400 font-medium">
                    Sesuai asas LUBER JURDIL, satu pemilih hanya dapat memberikan 1 kali suara dan tidak dapat diulang.
                  </p>
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setJustVotedReceipt({
                        voter: currentVoter,
                        ballotHash: currentVoter.tokenBuktiHash || '00000000000000000000'
                      })}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Buka Kartu Bukti Memilih
                    </button>
                    <button
                      onClick={() => setActiveTab('hasil_suara')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                    >
                      Lihat Hasil Quick Count
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Step 2: Interactive Digital Ballot Box
              <VotingBooth
                voter={currentVoter}
                candidates={candidates}
                onVoteSubmitted={handleVoteSubmitted}
                onOpenSecurityModal={() => setShowSecurityModal(true)}
                onViewProfile={(cand) => setSelectedCandidateForDetail(cand)}
              />
            )}
          </div>
        )}

        {/* TAB: PROFIL KANDIDAT */}
        {activeTab === 'kandidat' && (
          <div className="max-w-6xl mx-auto py-8 px-4">
            <CandidateCards
              candidates={candidates}
              onOpenDetail={(cand) => setSelectedCandidateForDetail(cand)}
              onEditCandidate={(cand) => setCandidateToEdit(cand)}
              isVotingMode={false}
            />
          </div>
        )}

        {/* TAB: HASIL SUARA & QUICK COUNT */}
        {activeTab === 'hasil_suara' && (
          <LiveResultsDashboard
            candidates={candidates}
            voters={voters}
            votes={votes}
            onOpenReportModal={() => setShowOfficialReportModal(true)}
          />
        )}

        {/* TAB: ADMIN KPUD PANEL */}
        {activeTab === 'admin_panel' && (
          <AdminDashboard
            voters={voters}
            candidates={candidates}
            votes={votes}
            auditLogs={auditLogs}
            onAddVoter={handleAddVoter}
            onEditCandidate={(cand) => setCandidateToEdit(cand)}
            onSimulateBulkRandomVotes={handleSimulateBulkRandomVotes}
            onResetData={handleResetData}
            onOpenReportModal={() => setShowOfficialReportModal(true)}
          />
        )}
      </main>

      {/* Modals */}
      {selectedCandidateForDetail && (
        <CandidateModal
          candidate={selectedCandidateForDetail}
          onClose={() => setSelectedCandidateForDetail(null)}
          canVote={currentVoter !== null && currentVoter.status === 'belum_memilih'}
          onEditCandidate={(cand) => setCandidateToEdit(cand)}
          onSelectCandidate={(cand) => {
            setSelectedCandidateForDetail(null);
            setActiveTab('bilik_suara');
          }}
        />
      )}

      {/* Edit Candidate Photo & Name Modal */}
      {candidateToEdit && (
        <EditCandidateModal
          isOpen={!!candidateToEdit}
          candidate={candidateToEdit}
          onClose={() => setCandidateToEdit(null)}
          onSave={handleUpdateCandidate}
        />
      )}

      {showSecurityModal && (
        <SecurityArchitectureModal
          isOpen={showSecurityModal}
          onClose={() => setShowSecurityModal(false)}
        />
      )}

      {showOfficialReportModal && (
        <OfficialReportModal
          isOpen={showOfficialReportModal}
          onClose={() => setShowOfficialReportModal(false)}
          candidates={candidates}
          voters={voters}
          votes={votes}
        />
      )}

      {/* Bottom Footer */}
      <footer className="mt-12 bg-slate-900/90 border-t border-slate-800 text-xs py-6 px-4 text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              🗳️
            </div>
            <div>
              <p className="font-bold text-white">E-VOTING PILBUP {ELECTION_YEAR}</p>
              <p className="text-[11px] text-slate-400">
                Sistem Pemilihan Bupati Digital Terenkripsi • {KABUPATEN_NAME}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protokol Keamanan Kriptografi</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowOfficialReportModal(true)}
              className="text-slate-300 hover:text-white cursor-pointer"
            >
              Model C1-KWK
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-mono">
              Asas Pemilu: Langsung, Umum, Bebas, Rahasia, Jujur & Adil
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
