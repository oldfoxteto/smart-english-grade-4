// Vocabulary session content
export const vocabularySessionContent = {
  words: [
    {
      english: "Achievement",
      arabic: "إنجاز",
      pronunciation: "ə-ˈtʃiːv-mənt",
      example: "She felt proud of her achievement.",
      exampleArabic: "شعرت بالفخر لإنجازها."
    },
    {
      english: "Progress",
      arabic: "تقدم",
      pronunciation: "ˈprɒɡ-res",
      example: "We are making good progress.",
      exampleArabic: "نحن نحرز تقدماً جيداً."
    },
    {
      english: "Knowledge",
      arabic: "معرفة",
      pronunciation: "ˈnɒlɪdʒ",
      example: "Knowledge is power.",
      exampleArabic: "المعرفة قوة."
    },
    {
      english: "Success",
      arabic: "نجاح",
      pronunciation: "səkˈses",
      example: "Hard work leads to success.",
      exampleArabic: "العمل الجاد يؤدي إلى النجاح."
    },
    {
      english: "Challenge",
      arabic: "تحدي",
      pronunciation: "ˈtʃælɪndʒ",
      example: "Every challenge is an opportunity.",
      exampleArabic: "كل تحدي هو فرصة."
    },
    {
      english: "Learning",
      arabic: "تعلم",
      pronunciation: "ˈlɜːnɪŋ",
      example: "Learning new skills is exciting.",
      exampleArabic: "تعلم مهارات جديدة مثير."
    },
    {
      english: "Practice",
      arabic: "ممارسة",
      pronunciation: "ˈpræktɪs",
      example: "Practice makes perfect.",
      exampleArabic: "الممارسة تجعل الكمال."
    },
    {
      english: "Goal",
      arabic: "هدف",
      pronunciation: "ɡəʊl",
      example: "Set clear goals for yourself.",
      exampleArabic: "ضع أهدافاً واضحة لنفسك."
    },
    {
      english: "Focus",
      arabic: "تركيز",
      pronunciation: "ˈfəʊkəs",
      example: "Focus on your studies.",
      exampleArabic: "ركز على دراستك."
    },
    {
      english: "Excellence",
      arabic: "تميز",
      pronunciation: "ˈeksələns",
      example: "Strive for excellence.",
      exampleArabic: "اسعَ للتميز."
    }
  ]
};

// Grammar session content
export const grammarSessionContent = {
  rules: [
    {
      title: "Present Perfect Tense",
      explanation: "نستخدم Present Perfect للتحدث عن أفعال بدأت في الماضي واستمرت إلى الحاضر أو لها أثر في الحاضر",
      formula: "have/has + past participle",
      examples: [
        { english: "I have studied English for 5 years", arabic: "أنا أدرس الإنجليزية منذ 5 سنوات" },
        { english: "She has finished her homework", arabic: "هي أنهت واجبها" },
        { english: "They have visited many countries", arabic: "هم زاروا العديد من البلدان" }
      ]
    },
    {
      title: "Articles (a/an/the)",
      explanation: "نستخدم a/an للشيء غير المحدد، و the للشيء المحدد أو المذكور سابقاً",
      formula: "a/an = غير محدد | the = محدد",
      examples: [
        { english: "I bought a book", arabic: "اشتريت كتاباً (غير محدد)" },
        { english: "The book is interesting", arabic: "الكتاب مثير للاهتمام (محدد)" },
        { english: "She is an excellent teacher", arabic: "هي معلمة ممتازة" }
      ]
    },
    {
      title: "Prepositions of Time",
      explanation: "نستخدم in للسنة/الشهر/الصباح/المساء، on لليوم/التاريخ، at للساعة",
      formula: "in = year/month | on = day | at = time",
      examples: [
        { english: "I was born in 1995", arabic: "ولدت عام 1995" },
        { english: "The meeting is on Monday", arabic: "الاجتماع يوم الاثنين" },
        { english: "We start at 9 AM", arabic: "نبدأ الساعة 9 صباحاً" }
      ]
    }
  ]
};

// Reading session content
export const readingSessionContent = {
  stories: [
    {
      title: "The Power of Learning",
      arabicTitle: "قوة التعلم",
      content: `Learning is a journey that never ends. Every day brings new opportunities to grow and discover. When we open our minds to knowledge, we open doors to endless possibilities. The most successful people in the world are those who never stop learning. They understand that education is not just about school, but about life itself.`,
      arabicContent: `التعلم هو رحلة لا تنتهي أبداً. كل يوم يأتي بفرص جديدة للنمو والاكتشاف. عندما نفتح عقولنا للمعرفة، نفتح أبواباً لإمكانيات لا حصر لها. أنجح الناس في العالم هم أولئك الذين لا يتوقفون عن التعلم. يفهمون أن التعلم ليس مجرد مدرسة، بل هو الحياة نفسها.`,
      questions: [
        {
          question: "What is learning according to the passage?",
          options: ["A destination", "A journey", "A problem", "A waste of time"],
          correct: 1,
          explanation: "The passage says 'Learning is a journey that never ends'"
        },
        {
          question: "What do successful people understand?",
          options: ["Learning is only in school", "Education is expensive", "Learning continues throughout life", "Knowledge is not important"],
          correct: 2,
          explanation: "The passage says successful people understand that education is about life itself"
        }
      ]
    }
  ]
};
