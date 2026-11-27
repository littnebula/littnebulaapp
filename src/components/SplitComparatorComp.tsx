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
    allwords
    }: {
    collData: Collection,
    wordclouds: WordCloud[], 
    allwords: Word[][]
    }) {
  const STARTING_ITEMS: Item[] = [];
  wordclouds.forEach((wc, idx) => {
    STARTING_ITEMS.push({ id: `${idx}`, label: wc.title, location: 'pool'})
  })
  const [items, setItems] = useState<Item[]>(STARTING_ITEMS);
  const [leftwords, setLeftwords] = useState<Word[]>([]);
  const [rightwords, setRightwords] = useState<Word[]>([]);
  // This function runs automatically every time an item is dropped
  const handleItemsChange = (updatedItems: Item[]) => {
    setItems(updatedItems);

    // Example 1: Filter items currently in Box 1 and Box 2
    const boxLeft = updatedItems.filter((item) => item.location === 'box1');
    const boxRight = updatedItems.filter((item) => item.location === 'box2');
    const leftbuffer: Word[] = []
    const rightbuffer: Word[] = []
    boxLeft.forEach((wc) => {
        leftbuffer.push(...allwords[+wc.id])
    })
    boxRight.forEach((wc) => {
        rightbuffer.push(...allwords[+wc.id])
    })
    setLeftwords(leftbuffer);
    setRightwords(rightbuffer);
    // console.log('Box 1 now contains:', box1);
    // console.log('Box 2 now contains:', box2);
  };

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
            FormattedWordCloudData={getFormattedData(leftwords, 20)}
            sizing={0.4}
            seed={12}
            viewWidth={180}
            viewHeight={200}
            color={`hsl(${collData.leftdisplayColorHue}, ${collData.leftdisplayColorSat}%, ${collData.leftdisplayColorLit}%)`}
            />
          </Col>
          <Col>
            <WordCloudVisualizer 
            FormattedWordCloudData={getFormattedData(rightwords, 20)}
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
