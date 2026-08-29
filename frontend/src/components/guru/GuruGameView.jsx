import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Check,
  HelpCircle,
  Award,
  Volume2,
  VolumeX,
  Puzzle,
  Zap,
  ChevronRight
} from 'lucide-react';
import { initialMatchingCards, orderingGameInitial } from '../../data/mockGuruData';
import { sound } from '../../utils/audioUtils';
import { triggerConfetti } from '../../utils/confettiUtils';

// Dataset for Game 3: Puzzle Visual
const initialPuzzleShapes = [
  { id: 'puz-1', fraction: '3/4', desimal: '0,75', label: '3 dari 4 bagian kue', totalParts: 4, shadedParts: 3, shape: 'pie' },
  { id: 'puz-2', fraction: '1/2', desimal: '0,50', label: '1 dari 2 bagian melon', totalParts: 2, shadedParts: 1, shape: 'pie' },
  { id: 'puz-3', fraction: '5/8', desimal: '0,625', label: '5 dari 8 petak kebun', totalParts: 8, shadedParts: 5, shape: 'bar' },
  { id: 'puz-4', fraction: '2/6', desimal: '0,33', label: '2 dari 6 kotak cokelat', totalParts: 6, shadedParts: 2, shape: 'grid' },
];

const initialPuzzleOptions = ['1/2', '3/4', '5/8', '2/6'];

// Dataset for Game 4: Tebak Cepat
const speedQuizQuestions = [
  {
    id: 1,
    soal: 'Manakah pecahan yang senilai dengan 2/4?',
    opsi: ['1/2', '2/3', '3/5', '1/4'],
    kunci: 0,
    penjelasan: '2/4 disederhanakan dengan membagi pembilang dan penyebut dengan 2 menjadi 1/2.'
  },
  {
    id: 2,
    soal: 'Hitunglah hasil dari: 1/4 + 2/4 = ...',
    opsi: ['3/8', '3/4', '2/8', '1/2'],
    kunci: 1,
    penjelasan: 'Karena penyebut sudah sama (4), jumlahkan pembilang: 1 + 2 = 3. Hasilnya 3/4.'
  },
  {
    id: 3,
    soal: 'Bentuk pecahan biasa dari 0,75 adalah...',
    opsi: ['7/5', '1/4', '3/4', '4/5'],
    kunci: 2,
    penjelasan: '0,75 = 75/100 = (75÷25)/(100÷25) = 3/4.'
  },
  {
    id: 4,
    soal: 'Tanda perbandingan yang tepat: 1/3 ... 1/4 adalah...',
    opsi: ['< (Lebih Kecil)', '> (Lebih Besar)', '= (Sama Dengan)', '>= (Lebih/Sama)'],
    kunci: 1,
    penjelasan: 'Kali silang: 1×4 = 4 vs 3×1 = 3. Karena 4 > 3, maka 1/3 > 1/4.'
  },
  {
    id: 5,
    soal: 'Ibu punya 1 kue utuh, dipotong dan dimakan 2/5 bagian. Sisa kue ibu adalah...',
    opsi: ['3/5', '1/5', '4/5', '2/5'],
    kunci: 0,
    penjelasan: '1 kue utuh = 5/5. Maka 5/5 - 2/5 = 3/5.'
  },
];

