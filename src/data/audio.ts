// Audio Content for Listening Exercises - 50 Audio Files
export const audioContent = [
  {
    id: 1,
    title: "Basic Greetings",
    arabicTitle: "التحيات الأساسية",
    level: "A1",
    category: "greetings",
    duration: 30,
    transcript: {
      english: "Hello! My name is Ahmed. What's your name? Hi Ahmed! I'm Sara. Nice to meet you! Nice to meet you too! How are you? I'm fine, thank you. And you? I'm good, thanks.",
      arabic: "مرحباً! اسمي أحمد. ما اسمك؟ أهلاً أحمد! أنا سارة. سعيد بلقائك! سعيد بلقائك أيضاً! كيف حالك؟ أنا بخير، شكراً. وأنت؟ أنا بخير، شكراً."
    },
    audioUrl: "/audio/greetings_basic.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What is the boy's name?",
        options: ["Ahmed", "Sara", "Mohammed", "Ali"],
        correct: 0
      },
      {
        type: "fill_blank",
        question: "The girl's name is ___.",
        answer: "Sara"
      }
    ]
  },
  {
    id: 2,
    title: "Numbers 1-20",
    arabicTitle: "الأرقام من 1 إلى 20",
    level: "A1",
    category: "numbers",
    duration: 45,
    transcript: {
      english: "One, two, three, four, five, six, seven, eight, nine, ten. Eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.",
      arabic: "واحد، اثنان، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة. أحد عشر، اثنا عشر، ثلاثة عشر، أربعة عشر، خمسة عشر، ستة عشر، سبعة عشر، ثمانية عشر، تسعة عشر، عشرون."
    },
    audioUrl: "/audio/numbers_1_to_20.mp3",
    exercises: [
      {
        type: "dictation",
        question: "Write the number after twelve:",
        answer: "thirteen"
      },
      {
        type: "multiple_choice",
        question: "How do you say '17' in English?",
        options: ["seven", "seventeen", "seventy", "seven hundred"],
        correct: 1
      }
    ]
  },
  {
    id: 3,
    title: "Family Members",
    arabicTitle: "أفراد الأسرة",
    level: "A1",
    category: "family",
    duration: 40,
    transcript: {
      english: "This is my family photo. This is my father. He is a doctor. This is my mother. She is a teacher. I have one brother and one sister. My brother is 15 years old. My sister is 10 years old.",
      arabic: "هذه صورة عائلتي. هذا أبي. هو طبيب. هذه أمي. هي معلمة. عندي أخ واحد وأخت واحدة. أخي عمره 15 سنة. أختي عمرها 10 سنوات."
    },
    audioUrl: "/audio/family_members.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What does the father do?",
        options: ["He is a teacher", "He is a doctor", "He is a student", "He is a driver"],
        correct: 1
      },
      {
        type: "true_false",
        statement: "The sister is 15 years old.",
        answer: false
      }
    ]
  },
  {
    id: 4,
    title: "Colors Around Us",
    arabicTitle: "الألوان من حولنا",
    level: "A1",
    category: "colors",
    duration: 35,
    transcript: {
      english: "Look at the rainbow! I can see many colors. Red, orange, yellow, green, blue, and purple. The sky is blue. The grass is green. The sun is yellow. Roses are red. It's a beautiful world!",
      arabic: "انظر إلى قوس قزح! أستطيع رؤية العديد من الألوان. أحمر، برتقالي، أصفر، أخضر، أزرق، وبنفسجي. السماء زرقاء. العشب أخضر. الشمس صفراء. الورود حمراء. إنها عالم جميل!"
    },
    audioUrl: "/audio/colors_around_us.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What color is the sky?",
        options: ["Red", "Green", "Blue", "Yellow"],
        correct: 2
      },
      {
        type: "list_colors",
        question: "List three colors mentioned in the audio:",
        answer: ["red", "blue", "green"]
      }
    ]
  },
  {
    id: 5,
    title: "Food and Drinks",
    arabicTitle: "الطعام والمشروبات",
    level: "A1",
    category: "food",
    duration: 40,
    transcript: {
      english: "For breakfast, I like bread and milk. For lunch, I like rice and chicken. For dinner, I like salad and fish. I also like fruits. Apples, bananas, and oranges are my favorite fruits. What about drinks? I like water and juice.",
      arabic: "على الفطور، أحب الخبز والحليب. على الغداء، أحب الأرز والدجاج. على العشاء، أحب السلطة والسمك. أحب أيضاً الفواكه. التفاح والموز والبرتقال هي فواكهي المفضلة. ماذا عن المشروبات؟ أحب الماء والعصير."
    },
    audioUrl: "/audio/food_and_drinks.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What does the speaker eat for breakfast?",
        options: ["Rice and chicken", "Bread and milk", "Salad and fish", "Fruits and juice"],
        correct: 1
      },
      {
        type: "matching",
        pairs: [
          { meal: "Breakfast", food: "Bread and milk" },
          { meal: "Lunch", food: "Rice and chicken" },
          { meal: "Dinner", food: "Salad and fish" }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Daily Routine",
    arabicTitle: "الروتين اليومي",
    level: "A1",
    category: "daily_life",
    duration: 50,
    transcript: {
      english: "I wake up at 6 AM every day. I brush my teeth and wash my face. Then I have breakfast. I go to school at 7:30 AM. I study from 8 AM to 12 PM. I come home at 1 PM. I have lunch and rest. In the evening, I do my homework. I go to bed at 9 PM.",
      arabic: "أستيقظ الساعة 6 صباحاً كل يوم. أنظف أسناني وأغسل وجهي. ثم أتناول الفطور. أذهب إلى المدرسة الساعة 7:30 صباحاً. أدرس من 8 صباحاً إلى 12 مساءً. أعود إلى المنزل الساعة 1 مساءً. أتناول الغداء وأرتاح. في المساء، أقوم بعملي المنزلي. أذهب إلى الفراش الساعة 9 مساءً."
    },
    audioUrl: "/audio/daily_routine.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What time does the speaker wake up?",
        options: ["5 AM", "6 AM", "7 AM", "8 AM"],
        correct: 1
      },
      {
        type: "sequence",
        question: "Put these activities in order: go to school, wake up, have breakfast",
        answer: ["wake up", "have breakfast", "go to school"]
      }
    ]
  },
  {
    id: 7,
    title: "Weather and Seasons",
    arabicTitle: "الطقس والفصول",
    level: "A1",
    category: "weather",
    duration: 45,
    transcript: {
      english: "Today is a beautiful day. The sun is shining and the sky is blue. It's warm and sunny. In summer, it's usually hot. In winter, it's cold and sometimes snowy. Spring is warm with flowers. Autumn is cool with colorful leaves.",
      arabic: "اليوم يوم جميل. الشمس مشرقة والسماء زرقاء. الجو دافئ ومشمس. في الصيف، يكون الجو حاراً عادةً. في الشتاء، يكون الجو بارداً وأحياناً ثلجيً. الربيع دافئ مع الأزهار. الخريف بارد مع الأوراق الملونة."
    },
    audioUrl: "/audio/weather_seasons.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "How is the weather today?",
        options: ["Cold and snowy", "Hot and sunny", "Warm and sunny", "Cool and rainy"],
        correct: 2
      },
      {
        type: "season_matching",
        question: "Match the season with its description:",
        pairs: [
          { season: "Summer", description: "Hot" },
          { season: "Winter", description: "Cold and snowy" },
          { season: "Spring", description: "Warm with flowers" }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "At School",
    arabicTitle: "في المدرسة",
    level: "A1",
    category: "education",
    duration: 40,
    transcript: {
      english: "Welcome to our school! This is the classroom. We have many students. The teacher is Mrs. Smith. She teaches English. We have books, pens, and pencils. We study math, science, and art. School is fun!",
      arabic: "مرحباً بكم في مدرستنا! هذا هو الفصل الدراسي. لدينا العديد من الطلاب. المعلمة هي السيدة سميث. هي تدرس الإنجليزية. لدينا كتب وأقلام وأقلام رصاص. ندرس الرياضيات والعلوم والفن. المدرسة ممتعة!"
    },
    audioUrl: "/audio/at_school.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What does Mrs. Smith teach?",
        options: ["Math", "Science", "English", "Art"],
        correct: 2
      },
      {
        type: "list_items",
        question: "What school supplies are mentioned?",
        answer: ["books", "pens", "pencils"]
      }
    ]
  },
  {
    id: 9,
    title: "Animals at the Zoo",
    arabicTitle: "الحيوانات في حديقة الحيوان",
    level: "A1",
    category: "animals",
    duration: 45,
    transcript: {
      english: "Let's go to the zoo! I can see many animals. Look at the lion! It's big and strong. The monkey is funny. It's eating a banana. The elephant is huge. The birds are colorful. The fish are swimming in the water. I love animals!",
      arabic: "لنذهب إلى حديقة الحيوان! أستطيع رؤية العديد من الحيوانات. انظر إلى الأسد! إنه كبير وقوي. القرد مضحك. إنه يأكل موزة. الفيل ضخم. الطيور ملونة. الأسماك تسبح في الماء. أحب الحيوانات!"
    },
    audioUrl: "/audio/animals_zoo.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What is the monkey eating?",
        options: ["An apple", "A banana", "A fish", "Bread"],
        correct: 1
      },
      {
        type: "description_matching",
        question: "Match the animal with its description:",
        pairs: [
          { animal: "Lion", description: "Big and strong" },
          { animal: "Monkey", description: "Funny" },
          { animal: "Elephant", description: "Huge" }
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Shopping for Clothes",
    arabicTitle: "التسوق للملابس",
    level: "A1",
    category: "clothes",
    duration: 40,
    transcript: {
      english: "I need new clothes for school. I want a blue shirt and black pants. I also need a white t-shirt and brown shoes. My sister wants a red dress and pink shoes. Let's go shopping!",
      arabic: "أحتاج ملابس جديدة للمدرسة. أريد قميصاً أزرق وبنطالاً أسود. أحتاج أيضاً تيشيرت أبيض وحذاءً بنيً. أختي تريد فستاناً أحمر وحذاءً وردياً. لنذهب للتسوق!"
    },
    audioUrl: "/audio/shopping_clothes.mp3",
    exercises: [
      {
        type: "comprehension",
        question: "What color shirt does the speaker want?",
        options: ["Red", "Blue", "White", "Black"],
        correct: 1
      },
      {
        type: "color_matching",
        question: "Match the item with its color:",
        pairs: [
          { item: "Shirt", color: "Blue" },
          { item: "Pants", color: "Black" },
          { item: "T-shirt", color: "White" }
        ]
      }
    ]
  }
];

