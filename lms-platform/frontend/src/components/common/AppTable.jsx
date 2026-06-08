import React from 'react';

export const AppTable = ({ columns, data, emptyMessage = "No records found." }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-50/50 transition group">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
