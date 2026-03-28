import { askAiTutor, generateDynamicContent, translateAiText } from '../core/api';

type ChatResponse = {
  reply: string;
  correction: string;
};

type ReadingResponse = {
  title: string;
  text: string;
  questions: Array<{
    question: string;
    options: string[];
    answer: number;
  }>;
};

type TranslationResponse = {
  translation: string;
  explanation: string;
};

export async function chatWithAI(message: string): Promise<ChatResponse> {
  const response = await askAiTutor({
    userMessage: message,
    scenario: 'daily',
    langCode: 'en-US',
    history: [],
  });

  return {
    reply: response.reply || 'Let us keep practicing together.',
    correction: response.correction || 'Perfect!',
  };
}

export async function generateReading(topic: string, level: string): Promise<ReadingResponse> {
  const response = await generateDynamicContent({ topic, level, mode: 'story' });
  const content = response.content || {};
  const questions = Array.isArray(content.questions)
    ? content.questions
        .filter(
          (
            item
          ): item is {
            question: string;
            options: string[];
            answer: number;
          } => Boolean(
            item
            && typeof item === 'object'
            && typeof item.question === 'string'
            && Array.isArray(item.options)
            && typeof item.answer === 'number'
          )
        )
    : [];

  return {
    title: typeof content.title === 'string' ? content.title : topic || 'Daily Life',
    text: typeof content.text === 'string'
      ? content.text
      : `This is a short ${level} reading about ${topic || 'daily life'}.`,
    questions: questions.length > 0
      ? questions
      : [
          {
            question: 'What is the topic of the text?',
            options: [topic || 'Daily life', 'Math', 'Science', 'Art'],
            answer: 0,
          },
        ],
  };
}

export async function translateWithAI(text: string): Promise<TranslationResponse> {
  const response = await translateAiText(text);

  return {
    translation: response.translation || text,
    explanation: response.explanation || 'تعذر إنشاء شرح نحوي في الوقت الحالي.',
  };
}