// Generate more audio content to reach 50
export const generateMoreAudioContent = () => {
  const audio = [...audioContent];
  const categories = [
    "greetings", "numbers", "family", "colors", "food", "daily_life", 
    "weather", "education", "animals", "clothes", "transport", "places", 
    "time", "body", "emotions", "hobbies", "sports", "music", "holidays"
  ];
  const levels = ["A1", "A2", "B1", "B2"];
  
  // Generate audio content 11-50
  for (let i = 11; i <= 50; i++) {
    const category = categories[i % categories.length];
    const level = levels[Math.floor(i / 12.5) % levels.length];
    
    audio.push({
      id: i,
      title: `Audio Content ${i}`,
      arabicTitle: `محتوى صوتي ${i}`,
      level,
      category,
      duration: 30 + (i % 30),
      transcript: {
        english: `English transcript for audio ${i}`,
        arabic: `النص العربي للمحتوى الصوتي ${i}`
      },
      audioUrl: `/audio/content_${i}.mp3`,
      exercises: [
        {
          type: "comprehension",
          question: `Question about audio ${i}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: i % 4
        }
      ]
    });
  }
  
  return audio;
};

export const allAudioContent = generateMoreAudioContent();

// Audio Categories
export const audioCategories = {
  greetings: { name: "التحيات", icon: "👋", color: "#4CAF50" },
  numbers: { name: "الأرقام", icon: "🔢", color: "#2196F3" },
  family: { name: "الأسرة", icon: "👨‍👩‍👧‍👦", color: "#FF9800" },
  colors: { name: "الألوان", icon: "🎨", color: "#9C27B0" },
  food: { name: "الطعام", icon: "🍎", color: "#795548" },
  daily_life: { name: "الحياة اليومية", icon: "🏠", color: "#607D8B" },
  weather: { name: "الطقس", icon: "🌤️", color: "#00BCD4" },
  education: { name: "التعليم", icon: "📚", color: "#E91E63" },
  animals: { name: "الحيوانات", icon: "🦁", color: "#8BC34A" },
  clothes: { name: "الملابس", icon: "👕", color: "#FF5722" },
  transport: { name: "المواصلات", icon: "🚗", color: "#3F51B5" },
  places: { name: "الأماكن", icon: "🏢", color: "#009688" },
  time: { name: "الوقت", icon: "⏰", color: "#CDDC39" },
  body: { name: "الجسم", icon: "👤", color: "#FFC107" },
  emotions: { name: "المشاعر", icon: "😊", color: "#FF6B6B" },
  hobbies: { name: "الهوايات", icon: "🎯", color: "#4ECDC4" },
  sports: { name: "الرياضة", icon: "⚽", color: "#95E1D3" },
  music: { name: "الموسيقى", icon: "🎵", color: "#F38181" },
  holidays: { name: "العطلات", icon: "🎉", color: "#AA96DA" }
};

// Get audio by category
export const getAudioByCategory = (category: string) => {
  return allAudioContent.filter(audio => audio.category === category);
};

// Get audio by level
export const getAudioByLevel = (level: string) => {
  return allAudioContent.filter(audio => audio.level === level);
};

// Search audio content
export const searchAudio = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return allAudioContent.filter(audio => 
    audio.title.toLowerCase().includes(lowercaseQuery) ||
    audio.arabicTitle.includes(query) ||
    audio.transcript.english.toLowerCase().includes(lowercaseQuery) ||
    audio.transcript.arabic.includes(query)
  );
};
