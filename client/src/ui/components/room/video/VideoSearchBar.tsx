import { FormEvent, useRef, useState } from 'react';
import Button from '../../Button';
import Input from '../../Input';
import { useSearchVideos } from '../../../../hooks/useSearchVideos';
import { useAppDispatch } from '../../../../store/hooks';
import {
  setSearchQuery,
  setSearchVideos,
} from '../../../../store/slices/roomSlice';

interface VideoSearchBarProps {
  handleSearchModal: (e: FormEvent<HTMLFormElement>) => void;
}

export default function VideoSearchBar({
  handleSearchModal: openSearchModal,
}: VideoSearchBarProps) {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const prevQuery = useRef('');

  const { refetch } = useSearchVideos(query);

  async function handleFormSubmit(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    openSearchModal(e);

    if (query.trim() === '' || query === prevQuery.current) return;
    dispatch(setSearchQuery(query));

    const result = await refetch();

    if (result.status === 'success' && result.data) {
      prevQuery.current = query;
      dispatch(setSearchVideos(result.data));
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex items-center justify-center gap-2 mt-2"
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a video"
        className="text-lg w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <Button
        type="submit"
        className="cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 text-lg font-medium text-white hover:bg-indigo-700 transition"
      >
        Search
      </Button>
    </form>
  );
}
