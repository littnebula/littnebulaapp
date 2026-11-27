'use client';

import { Card, Container } from 'react-bootstrap';
import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { Word } from '@prisma/client';

const fixedRotate = () => 0;
// const fixedRandom = () => 0.5;
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
}: {
  FormattedWordCloudData: Word[];
  sizing: number;
  seed: number;
  viewWidth: number;
  viewHeight: number
}) => {
  const values = FormattedWordCloudData.map((w) => w.value);
  const min = values.length ? Math.max(1, Math.min(...values)) : 1;
  const max = values.length ? Math.max(min, Math.max(...values)) : 1;

  const fontScale = scaleLog({
    domain: [min, max],
    range: [24 * sizing, 72 * sizing],
  });

  return (
    <Container>
      <Card id="darkcard1">
        <Container style={{
          width: `${viewWidth}px`,
          height: `${viewHeight}px`,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {FormattedWordCloudData.length > 0 && (
            <Wordcloud
              words={FormattedWordCloudData}
              width={viewWidth}
              height={viewHeight}
              fontSize={(datum) => fontScale(Math.max(1, datum.value))}
              fontWeight="normal"
              font="Arial"
              padding={4}
              spiral="archimedean"
              rotate={fixedRotate}
              random={createSeededRandom(seed)}
            >
              {(cloudWords) => (
              cloudWords.map((w) => (
                  <Text
                    key={w.text}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    dominantBaseline="ideographic"
                    transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate ?? 0})`}
                    fontSize={w.size}
                    fontFamily={w.font}
                    fill='White'
                  >
                    {w.text}
                  </Text>
                ))
              )}
            </Wordcloud>
          )}
        </Container>
      </Card>
    </Container>
  );
};

export default WordCloudVisualizer;