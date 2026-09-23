import { flexRender, Table as TableType } from "@tanstack/react-table";

interface TableProps<T> {
  table: TableType<T>;
}

const Table = <T,>({ table }: TableProps<T>): JSX.Element => {
  return (
    <table className="relative w-full bg-white">
      <thead className="text-xs text-black w-full uppercase">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="py-3 px-4 sticky top-0 bg-qp-gray text-slate-600 text-left"
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr className="border-t border-qp-dark-gray px-4" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                  }}
                  className="py-4 px-4 text-xs text-slate-600"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
