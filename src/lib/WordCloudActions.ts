// Functions that operate on data to generate or modify word cloud data
import { Word } from "@prisma/client";

export const languageSet: Record<string, string> = {
  'en': "English",
  'fr': "French",
  'de': "Generic German",
  'de-DE': "Germany German",
  'de-AT': "Austria German",
  'ru': "Russian",
  'ru-Cyrl': "Cyrillic Russian",
  'uk': "Ukrainian",
  'hi': "Hindi",
  'fil': "Filipino",
  // 'sm': "Samoan",
  'id': "Indonesian",
  'ar': "Arabic",
  'vi': "Vietnamese",
  'ko': "Korean",
  'haw': "Hawaiian",
  // 'hwc': "Hawaiian Pidgin",
  'es': "Generic Spanish",
  'es-MX': "Mexico Spanish",
  'es-AR': "Argentina Spanish",
  'ja': "Japanese",
  'zh': "Generic Chinese",
  'zh-CN': "Simplified Chinese",
  'zh-TW': "Taiwan Chinese",
}

export interface WCGenData {
  wordcloud: Word[],
  totalwords: number,
}

export function getSupportedLocales(): Array<string> {
  const languageTags: Array<string> = [];
  for (const lang of Object.keys(languageSet)) {
    languageTags.push(lang)
  }
  return Intl.Segmenter.supportedLocalesOf(languageTags);
}

export function generateWordCloudData(sourceText: string, language: string): WCGenData {
  // console.log(getSupportedLocales())
  // Splitting text by words in language
  const words: string[] = [];
  const SegmRef: Intl.Segmenter = new Intl.Segmenter(language, {granularity: 'word'});
  const segments: Intl.Segments = SegmRef.segment(sourceText.toUpperCase());
  for (const segment of segments) {
    if (segment.isWordLike) {
      words.push(segment.segment);
    }
  }
  // Counting word repetitions
  const wordCountingBuffer: Record<string, number> = words.reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});
  // Organizing counted words into array data
  const worddata: Word[] = [];
  for (const key of Object.keys(wordCountingBuffer)) {
    worddata.push(
      {
        'text': key,
        'value': wordCountingBuffer[key],
        'annotation': '',
        'id': 0,
        'wordcloudId': 0,
      }
    )
  }
  worddata.sort((a: Word, b: Word)=> b.value - a.value)
  const totalcounter: number = words.length;
  // console.log(totalcounter);
  const newWCD: WCGenData = {
      wordcloud: worddata,
      totalwords: totalcounter,
  }
  // returns object containing array of counted words and total words in text
  return newWCD
}

export function getFormattedData(wordcloud: Word[], visiblewords: number): Word[] {
  const formattedData: Word[] = [];
  let visibleTotal: number = 0;
  for (let i: number = 0; i < Math.min(visiblewords, wordcloud.length); i++) {
    formattedData.push(
      {
        'text': wordcloud[i].text,
        'value': Math.abs(wordcloud[i].value),
        'annotation': wordcloud[i].annotation,
        'id': 0,
        'wordcloudId': 0,
      }
    )
    visibleTotal += Math.abs(wordcloud[i].value);
  }
  const scaleFactor: number = 1000 / (formattedData[0].value/ visibleTotal)
  for (let i: number = 0; i < Math.min(visiblewords, formattedData.length); i++) {
    formattedData[i].value = formattedData[i].value * scaleFactor / visibleTotal;
  }
  return formattedData;
}
