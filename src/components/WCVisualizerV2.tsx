'use client';

import { Card, Container } from 'react-bootstrap';
import { Wordcloud } from '@visx/wordcloud';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { Word } from '@prisma/client';

const fixedRotate = () => 0;
const fixedRandom = () => 0.5;

const WordCloudVisualizerv2 = ({
  FormattedWordCloudData,
  sizing,
}: {
  FormattedWordCloudData: Word[];
  sizing: number;
}) => {const values = FormattedWordCloudData.map((w) => w.value);
  const min = values.length ? Math.max(1, Math.min(...values)) : 1;
  const max = values.length ? Math.max(min, Math.max(...values)) : 1;

  const fontScale = scaleLog({
    domain: [min, max],
    range: [24 * sizing, 96 * sizing],
  });

  return (
    <Container>
      <Card id="darkcard1">
        <div style={{ width: '400px', height: '400px', margin: 'auto' }}>
          {FormattedWordCloudData.length > 0 && (
            <Wordcloud
              words={FormattedWordCloudData}
              width={400 * sizing}
              height={400 * sizing}
              fontSize={(datum) => fontScale(Math.max(1, datum.value))}
              font="Arial"
              rotate={fixedRotate}
              random={fixedRandom}
            >
              {(cloudWords) =>
                cloudWords.map((w, i) => (
                  <Text
                    key={`${w.text}-${i}`}
                    fill="white"
                    textAnchor="middle"
                    transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                    fontSize={w.size}
                    fontFamily={w.font}
                  >
                    {w.text}
                  </Text>
                ))
              }
            </Wordcloud>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default WordCloudVisualizerv2;