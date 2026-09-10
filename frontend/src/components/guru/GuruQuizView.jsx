import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Send,
  UserCheck,
  Check
} from 'lucide-react';
import { mockQuizData } from '../../data/mockGuruData';
import { triggerConfetti } from '../../utils/confettiUtils';
import { sound } from '../../utils/audioUtils';
import api from '../../services/api';

export default function GuruQuizView({ students, setStudents, activeClass }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockQuizData.durasiMenit * 60);
  const [selectedStudentId, setSelectedStudentId] = useState(students?.[0]?.id || '');
  const [toastMessage, setToastMessage] = useState('');

  // Sync selectedStudentId when students prop changes
  useEffect(() => {
    if (students && students.length > 0) {
      const exists = students.some((s) => s.id === selectedStudentId);
      if (!exists) {
        setSelectedStudentId(students[0].id);
      }
    }
  }, [students, selectedStudentId]);

  const handleSubmitQuiz = React.useCallback(() => {
    setIsSubmitted(true);
    let correct = 0;
    mockQuizData.soal.forEach((q) => {
      if (selectedAnswers[q.id] === q.kunci) correct++;
    });
    const score = Math.round((correct / mockQuizData.soal.length) * 100);
    if (score >= mockQuizData.kkm) {
      sound.playVictory();
      triggerConfetti();
    } else {
      sound.playMismatch();
    }
  }, [selectedAnswers]);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    sound.playClick();
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setTimeLeft(mockQuizData.durasiMenit * 60);
    setToastMessage('');
  };

  // Calculate score
  let correctCount = 0;
  mockQuizData.soal.forEach((q) => {
    if (selectedAnswers[q.id] === q.kunci) {
      correctCount += 1;
    }
  });

  const finalScore = Math.round((correctCount / mockQuizData.soal.length) * 100);
  const isPassed = finalScore >= mockQuizData.kkm;

  // Record score into student monitoring record
  const handleRecordScoreToStudent = async () => {
    if (!selectedStudentId || !setStudents) return;
    sound.playClick();

    const targetStudent = students.find((s) => s.id === selectedStudentId);
    if (!targetStudent) return;

    const newAvg = Number(((targetStudent.nilaiRataRata + finalScore) / 2).toFixed(1));
    const newCatatan = `Menyelesaikan Quiz "${mockQuizData.judul}" dengan skor ${finalScore}/100.`;
    const newStatus = finalScore < 60 ? 'Perhatian Khusus' : targetStudent.statusKehadiran;

    const updated = students.map((s) => {
      if (s.id === selectedStudentId) {
        return {
          ...s,
          nilaiRataRata: newAvg,
          catatan: newCatatan,
          statusKehadiran: newStatus,
        };
      }
      return s;
    });

    setStudents(updated);
    setToastMessage(`Skor ${finalScore} berhasil direkam ke rekam siswa ${targetStudent.nama}!`);
    setTimeout(() => setToastMessage(''), 3500);

    // Sync to backend if authenticated
    try {
      const dbId = targetStudent.dbId || targetStudent.id;
      if (dbId) {
        await api.guru.updateSiswa(dbId, {
          nilai_rata_rata: newAvg,
          catatan: newCatatan,
          status_kehadiran: newStatus
        });
      }
    } catch (err) {
      console.warn('Backend sync for quiz score kept local:', err);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-emerald-600 text-white border-emerald-500 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Quiz Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {mockQuizData.judul}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              KKM: {mockQuizData.kkm}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {mockQuizData.deskripsi} • Total {mockQuizData.soal.length} Butir Soal
          </p>
        </div>

        {/* Timer Badge & Reset */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-extrabold text-xs shadow-xs ${
            timeLeft < 120 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            title="Ulangi Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Quiz View */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Navigation Numbers (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4 card-interactive">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Navigasi Soal
                </h2>
                <span className="text-xs font-bold text-blue-600">
                  {Object.keys(selectedAnswers).length}/{mockQuizData.soal.length} Terjawab
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {mockQuizData.soal.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`h-10 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                          : isAnswered
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Selesaikan & Kumpulkan Quiz</span>
              </button>
            </div>
          </div>

          {/* Question & Option Cards (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6 card-interactive">
            {(() => {
              const currentQ = mockQuizData.soal[currentQuestionIndex];
              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-extrabold text-xs">
                      Pertanyaan #{currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-gray-400">Pilihan Ganda</span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 leading-snug">
                    {currentQ.pertanyaan}
                  </h3>

                  <div className="space-y-2.5">
                    {currentQ.opsi.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQ.id] === optIdx;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 shadow-xs'
                              : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-600 border border-gray-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="text-xs font-semibold">{opt}</span>
                          </div>

                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => {
                        sound.playClick();
                        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Soal Sebelumnya
                    </button>

                    <button
                      type="button"
                      disabled={currentQuestionIndex === mockQuizData.soal.length - 1}
                      onClick={() => {
                        sound.playClick();
                        setCurrentQuestionIndex((prev) => Math.min(mockQuizData.soal.length - 1, prev + 1));
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Soal Selanjutnya →
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        /* ================= SCORE RESULT & EXPLANATION ================= */
        <div className="space-y-6">
          {/* Result Banner Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 card-interactive">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center font-black text-2xl shadow-inner ${
                  isPassed
                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200 animate-bounce'
                    : 'bg-rose-50 text-rose-600 border-2 border-rose-200'
                }`}
              >
                {finalScore}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      isPassed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isPassed ? '✓ LULUS KKM' : '⚠️ REMEDIAL'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">KKM: {mockQuizData.kkm}%</span>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  {isPassed ? 'Kerja Sangat Bagus!' : 'Perlu Pendalaman Materi'}
                </h2>
                <p className="text-xs text-gray-500">
                  Menjawab benar <strong>{correctCount}</strong> dari {mockQuizData.soal.length} soal evaluasi.
                </p>
              </div>
            </div>

            {/* Rekam Nilai ke Siswa */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto p-4 bg-blue-50/60 border border-blue-100 rounded-2xl">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Rekam Skor ke Siswa {activeClass?.nama ? `(${activeClass.nama})` : ''}:
                </span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="mt-1 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
                >
                  {(students || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleRecordScoreToStudent}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2 sm:mt-0"
              >
                <UserCheck className="w-4 h-4" />
                <span>Simpan Skor</span>
              </button>
            </div>
          </div>

          {/* Question by Question Review */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">Ulasan & Pembahasan Butir Soal</h3>

            <div className="space-y-3">
              {mockQuizData.soal.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.kunci;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border bg-white shadow-xs space-y-3 text-xs card-interactive ${
                      isCorrect ? 'border-emerald-200' : 'border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900">Soal #{idx + 1}:</span>
                        <strong className="text-gray-900">{q.pertanyaan}</strong>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                          isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isCorrect ? '✓ Benar' : '✗ Salah'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-gray-50 rounded-xl">
                        <span className="text-gray-400 font-bold block">Jawaban Anda:</span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {userChoice !== undefined
                            ? `${String.fromCharCode(65 + userChoice)}. ${q.opsi[userChoice]}`
                            : 'Tidak Dijawab'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                        <span className="text-emerald-800 font-bold block">Kunci Jawaban:</span>
                        <span className="font-extrabold text-emerald-900">
                          {String.fromCharCode(65 + q.kunci)}. {q.opsi[q.kunci]}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl text-gray-600 leading-relaxed border border-gray-100">
                      <strong className="text-gray-800">Pembahasan:</strong> {q.penjelasan}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