export default function GuruGameView() {
  const [activeGame, setActiveGame] = useState('matching'); // 'matching' | 'ordering' | 'puzzle' | 'tebak'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ================= GAME 1: MATCHING CARD GAME STATE =================
  const [cards, setCards] = useState(initialMatchingCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchingTimer, setMatchingTimer] = useState(0);
  const [isMatchingWon, setIsMatchingWon] = useState(false);

  useEffect(() => {
    let interval = null;
    if (activeGame === 'matching' && !isMatchingWon) {
      interval = setInterval(() => {
        setMatchingTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, isMatchingWon]);

  const handleCardClick = (index) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedPairs.includes(cards[index].pairId)
    ) {
      return;
    }

    if (soundEnabled) sound.playCardFlip();
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        const newMatches = [...matchedPairs, firstCard.pairId];
        setMatchedPairs(newMatches);
        setFlippedCards([]);
        if (soundEnabled) sound.playMatchSuccess();

        if (newMatches.length === cards.length / 2) {
          setIsMatchingWon(true);
          if (soundEnabled) sound.playVictory();
          triggerConfetti();
        }
      } else {
        if (soundEnabled) sound.playMismatch();
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleResetMatching = () => {
    if (soundEnabled) sound.playClick();
    setCards([...initialMatchingCards].sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setMatchingTimer(0);
    setIsMatchingWon(false);
  };

  // ================= GAME 2: FRACTION ORDERING GAME STATE =================
  const [orderItems, setOrderItems] = useState(orderingGameInitial);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderMoves, setOrderMoves] = useState(0);

  const handleMoveUp = (index) => {
    if (index === 0) return;
    if (soundEnabled) sound.playClick();
    const newItems = [...orderItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    setOrderItems(newItems);
    setOrderMoves((prev) => prev + 1);
    setOrderStatus(null);
  };

  const handleMoveDown = (index) => {
    if (index === orderItems.length - 1) return;
    if (soundEnabled) sound.playClick();
    const newItems = [...orderItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    setOrderItems(newItems);
    setOrderMoves((prev) => prev + 1);
    setOrderStatus(null);
  };

  const handleCheckOrdering = () => {
    let isCorrect = true;
    for (let i = 0; i < orderItems.length - 1; i++) {
      if (orderItems[i].value > orderItems[i + 1].value) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      setOrderStatus('correct');
      if (soundEnabled) sound.playVictory();
      triggerConfetti();
    } else {
      setOrderStatus('wrong');
      if (soundEnabled) sound.playMismatch();
    }
  };

  const handleResetOrdering = () => {
    if (soundEnabled) sound.playClick();
    setOrderItems([...orderingGameInitial].sort(() => Math.random() - 0.5));
    setOrderStatus(null);
    setOrderMoves(0);
  };

  // ================= GAME 3: PUZZLE VISUAL PECAHAN =================
  const [selectedPuzzleSlot, setSelectedPuzzleSlot] = useState(null); // puzzle item id
  const [puzzleAnswers, setPuzzleAnswers] = useState({}); // { [puzzleId]: '3/4' }
  const [isPuzzleChecked, setIsPuzzleChecked] = useState(false);
  const [isPuzzleWon, setIsPuzzleWon] = useState(false);

  const handleSelectOptionForPuzzle = (optFraction) => {
    if (!selectedPuzzleSlot) return;
    if (soundEnabled) sound.playClick();
    const updated = { ...puzzleAnswers, [selectedPuzzleSlot]: optFraction };
    setPuzzleAnswers(updated);
    setIsPuzzleChecked(false);
  };

  const handleCheckPuzzle = () => {
    let allCorrect = true;
    initialPuzzleShapes.forEach((puz) => {
      if (puzzleAnswers[puz.id] !== puz.fraction) {
        allCorrect = false;
      }
    });

    setIsPuzzleChecked(true);
    if (allCorrect && Object.keys(puzzleAnswers).length === initialPuzzleShapes.length) {
      setIsPuzzleWon(true);
      if (soundEnabled) sound.playVictory();
      triggerConfetti();
    } else {
      setIsPuzzleWon(false);
      if (soundEnabled) sound.playMismatch();
    }
  };

  const handleResetPuzzle = () => {
    if (soundEnabled) sound.playClick();
    setPuzzleAnswers({});
    setSelectedPuzzleSlot(null);
    setIsPuzzleChecked(false);
    setIsPuzzleWon(false);
  };

  // ================= GAME 4: TEBAK CEPAT PECAHAN =================
  const [speedCurrentIdx, setSpeedCurrentIdx] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedStreak, setSpeedStreak] = useState(0);
  const [speedFinished, setSpeedFinished] = useState(false);
  const [speedSelected, setSpeedSelected] = useState(null);

  const handleSpeedAnswer = (chosenOptIdx) => {
    if (speedSelected !== null) return;
    setSpeedSelected(chosenOptIdx);
    const curQ = speedQuizQuestions[speedCurrentIdx];
    const isCorrect = chosenOptIdx === curQ.kunci;

    if (isCorrect) {
      if (soundEnabled) sound.playMatchSuccess();
      setSpeedScore((prev) => prev + 20);
      setSpeedStreak((prev) => prev + 1);
    } else {
      if (soundEnabled) sound.playMismatch();
      setSpeedStreak(0);
    }

    setTimeout(() => {
      if (speedCurrentIdx < speedQuizQuestions.length - 1) {
        setSpeedCurrentIdx((prev) => prev + 1);
        setSpeedSelected(null);
      } else {
        setSpeedFinished(true);
        if (soundEnabled) sound.playVictory();
        triggerConfetti();
      }
    }, 1200);
  };

  const handleResetSpeedQuiz = () => {
    if (soundEnabled) sound.playClick();
    setSpeedCurrentIdx(0);
    setSpeedScore(0);
    setSpeedStreak(0);
    setSpeedFinished(false);
    setSpeedSelected(null);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Header & Game Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Game Edukasi Interaktif Kelas
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aktivitas interaktif untuk memperkuat pemahaman pecahan melalui gamifikasi di ruang kelas.
          </p>
        </div>

        {/* Audio Toggle & Game Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
            }`}
            title={soundEnabled ? 'Efek Suara Aktif (Klik untuk Mute)' : 'Efek Suara Dimatikan'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio Aktif' : 'Muted'}</span>
          </button>

          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl border border-gray-200 flex-wrap">
            {[
              { id: 'matching', label: '1. Matching Cards' },
              { id: 'ordering', label: '2. Urutkan Nilai' },
              { id: 'puzzle', label: '3. Puzzle Visual' },
              { id: 'tebak', label: '4. Tebak Cepat' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  setActiveGame(btn.id);
                  if (soundEnabled) sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeGame === btn.id
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= GAME 1: MATCHING CARD GAME ================= */}
      {activeGame === 'matching' && (
        <div className="space-y-6">
          {/* Top Score Bar */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4 card-interactive">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-500 font-medium">Waktu:</span>
                <strong className="text-sm font-mono font-extrabold text-gray-900">{matchingTimer}s</strong>
              </div>

              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-gray-500 font-medium">Langkah:</span>
                <strong className="text-sm font-mono font-extrabold text-gray-900">{moves} Langkah</strong>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-gray-500 font-medium">Pasangan Cocok:</span>
                <strong className="text-sm font-mono font-extrabold text-emerald-700">
                  {matchedPairs.length} / {cards.length / 2}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetMatching}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Acak Ulang Kartu</span>
            </button>
          </div>

          {/* Victory Banner */}
          {isMatchingWon && (
            <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white rounded-3xl p-6 shadow-lg flex items-center justify-between animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl animate-bounce">
                  🏆
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Luar Biasa! Semua Pasangan Cocok!</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Selesai dalam <strong>{matchingTimer} detik</strong> dengan <strong>{moves} langkah</strong>.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetMatching}
                className="px-5 py-2.5 bg-white text-emerald-800 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                Main Lagi
              </button>
            </div>
          )}

          {/* 8 Card Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card, index) => {
              const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.pairId);
              const isMatched = matchedPairs.includes(card.pairId);

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`h-36 sm:h-44 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 shadow-xs scale-[0.98]'
                      : isFlipped
                      ? 'bg-white border-2 border-blue-600 text-blue-900 shadow-md'
                      : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {isFlipped ? (
                    <div className="text-center space-y-1 animate-in fade-in zoom-in duration-200">
                      <span className="text-2xl sm:text-3xl font-black block tracking-tight">
                        {card.value}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {card.type}
                      </span>
                      {isMatched && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold mt-1">
                          ✓ Cocok
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-80">
                      <Sparkles className="w-6 h-6" />
                      <span className="text-xs font-extrabold tracking-wider uppercase">MERATA</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= GAME 2: FRACTION ORDERING GAME ================= */}
      {activeGame === 'ordering' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4 card-interactive">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Urutkan Pecahan dari Nilai Terkecil ke Terbesar</h2>
                <p className="text-xs text-gray-500 mt-0.5">Gunakan tombol panah Naik / Turun untuk menyusun kartu.</p>
              </div>

              <button
                type="button"
                onClick={handleResetOrdering}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Acak Ulang</span>
              </button>
            </div>

            {/* Status Feedback */}
            {orderStatus === 'correct' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center justify-between text-xs animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="font-extrabold text-sm block">Urutan Sempurna & Benar!</strong>
                    <span>Pecahan telah tersusun dengan tepat dari nilai 0,25 hingga 1,00.</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-700">{orderMoves} Perpindahan</span>
              </div>
            )}

            {orderStatus === 'wrong' && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 flex items-center gap-3 text-xs animate-in zoom-in-95 duration-200">
                <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <strong className="font-extrabold block">Urutan Masih Belum Tepat</strong>
                  <span>Coba ubah pecahan biasa menjadi nilai desimal terlebih dahulu untuk membandingkan.</span>
                </div>
              </div>
            )}

            {/* Ordering Items List */}
            <div className="space-y-2.5">
              {orderItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-center justify-between hover:bg-blue-50/40 hover:border-blue-200 transition-all text-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="text-lg font-black text-gray-900">{item.label}</span>
                      <span className="text-[10px] text-gray-400 block font-mono">Nilai Relatif: ({item.desimal})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      ▲ Naik
                    </button>
                    <button
                      type="button"
                      disabled={idx === orderItems.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      ▼ Turun
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCheckOrdering}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Periksa Urutan Pecahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GAME 3: PUZZLE VISUAL PECAHAN ================= */}
      {activeGame === 'puzzle' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5 card-interactive">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Puzzle Visual: Cocokkan Arsiran dengan Nilai Pecahan</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  1) Klik kartu gambar arsiran, lalu 2) Klik label pecahan di sebelah kanan untuk memasangkannya.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetPuzzle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Puzzle</span>
              </button>
            </div>

            {/* Victory Banner */}
            {isPuzzleWon && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-5 flex items-center justify-between animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧩</span>
                  <div>
                    <strong className="text-sm font-extrabold block">Hebat! Semua Arsiran Cocok dengan Benar!</strong>
                    <span className="text-xs text-emerald-100">Pemahaman konsep pecahan bagian dari keutuhanmu sangat mantap.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetPuzzle}
                  className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Main Lagi
                </button>
              </div>
            )}

            {isPuzzleChecked && !isPuzzleWon && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Masih ada pasangan pecahan yang belum sesuai. Hitung jumlah bagian yang diarsir dibanding total bagiannya.</span>
              </div>
            )}

            {/* Main Puzzle Grid: 4 Shapes & Option Palette */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Shapes (8 Cols) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialPuzzleShapes.map((puz) => {
                  const assigned = puzzleAnswers[puz.id];
                  const isSelected = selectedPuzzleSlot === puz.id;
                  const isCorrect = isPuzzleChecked && assigned === puz.fraction;
                  const isWrong = isPuzzleChecked && assigned && assigned !== puz.fraction;

                  return (
                    <div
                      key={puz.id}
                      onClick={() => setSelectedPuzzleSlot(puz.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-md'
                          : isCorrect
                          ? 'border-emerald-400 bg-emerald-50/50'
                          : isWrong
                          ? 'border-rose-400 bg-rose-50/50'
                          : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700">{puz.label}</span>
                        <span className="text-[10px] font-mono text-gray-400">{puz.shadedParts}/{puz.totalParts} Bagian</span>
                      </div>

                      {/* Visual Graphic Representation */}
                      <div className="h-20 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center gap-1">
                        {Array.from({ length: puz.totalParts }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-full rounded-md transition-all flex items-center justify-center text-[9px] font-bold ${
                              i < puz.shadedParts
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {i < puz.shadedParts ? '✓' : ''}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-gray-500">Pasangan Pecahan:</span>
                        <span
                          className={`px-3 py-1 rounded-lg font-mono font-extrabold text-xs ${
                            assigned
                              ? isCorrect
                                ? 'bg-emerald-600 text-white'
                                : isWrong
                                ? 'bg-rose-600 text-white'
                                : 'bg-blue-600 text-white shadow-xs'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {assigned || '? / ?'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Palette (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                    <Puzzle className="w-4 h-4 text-blue-600" />
                    <span>Pilihan Kepingan Pecahan</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    Pilih kartu gambar di kiri terlebih dahulu, lalu klik salah satu nilai pecahan berikut:
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {initialPuzzleOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOptionForPuzzle(opt)}
                        disabled={!selectedPuzzleSlot}
                        className="py-3 px-2 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-900 font-mono font-black text-sm transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckPuzzle}
                  disabled={Object.keys(puzzleAnswers).length === 0}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>Periksa Jawaban Puzzle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= GAME 4: TEBAK CEPAT PECAHAN ================= */}
      {activeGame === 'tebak' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5 card-interactive">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Tebak Cepat: Uji Refleks Pemahaman Pecahan</h2>
                <p className="text-xs text-gray-500 mt-0.5">Jawab pertanyaan secepat dan setepat mungkin untuk mengumpulkan skor & streak!</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-gray-500">Streak:</span>
                  <strong className="text-amber-600 font-extrabold">{speedStreak}x</strong>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-500">Skor:</span>
                  <strong className="text-blue-600 font-extrabold">{speedScore} Pts</strong>
                </div>

                <button
                  type="button"
                  onClick={handleResetSpeedQuiz}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                  title="Ulangi Tebak Cepat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!speedFinished ? (
              <div className="space-y-6 max-w-2xl mx-auto py-4">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>Soal #{speedCurrentIdx + 1} dari {speedQuizQuestions.length}</span>
                    <span>Progres {Math.round(((speedCurrentIdx + 1) / speedQuizQuestions.length) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${((speedCurrentIdx + 1) / speedQuizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl shadow-md space-y-3 text-center">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                    Pertanyaan #{speedCurrentIdx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {speedQuizQuestions[speedCurrentIdx].soal}
                  </h3>
                </div>

                {/* Options 4 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {speedQuizQuestions[speedCurrentIdx].opsi.map((opt, optIdx) => {
                    const isPicked = speedSelected === optIdx;
                    const isKunci = optIdx === speedQuizQuestions[speedCurrentIdx].kunci;
                    const showFeedback = speedSelected !== null;

                    let btnStyle = 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-gray-900';
                    if (showFeedback) {
                      if (isKunci) btnStyle = 'bg-emerald-500 border-emerald-600 text-white scale-[1.02] shadow-md';
                      else if (isPicked) btnStyle = 'bg-rose-500 border-rose-600 text-white';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={speedSelected !== null}
                        onClick={() => handleSpeedAnswer(optIdx)}
                        className={`p-4 rounded-2xl border text-sm font-extrabold transition-all text-left flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showFeedback && isKunci && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Finish Screen */
              <div className="p-8 text-center space-y-4 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-black text-3xl shadow-inner animate-bounce">
                  ⚡
                </div>
                <h3 className="text-2xl font-black text-gray-900">Sesi Tebak Cepat Selesai!</h3>
                <p className="text-xs text-gray-500">
                  Kamu meraih total skor <strong>{speedScore} Poin</strong> dengan streak terbaik <strong>{speedStreak}x beruntun</strong>.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetSpeedQuiz}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Mainkan Lagi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
