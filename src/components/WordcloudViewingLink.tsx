'use client';
import { WordCloud } from "@prisma/client";
import Link from "next/link";
import { languageSet } from "@/lib/WordCloudActions";

function truncateString(str: string, limit: number) {
  if (str.length > limit) {
    return str.slice(0, limit-2) +"...";
  }
  return str
}

const WordCloudViewLink = ({wc}: {wc: WordCloud}) => {
  const titleline: string = truncateString(wc.title, 24) + ", by: " + truncateString(wc.owner, 18);
  const infoline: string = `${languageSet[wc.language]}, [ ${wc.tags.slice(0, 3).join(", ")} ${wc.tags.length > 3 ? ', ...]' : ']'}`;
  return (
  <Link
    href={`/examine/${wc.id}`}
    className='btn btn-gradient-grn my-1 d-block w-100'
  >
    <h6>{titleline}</h6>
    <p>{infoline}</p>
  </Link>
)};

export default WordCloudViewLink;
