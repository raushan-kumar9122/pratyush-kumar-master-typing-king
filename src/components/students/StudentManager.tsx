/**
 * Offline Student Management System for PRATYUSH KUMAR MASTER PRO
 * Complete CRUD, Target Setting, Test History, and Data Backup/Restore.
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Target, 
  Download, 
  Upload, 
  Clock, 
  Award, 
  Check, 
  X, 
  Search,
  Database
} from 'lucide-react';
import { Student, TestResult } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (id: string) => void;
  onRefreshStudents: () => void;
  onBackToDashboard: () => void;
}

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '⚡', '🚀'];

export const StudentManager: React.FC<Props> = ({
  activeStudent,
  allStudents,
  onSelectStudent,
  onRefreshStudents,
  onBackToDashboard,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    const newStudent: Student = {
      id: `ft-student-${Date.now()}`,
      rollNo: `FT-2026-${String(allStudents.length + 1).padStart(3, '0')}`,
      name: '',
      batch: 'Morning 09:00 AM - 10:30 AM',
      course: 'DCA & Advanced Typing',
      avatar: '👨‍🎓',
      createdAt: new Date().toISOString(),
      targetWpm: 45,
      targetAccuracy: 95,
      totalPracticeTimeSeconds: 0,
    };
    setEditingStudent(newStudent);
    setIsEditing(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent({ ...student });
    setIsEditing(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name || !editingStudent.rollNo) {
      alert('Please fill out student name and roll number.');
      return;
    }

    storageService.saveStudent(editingStudent as Student);
    onRefreshStudents();
    setIsEditing(false);
    setEditingStudent(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (allStudents.length <= 1) {
      alert('Cannot delete the only remaining student account.');
      return;
    }
    if (confirm(`Are you sure you want to delete profile for "${name}"?`)) {
      storageService.deleteStudent(id);
      onRefreshStudents();
      if (activeStudent.id === id) {
        const remaining = allStudents.filter((s) => s.id !== id);
        if (remaining[0]) onSelectStudent(remaining[0].id);
      }
    }
  };

  // Export database backup file
  const handleExportBackup = () => {
    const backupJson = storageService.exportFullBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FTCE_Typing_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus('Database backup downloaded successfully!');
    setTimeout(() => setBackupStatus(null), 3000);
  };

  // Import backup file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importBackup(content);
      if (res.success) {
        setBackupStatus(res.message);
        onRefreshStudents();
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  const studentResults = storageService.getResults(activeStudent.id);
  const bestWpm = Math.max(...studentResults.map((r) => r.netWpm), 0);
  const avgAcc = studentResults.length > 0
    ? Math.round(studentResults.reduce((a, b) => a + b.accuracy, 0) / studentResults.length)
    : 100;

  return (
    <div className="flex flex-col h-full bg-[#081220] p-6 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-950">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Student Management Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Student Records & Profiles
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage student enrollments, set speed targets, and maintain local practice records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09182d] hover:bg-[#102a4e] border border-sky-900/60 text-xs text-sky-300 font-medium transition-colors"
              title="Download local database backup"
            >
              <Download className="w-4 h-4" />
              <span>Backup DB</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09182d] hover:bg-[#102a4e] border border-sky-900/60 text-xs text-sky-300 font-medium transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Restore DB</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {backupStatus && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs text-center">
            {backupStatus}
          </div>
        )}
      </div>

      {/* Active Student Target Card */}
      <div className="max-w-6xl w-full mx-auto p-5 rounded-2xl bg-gradient-to-r from-[#09172c] to-[#0c2242] border border-sky-800/60 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-4xl shadow-md">
            {activeStudent.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-heading font-bold text-white">{activeStudent.name}</h2>
              <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700 text-sky-300 text-[11px] font-mono">
                {activeStudent.rollNo}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Course: <strong className="text-sky-200">{activeStudent.course}</strong> | Batch: <strong className="text-sky-200">{activeStudent.batch}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 bg-[#06101e] rounded-xl border border-sky-950 text-center min-w-[90px]">
            <div className="text-slate-400 text-[10px]">TARGET WPM</div>
            <div className="text-xl font-bold text-emerald-400">{activeStudent.targetWpm}</div>
          </div>
          <div className="p-3 bg-[#06101e] rounded-xl border border-sky-950 text-center min-w-[90px]">
            <div className="text-slate-400 text-[10px]">BEST WPM</div>
            <div className="text-xl font-bold text-sky-400">{bestWpm}</div>
          </div>
          <div className="p-3 bg-[#06101e] rounded-xl border border-sky-950 text-center min-w-[90px]">
            <div className="text-slate-400 text-[10px]">AVG ACCURACY</div>
            <div className="text-xl font-bold text-amber-400">{avgAcc}%</div>
          </div>
          <div className="p-3 bg-[#06101e] rounded-xl border border-sky-950 text-center min-w-[90px]">
            <div className="text-slate-400 text-[10px]">PRACTICE TIME</div>
            <div className="text-xl font-bold text-indigo-400">{Math.round((activeStudent.totalPracticeTimeSeconds || 0) / 60)}m</div>
          </div>
        </div>
      </div>

      {/* Student List & Search Filter */}
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll no, course..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#071322] border border-sky-900/60 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredStudents.length} of {allStudents.length} Students
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          {filteredStudents.map((st) => {
            const isActive = st.id === activeStudent.id;
            return (
              <div
                key={st.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0a1c33] border-sky-500 shadow-lg shadow-sky-500/10'
                    : 'bg-[#091628] border-sky-900/50 hover:border-sky-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{st.avatar}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(st)}
                        className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-sky-950 rounded-lg transition-colors"
                        title="Edit Student"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(st.id, st.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-heading font-semibold text-base text-white">{st.name}</h3>
                  <div className="text-xs font-mono text-sky-400">{st.rollNo}</div>
                  <div className="text-xs text-slate-400 mt-2 line-clamp-1">{st.course}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{st.batch}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-950 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Target: <strong className="text-emerald-400">{st.targetWpm} WPM</strong>
                  </div>

                  {isActive ? (
                    <span className="flex items-center gap-1 text-xs text-sky-400 font-semibold">
                      <UserCheck className="w-4 h-4" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectStudent(st.id)}
                      className="px-3 py-1 rounded-lg bg-[#0e243f] hover:bg-sky-500 hover:text-slate-950 text-sky-300 text-xs font-medium transition-colors"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isEditing && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveStudent}
            className="w-full max-w-lg bg-[#0b182b] border border-sky-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-sky-950">
              <h3 className="font-heading font-bold text-lg text-white">
                {editingStudent.id && allStudents.some((s) => s.id === editingStudent.id)
                  ? 'Edit Student Information'
                  : 'Enroll New Student'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Select */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Student Avatar</label>
              <div className="flex gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setEditingStudent({ ...editingStudent, avatar: av })}
                    className={`w-10 h-10 rounded-xl text-xl border flex items-center justify-center transition-all ${
                      editingStudent.avatar === av
                        ? 'bg-sky-500/20 border-sky-400 scale-105'
                        : 'bg-[#071322] border-sky-950 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-sky-900 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  value={editingStudent.rollNo || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                  placeholder="FT-2026-002"
                  className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-sky-900 text-xs text-white font-mono outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Course Program</label>
                <input
                  type="text"
                  value={editingStudent.course || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
                  placeholder="ADCA / DCA / Typing Special"
                  className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-sky-900 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Batch / Shift</label>
                <input
                  type="text"
                  value={editingStudent.batch || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                  placeholder="Morning 09:00 AM - 10:30 AM"
                  className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-sky-900 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Speed (WPM)</label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={editingStudent.targetWpm || 40}
                  onChange={(e) => setEditingStudent({ ...editingStudent, targetWpm: parseInt(e.target.value) || 40 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-sky-900 text-xs text-white font-mono outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Accuracy (%)</label>
                <input
                  type="number"
                  min="75"
                  max="100"
                  value={editingStudent.targetAccuracy || 95}
                  onChange={(e) => setEditingStudent({ ...editingStudent, targetAccuracy: parseInt(e.target.value) || 95 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-sky-900 text-xs text-white font-mono outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-sky-950 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
