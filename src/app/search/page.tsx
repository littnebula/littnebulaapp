import Search from '@/components/Search';

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    tag?: string;
    submitted?: string;
  }>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const { q, type, tag, submitted } = await searchParams;

  return (
    <Search
      searchTerm={q || ''}
      searchType={type || 'all'}
      selectedTag={tag || ''}
      submitted={submitted === 'true'}
    />
  );
};

export default SearchPage;
