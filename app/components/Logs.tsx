"use client";

interface Props {
  logs: string;
}

export default function Logs({ logs }: Props) {
  return (
    <code className="mt-6 w-full max-w-[1200px] max-h-96 border border-gray-300 rounded-lg bg-gray-100 p-4 text-sm whitespace-pre-wrap overflow-y-auto">
      {logs}
    </code>
  );
}
