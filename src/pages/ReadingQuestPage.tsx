import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playClick, playSuccess } from "../core/sounds";
import { awardXp, completeReadingQuest, getReadingQuest } from "../core/api";
import { useProgress } from "../core/ProgressContext";
import AnimatedBackground from "../components/AnimatedBackground";
import { playfulPalette } from "../theme/playfulPalette";

interface StoryParagraph {
  text: string;
  dictionary: Record<string, string>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}

const MotionCard = motion(Card);

const fallbackQuest: {
  id: string;
  title: string;
  image: string;
  paragraphs: StoryParagraph[];
} = {
  id: "quest-1",
  title: "The Magic Forest",
  image: "🌲",
  paragraphs: [
    {
      text: "Once upon a time, there was a small boy named Ali. He lived near a big, dark forest. Everyone said the forest was magic. Ali wanted to see the magic.",
      dictionary: {
        Once: "في قديم الزمان",
        time: "وقت",
        small: "صغير",
        boy: "ولد",
        named: "اسمه",
        lived: "عاش",
        near: "بالقرب من",
        big: "كبير",
        dark: "مظلم",
        forest: "غابة",
        Everyone: "الجميع",
        said: "قال",
        magic: "سحر",
        wanted: "أراد",
        see: "يرى",
      },
      quiz: {
        question: "Where did Ali live?",
        options: ["Near a big forest", "In a city", "On a mountain", "Under the sea"],
        correctIndex: 0,
      },
    },
    {
      text: "One day, Ali walked into the forest. He saw a blue bird. The bird talked to him! Hello, Ali, said the bird. Ali was very surprised.",
      dictionary: {
        One: "واحد",
        day: "يوم",
        walked: "مشى",
        into: "إلى داخل",
        saw: "رأى",
        blue: "أزرق",
        bird: "طائر",
        talked: "تحدث",
        Hello: "مرحبًا",
        very: "جدًا",
        surprised: "متفاجئ",
      },
      quiz: {
        question: "What color was the bird?",
        options: ["Red", "Blue", "Yellow", "Green"],
        correctIndex: 1,
      },
    },
  ],
};

const glassCardSx = {
  borderRadius: 5,
  border: `1px solid ${playfulPalette.line}`,
  background: playfulPalette.glass,
  boxShadow: playfulPalette.glow,
  backdropFilter: "blur(14px)",
};

