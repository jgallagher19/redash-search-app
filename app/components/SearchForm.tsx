"use client";
import { useState } from "react";

interface Props {
  onSearch: (keyword: string) => void;
}

export default function SearchForm({ onSearch }: Props) {
  const [keyword, setKeyword] = useState("");

  const submit = () => {
    onSearch(keyword);
  };

  return (
    <div className="w-full max-w-xl mb-6">
      <input
        type="text"
        placeholder="Search keyword..."
        className="border p-2 rounded w-full bg-white text-black"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button
        onClick={submit}
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Search CSV
      </button>
    </div>
  );
}
