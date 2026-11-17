'use client';
import { WordCloud } from "@prisma/client";
import Link from "next/link";

function truncateString(str: string, limit: number) {
  if (str.length > limit) {
    return str.slice(0, limit-2) +"...";
  }
  return str
}

const WordCloudViewLink = ({wc}: {wc: WordCloud}) => {
  const titleline = truncateString(wc.title, 20) + ", by: " + truncateString(wc.owner, 20);
  const infoline = `[ ${wc.tags.slice(0, 3).join(", ")} ${wc.tags.length > 3 ? ', ...]' : ']'}`;
  return (
  <Link
    href={`/examine/${wc.id}`}
    className='btn btn-gradient-grn mx-5 my-1 d-block w-100'
  >
    <h5>{titleline}</h5>
    <p>{infoline}</p>
  </Link>
)};

export default WordCloudViewLink;
