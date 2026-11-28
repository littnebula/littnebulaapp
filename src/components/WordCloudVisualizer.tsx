'use client';

import { useMemo } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import { scaleLinear, scaleLog } from '@visx/scale';
import { Word } from '@prisma/client';

const fixedRotate = () => 0;

function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WordCloudVisualizer = ({
  FormattedWordCloudData,
  sizing,
  seed,
  viewWidth,
  viewHeight,
  color,
}: {
  FormattedWordCloudData: Word[];
  sizing: number;
  seed: number;
  viewWidth: number;
  viewHeight: number;
  color: string;
}) => {
  // Forces @visx/wordcloud to re-run layout whenever words or values change
  const cloudKey = useMemo(() => {
    const signature = FormattedWordCloudData.map(
      (w) => `${w.text}:${w.value}`
    ).join('|');
    return `${seed}-${sizing}-${viewWidth}x${viewHeight}-${signature}`;
  }, [FormattedWordCloudData, seed, sizing, viewWidth, viewHeight]);

  // Prevents d3-cloud from mutating original Word objects in state
  const wordsCopy = useMemo(
    () => FormattedWordCloudData.map((w) => ({ ...w })),
    [FormattedWordCloudData]
  );

  const randomGenerator = useMemo(() => createSeededRandom(seed), [seed]);

  const values = wordsCopy.map((w) => w.value);
  const min = values.length ? Math.max(1, Math.min(...values)) : 1;
  const max = values.length ? Math.max(min, Math.max(...values)) : 1;

  const minSize = 24 * sizing;
  const maxSize = 72 * sizing;

  const fontScale = scaleLog({
    domain: [min, max],
    range: [minSize, maxSize],
  });

  const colorScale = scaleLinear<string>({
    domain: [minSize, maxSize],
    range: [color, '#ffffff'],
    clamp: true,
  });

  return (
    <Container>
      <Card id="darkcard1">
        <Container
          style={{
            width: `${viewWidth}px`,
            height: `${viewHeight}px`,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {wordsCopy.length > 0 && (
            <Wordcloud
              key={cloudKey}
              words={wordsCopy}
              width={viewWidth * 0.9}
              height={viewHeight * 0.9}
              fontSize={(datum) => fontScale(Math.max(1, datum.value))}
              fontWeight="normal"
              font="Arial"
              padding={6}
              spiral="archimedean"
              rotate={fixedRotate}
              random={randomGenerator}
            >
              {(cloudWords) =>
                cloudWords.map((w) => (
                  <Text
                    key={w.text}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    dominantBaseline="ideographic"
                    transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate ?? 0})`}
                    fontSize={w.size}
                    fontFamily={w.font}
                    fill={colorScale(w.size ?? minSize)}
                  >
                    {w.text}
                  </Text>
                ))
              }
            </Wordcloud>
          )}
        </Container>
      </Card>
    </Container>
  );
};

export default WordCloudVisualizer;
