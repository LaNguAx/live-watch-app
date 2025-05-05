import { FormEvent, useState } from 'react';
import Button from '../../Button';
import Input from '../../Input';

interface VideoSearchBarProps {
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
}

export default function VideoSearchBar({ handleSearch }: VideoSearchBarProps) {
  const [text, setText] = useState('');

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center gap-2 mt-2"
    >
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search for a video"
        className="text-xs w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <Button
        type="submit"
        className="cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition"
      >
        Search
      </Button>
    </form>
  );
}
