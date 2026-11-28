'use client';

import { Word } from "@prisma/client";
import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";

const WordListing = ({words}: {words: Word[]}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const collapsedRowsCount: number = 5;
  const firstfiveRows = isExpanded ? words : words.slice(0, collapsedRowsCount);
  const hasmoreRows = words.length > collapsedRowsCount;
  return (
    <Container>
      <Table striped bordered hover className="table-dark">
        <thead>
          <tr>
          <th>Unique Word</th>
          <th className="text-start">Count</th>
          </tr>
        </thead>
        <tbody>
          {firstfiveRows.map((w) => (
            <tr key={w.text}>
            <td>{w.text}</td>
            <td className="text-start">{w.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {hasmoreRows && (
        <Button
          type="button"
          onClick={() => setIsExpanded((toggle) => !toggle)}
          aria-expanded={isExpanded}
        >
          {isExpanded
          ? 'Show Less'
          : `Show All (${words.length - collapsedRowsCount} more)`}
        </Button>
      )}
    </Container>
)}

export default WordListing;