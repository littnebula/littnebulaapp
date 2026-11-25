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
  'sm': "Samoan",
  'id': "Indonesian",
  'ar': "Arabic",
  'vi': "Vietnamese",
  'ko': "Korean",
  'haw': "Hawaiian",
  'hwc': "Hawaiian Pidgin",
  'es': "Generic Spanish",
  'es-MX': "Mexico Spanish",
  'es-AR': "Argentina Spanish",
  'ja': "Japanese",
  'zh': "Generic Chinese",
  'zh-CN': "Simplified Chinese",
  'zh-TW': "Taiwan Chinese",
}

export function getColorOptions(): string[] {
  const palette: string[] = [];
  const colorSteps: number = 8;
  const saturation: number = 80;

  const minLightness = 50;
  const maxLightness = 100;
  
  // Row 1: Grayscale (0% saturation, lightness from 0% to 100%)
  for (let i = 0; i < colorSteps; i++) {
    const lightness = Math.round((i / (colorSteps - 1)) * (100 -minLightness) + minLightness);
    palette.push(`hsl(0, 0%, ${lightness}%)`);
  }

  // Rows 2–8: Color groups (lightness from 15% to 92% to avoid pure black/white)
  for (let j = 0; j < colorSteps; j++) {
    for (let i = 0; i < colorSteps; i++) {
      const ratio = i / (colorSteps - 1);
      const lightness = Math.round(minLightness + ratio * (maxLightness - minLightness));
      palette.push(`hsl(${j * 360.0 / colorSteps}, ${saturation}%, ${lightness}%)`);
    }
  }

  return palette; // Returns 64 colors (8 rows x 8 columns)
}

export function getHSLColor(hue: number, sat: number, lit: number): string {
  return `hsl(${hue}, ${sat}%, ${lit}%)`
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