const ReadingQuestPage = () => {
  const navigate = useNavigate();
  const { addStars } = useProgress();
  const translationTimeoutRef = useRef<number | null>(null);

  const [quest, setQuest] = useState(fallbackQuest);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ word: string; translation: string } | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<{ selected: number; isCorrect: boolean } | null>(null);
  const [questComplete, setQuestComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (translationTimeoutRef.current) {
        window.clearTimeout(translationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let active = true;
    getReadingQuest("quest-1")
      .then((response) => {
        if (!active) return;
        setQuest(response.quest);
        setQuestComplete(response.progress.completed);
        setLoadError("");
      })
      .catch(() => {
        if (!active) return;
        setLoadError("Could not load the live reading quest, so a local version is shown.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const paragraph = quest.paragraphs[currentParagraphIndex];
  const progressValue = ((currentParagraphIndex + (showQuiz ? 0.5 : 0.15)) / quest.paragraphs.length) * 100;

  const handleWordClick = (wordRaw: string) => {
    const word = wordRaw.replace(/[.,!?']/g, "").trim();
    if (!word) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);

    const translation =
      paragraph.dictionary[word] ||
      paragraph.dictionary[word.toLowerCase()] ||
      paragraph.dictionary[word.charAt(0).toUpperCase() + word.slice(1)];

    if (translation) {
      setSelectedWord({ word, translation });
      if (translationTimeoutRef.current) {
        window.clearTimeout(translationTimeoutRef.current);
      }
      translationTimeoutRef.current = window.setTimeout(() => {
        setSelectedWord(null);
      }, 2600);
    }
  };

  const handleQuizAnswer = (index: number) => {
    const isCorrect = index === paragraph.quiz.correctIndex;
    setQuizAnswered({ selected: index, isCorrect });
    if (isCorrect) playSuccess();
  };

  const completeQuest = async () => {
    setQuestComplete(true);
    playSuccess();
    try {
      await completeReadingQuest(quest.id, 100);
      await awardXp("reading_quest", 150);
      addStars(15);
    } catch (error) {
      console.error(error);
    }
  };

  const nextSection = () => {
    playClick();
    if (currentParagraphIndex < quest.paragraphs.length - 1) {
      setCurrentParagraphIndex((prev) => prev + 1);
      setShowQuiz(false);
      setQuizAnswered(null);
      setSelectedWord(null);
      return;
    }

    completeQuest();
  };

  if (questComplete) {
    return (
      <Box sx={{ position: "relative", minHeight: "100vh", pb: 8 }}>
      <AnimatedBackground />
        <Box sx={{ position: "relative", zIndex: 1, px: 1, pt: 2, minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, maxWidth: 680, width: "100%", overflow: "hidden" }}>
            <CardContent sx={{ p: { xs: 2.4, sm: 3.2 } }}>
              <Box
                sx={{
                  borderRadius: 5,
                  background: playfulPalette.heroGradient,
                  p: { xs: 2.4, sm: 3.2 },
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: { xs: "3.4rem", sm: "4.4rem" }, mb: 1 }}>🏆</Typography>
                <Chip
                  icon={<EmojiEventsRoundedIcon />}
                  label="Quest Complete"
                  sx={{ bgcolor: "rgba(255,255,255,0.68)", color: playfulPalette.ink, fontWeight: 900, borderRadius: 999, mb: 2 }}
                />
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: { xs: "2rem", sm: "2.7rem" }, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
                  أحسنت، أنهيت مهمة القراءة بنجاح.
                </Typography>
                <Typography sx={{ color: "rgba(40,75,99,0.82)", mt: 1.3, lineHeight: 1.8, fontSize: "1.05rem" }}>
                  حصلت على 150 XP و15 نجمة. هذا النوع من القراءة يساعد الطفل على فهم المعنى والنطق معًا.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="center" sx={{ mt: 2.4 }}>
                  <Chip label="+150 XP" sx={{ bgcolor: playfulPalette.snow, color: playfulPalette.ink, fontWeight: 900 }} />
                  <Chip label="+15 Stars" sx={{ bgcolor: playfulPalette.softLilac, color: "#5F65C7", fontWeight: 900 }} />
                </Stack>

                <Button
                  variant="contained"
                  onClick={() => navigate("/home")}
                  sx={{
                    mt: 3,
                    borderRadius: 999,
                    px: 3.4,
                    py: 1.25,
                    fontWeight: 900,
                    background: playfulPalette.candyGradient,
                    color: playfulPalette.snow,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      opacity: 0.94,
                    },
                  }}
                >
                  العودة للرئيسية
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      <AnimatedBackground />

      <Box sx={{ position: "relative", zIndex: 1, px: { xs: 0.5, sm: 1.5 }, pt: { xs: 1, md: 2 } }}>
        <MotionCard initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, overflow: "hidden", mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.2, sm: 3.2 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 2.4, alignItems: "center" }}>
              <Box>
                <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 2 }}>
                  <IconButton onClick={() => navigate("/home")} sx={{ bgcolor: playfulPalette.softBlue, color: playfulPalette.ink }}>
                    <ArrowBackRoundedIcon />
                  </IconButton>
                  <Chip
                    icon={<AutoStoriesRoundedIcon />}
                    label="Reading Quest"
                    sx={{ bgcolor: playfulPalette.lemon, color: playfulPalette.ink, fontWeight: 900, borderRadius: 999 }}
                  />
                </Stack>

                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: { xs: "1.9rem", md: "2.7rem" }, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
                  قصة قصيرة وتفاعلية تجعل القراءة أكثر وضوحًا ومتعة للطفل.
                </Typography>
                <Typography sx={{ color: playfulPalette.inkSoft, mt: 1.4, lineHeight: 1.75, maxWidth: 560 }}>
                  اضغطي على أي كلمة لسماع نطقها ومعرفة معناها، ثم أكملي بسؤال سريع بعد كل فقرة.
                </Typography>
              </Box>

              <Box sx={{ ...glassCardSx, p: 2.2, background: playfulPalette.actionGradient }}>
                <Typography sx={{ color: "rgba(40,75,99,0.72)", fontSize: "0.9rem", mb: 0.5 }}>القصة الحالية</Typography>
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "1.42rem" }}>
                  {quest.title} {quest.image}
                </Typography>
                <Typography sx={{ color: "rgba(40,75,99,0.76)", mt: 0.8, lineHeight: 1.7 }}>
                  الفقرة {currentParagraphIndex + 1} من {quest.paragraphs.length}
                </Typography>
                <Box sx={{ mt: 1.6 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                    <Typography sx={{ color: playfulPalette.ink, fontWeight: 800, fontSize: "0.92rem" }}>التقدم</Typography>
                    <Typography sx={{ color: playfulPalette.ink, fontWeight: 900, fontSize: "0.92rem" }}>
                      {Math.round(progressValue)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.42)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        bgcolor: playfulPalette.ink,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {loading && (
          <Card sx={{ ...glassCardSx, mb: 3 }}>
            <CardContent sx={{ py: 3 }}>
              <Typography sx={{ color: playfulPalette.ink, textAlign: "center", fontWeight: 800 }}>
                Loading live reading quest...
              </Typography>
            </CardContent>
          </Card>
        )}

        {loadError && !loading && (
          <Card sx={{ ...glassCardSx, mb: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography sx={{ color: playfulPalette.inkSoft, textAlign: "center", fontWeight: 700 }}>
                {loadError}
              </Typography>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {selectedWord && (
            <motion.div key={`${selectedWord.word}-${selectedWord.translation}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <Card
                sx={{
                  ...glassCardSx,
                  mb: 3,
                  background: playfulPalette.candyGradient,
                  color: playfulPalette.snow,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 1.8 } }}>
                  <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <TranslateRoundedIcon />
                    <Typography sx={{ fontWeight: 900 }}>{selectedWord.word}</Typography>
                    <Typography sx={{ fontWeight: 700, opacity: 0.9 }}>=</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{selectedWord.translation}</Typography>
                    <VolumeUpRoundedIcon sx={{ opacity: 0.86 }} />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <MotionCard key={currentParagraphIndex} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} sx={{ ...glassCardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
            <Stack spacing={2.2}>
              <Box
                sx={{
                  borderRadius: 4,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,248,239,0.92))",
                  border: "1px solid rgba(255,255,255,0.72)",
                  p: { xs: 2, sm: 2.6 },
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                }}
              >
                <Typography sx={{ color: playfulPalette.ink, fontWeight: 800, fontSize: { xs: "1.18rem", sm: "1.36rem" }, lineHeight: 2.05 }}>
                  {paragraph.text.split(" ").map((wordRaw, index) => (
                    <Box
                      component="span"
                      key={`${wordRaw}-${index}`}
                      onClick={() => handleWordClick(wordRaw)}
                      sx={{
                        display: "inline-block",
                        cursor: "pointer",
                        mr: "8px",
                        mb: "8px",
                        px: 0.5,
                        borderRadius: 1.5,
                        borderBottom: `2px dashed ${playfulPalette.sky}`,
                        transition: "transform 0.18s ease, background-color 0.18s ease, color 0.18s ease",
                        "&:hover": {
                          color: "#1E7EBE",
                          bgcolor: playfulPalette.softBlue,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {wordRaw}
                    </Box>
                  ))}
                </Typography>
              </Box>

              {!showQuiz && (
                <Button
                  variant="contained"
                  onClick={() => {
                    playClick();
                    setShowQuiz(true);
                  }}
                  sx={{
                    alignSelf: { xs: "stretch", sm: "flex-start" },
                    borderRadius: 999,
                    px: 3,
                    py: 1.2,
                    fontWeight: 900,
                    background: playfulPalette.heroGradient,
                    color: playfulPalette.ink,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      opacity: 0.95,
                    },
                  }}
                >
                  انتهيت من القراءة
                </Button>
              )}
            </Stack>
          </CardContent>
        </MotionCard>

        <AnimatePresence mode="wait">
          {showQuiz && (
            <motion.div key={`quiz-${currentParagraphIndex}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
              <Card sx={{ ...glassCardSx, mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.2, sm: 2.8 } }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                      <Chip label="Quick Quiz" sx={{ bgcolor: playfulPalette.softPeach, color: "#A96324", fontWeight: 900, borderRadius: 999 }} />
                      <Chip label="سؤال سريع" sx={{ bgcolor: playfulPalette.softLilac, color: "#5F65C7", fontWeight: 900, borderRadius: 999 }} />
                    </Stack>

                    <Typography sx={{ textAlign: "center", color: playfulPalette.ink, fontWeight: 900, fontSize: { xs: "1.22rem", sm: "1.42rem" } }}>
                      {paragraph.quiz.question}
                    </Typography>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.2 }}>
                      {paragraph.quiz.options.map((option, index) => {
                        const isSelected = quizAnswered?.selected === index;
                        const isCorrect = index === paragraph.quiz.correctIndex;
                        const isWrongSelected = isSelected && !isCorrect;

                        let background: string = playfulPalette.snow;
                        let color: string = playfulPalette.ink;
                        let border: string = `1px solid ${playfulPalette.line}`;

                        if (quizAnswered) {
                          if (isCorrect) {
                            background = "#E8FFF4";
                            color = "#2A8B6C";
                            border = "1px solid rgba(56,184,137,0.35)";
                          } else if (isWrongSelected) {
                            background = "#FFF0F5";
                            color = "#A24468";
                            border = "1px solid rgba(230,107,147,0.35)";
                          }
                        }

                        return (
                          <Button
                            key={option}
                            variant="outlined"
                            disabled={quizAnswered !== null}
                            onClick={() => handleQuizAnswer(index)}
                            startIcon={
                              quizAnswered && isCorrect ? (
                                <CheckCircleRoundedIcon sx={{ color: "#38B889" }} />
                              ) : quizAnswered && isWrongSelected ? (
                                <CancelRoundedIcon sx={{ color: "#E66B93" }} />
                              ) : undefined
                            }
                            sx={{
                              justifyContent: "flex-start",
                              textTransform: "none",
                              textAlign: "left",
                              minHeight: 58,
                              borderRadius: 3,
                              px: 2,
                              py: 1.3,
                              background,
                              color,
                              border,
                              fontWeight: 800,
                              fontSize: "1rem",
                              "&:hover": {
                                border,
                                background,
                              },
                            }}
                          >
                            {option}
                          </Button>
                        );
                      })}
                    </Box>

                    {quizAnswered?.isCorrect && (
                      <Button
                        variant="contained"
                        onClick={nextSection}
                        sx={{
                          alignSelf: { xs: "stretch", sm: "center" },
                          borderRadius: 999,
                          px: 3.4,
                          py: 1.2,
                          fontWeight: 900,
                          background: playfulPalette.candyGradient,
                          color: playfulPalette.snow,
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "none",
                            opacity: 0.95,
                          },
                        }}
                      >
                        {currentParagraphIndex < quest.paragraphs.length - 1 ? "تابع القصة" : "إنهاء المهمة"}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default ReadingQuestPage;
