import Search from '@/components/Search';

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    tag?: string;
    sort?: string;
    submitted?: string;
  }>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const { q, type, tag, sort, submitted } = await searchParams;

  return (
    <Search
      searchTerm={q || ''}
      searchType={type || 'all'}
      selectedTag={tag || ''}
      sortBy={sort || 'recent'}
      submitted={submitted === 'true'}
    />
  );
};

export default SearchPage;
