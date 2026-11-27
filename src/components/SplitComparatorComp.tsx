'use client';

import React, { useState } from 'react';
import DragDropBoxes, { Item } from '@/components/draganddropdemo';
import { Collection, Word, WordCloud } from '@prisma/client';
import { Col, Container, Row } from 'react-bootstrap';
import WordCloudVisualizer from './WordCloudVisualizer';
import { getFormattedData } from '@/lib/WordCloudActions';

export default function SplitComparator({
  collData,
  wordclouds,
  allwords,
}: {
  collData: Collection;
  wordclouds: WordCloud[];
  allwords: Word[][];
}) {
  // Initialize once using a lazy initializer function
  const [items, setItems] = useState<Item[]>(() =>
    wordclouds.map((wc, idx) => ({
      id: `${idx}`,
      label: wc.title,
      location: 'pool',
    }))
  );

  const [leftwords, setLeftwords] = useState<Word[]>([]);
  const [rightwords, setRightwords] = useState<Word[]>([]);

  const handleItemsChange = (updatedItems: Item[]) => {
    setItems(updatedItems);

    const boxLeft = updatedItems.filter((item) => item.location === 'box1');
    const boxRight = updatedItems.filter((item) => item.location === 'box2');

    const leftbuffer: Word[] = [];
    const rightbuffer: Word[] = [];

    boxLeft.forEach((wc) => {
      const wordsForCloud = allwords[Number(wc.id)];
      if (wordsForCloud) leftbuffer.push(...wordsForCloud);
    });

    boxRight.forEach((wc) => {
      const wordsForCloud = allwords[Number(wc.id)];
      if (wordsForCloud) rightbuffer.push(...wordsForCloud);
    });

    setLeftwords(leftbuffer);
    setRightwords(rightbuffer);
  };

  const formattedLeft = getFormattedData(leftwords, 20);
  const formattedRight = getFormattedData(rightwords, 20);

  return (
    <Container className="py-5">
      <Container>
        <DragDropBoxes
          initialItems={items}
          onItemsChange={handleItemsChange}
        />
      </Container>
      <Container>
        <Row>
          <Col>
            <WordCloudVisualizer
              FormattedWordCloudData={formattedLeft}
              sizing={0.4}
              seed={12}
              viewWidth={180}
              viewHeight={200}
              color={`hsl(${collData.leftdisplayColorHue}, ${collData.leftdisplayColorSat}%, ${collData.leftdisplayColorLit}%)`}
            />
          </Col>
          <Col>
            <WordCloudVisualizer
              FormattedWordCloudData={formattedRight}
              sizing={0.4}
              seed={1}
              viewWidth={180}
              viewHeight={200}
              color={`hsl(${collData.rightdisplayColorHue}, ${collData.rightdisplayColorSat}%, ${collData.rightdisplayColorLit}%)`}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
