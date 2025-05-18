"use client";
import { useState } from "react";

interface Props {
  results: any[];
}

export default function ResultsTable({ results }: Props) {
  const [expandedCell, setExpandedCell] = useState<{ rowIndex: number; colKey: string } | null>(null);

  const toggle = (rowIndex: number, colKey: string) => {
    if (expandedCell && expandedCell.rowIndex === rowIndex && expandedCell.colKey === colKey) {
      setExpandedCell(null);
    } else {
      setExpandedCell({ rowIndex, colKey });
    }
  };

  const truncateCellClasses =
    "inline-block overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer max-w-[120px] align-top";
  const expandedCellClasses =
    "inline-block whitespace-normal break-words bg-yellow-100 p-1 rounded cursor-pointer align-top";

  if (results.length === 0) {
    return <p className="italic text-gray-700">No results yet.</p>;
  }

  return (
    <div className="w-full max-w-5xl rounded-lg bg-white shadow-md p-4 border border-gray-300">
      <h3 className="font-bold mb-2 text-gray-900">Search Results:</h3>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full text-left text-sm text-gray-800">
          <thead>
            <tr>
              {Object.keys(results[0]).map((colKey) => (
                <th key={colKey} className="border-b border-gray-200 px-2 py-2 bg-gray-100 font-bold">
                  {colKey}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((colKey) => {
                  const cellValue = String(row[colKey]);
                  const isExpanded = expandedCell && expandedCell.rowIndex === rowIndex && expandedCell.colKey === colKey;
                  return (
                    <td
                      key={colKey}
                      className="border-b border-gray-200 px-2 py-2 align-top"
                      onClick={() => toggle(rowIndex, colKey)}
                    >
                      {isExpanded ? (
                        <div className={expandedCellClasses}>{cellValue}</div>
                      ) : (
                        <div className={truncateCellClasses}>{cellValue}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
