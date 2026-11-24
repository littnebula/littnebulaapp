import { Card } from 'react-bootstrap';
import Link from 'next/link';

type Props = {
  id: number;
  title: string;
  description: string;
  owner: string;
  views: number;
  tags: string[];
};

const WordCloudCard = ({
  id,
  title,
  description,
  owner,
  views,
  tags,
}: Props) => {
  return (
    <Card
      className="h-100 text-light border-secondary"
      style={{
        maxWidth: '400px',
        backgroundColor: 'rgba(20, 20, 20, 0.65)',
      }}
    >
      <Link
        href={`/examine/${id}`}
        className="text-decoration-none text-reset"
      >
        <div className="card-body">
          <h5 className="card-title">
            {title}
          </h5>

          <p className="card-text text-secondary">
            {description}
          </p>

          <p className="mb-2">
            <small>
              Owner: {owner}
            </small>
          </p>

          <p className="mb-2">
            <small>Views: {views}</small>
          </p>

          <div>
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge bg-secondary me-1 mb-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default WordCloudCard;
