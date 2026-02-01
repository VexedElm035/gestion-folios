import React, { type Key, type ReactNode } from 'react';
import './table.css';
import { useColumnResizing } from './useColumnResizing';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

export type TableColumn<Row> = {
  key: string
  label: string
  render: (row: Row) => ReactNode
  sorter?: (a: Row, b: Row) => number
}

type TableProps<Row> = {
  columns: TableColumn<Row>[]
  rows: Row[]
  getRowKey?: (row: Row, index: number) => Key
  visibleColumnKeys?: ReadonlyArray<string>
  stickyHeader?: boolean
  id?: string // For persistence
  onRowContextMenu?: (e: React.MouseEvent, row: Row) => void
}

const Table = <Row,>({ columns, rows, getRowKey, visibleColumnKeys, stickyHeader = true, id, onRowContextMenu, defaultSort }: TableProps<Row> & { defaultSort?: { key: string; direction: 'asc' | 'desc' } }) => {
  const visible = visibleColumnKeys
    ? columns.filter((col) => visibleColumnKeys.includes(col.key))
    : columns

  // Sorting State
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(() => {
    if (id) {
      const saved = localStorage.getItem(`table-sort-${id}`);
      if (saved) return JSON.parse(saved);
    }
    return defaultSort || null;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const newConfig = { key, direction };
    setSortConfig(newConfig);
    if (id) {
      localStorage.setItem(`table-sort-${id}`, JSON.stringify(newConfig));
    }
  };

  const sortedRows = React.useMemo(() => {
    if (!sortConfig) return rows;
    const col = columns.find(c => c.key === sortConfig.key);
    if (!col) return rows;

    return [...rows].sort((a, b) => {
      if (col.sorter) {
        return sortConfig.direction === 'asc' ? col.sorter(a, b) : col.sorter(b, a);
      }
      // Default string sort
      // Since we don't know the property name on row (it's in col.key usually), assume implicit or use render?
      // Using render might return ReactNodes. Better to rely on row[key] if generic matched, or stringify.
      // However, generic Row is unknown. We'll try to cast to any for default sort access.
      const valA = (a as any)[sortConfig.key];
      const valB = (b as any)[sortConfig.key];

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig, columns]);


  const { widths, startResize } = useColumnResizing(id, visible);

  return (
    <div className="table-container">
      <table className={`main-table ${stickyHeader ? 'sticky-header-table' : 'normal-header-table'}`.trim()} style={{ tableLayout: Object.keys(widths).length > 0 ? 'fixed' : 'auto' }}>
        <thead>
          <tr>
            {visible.map((col, index) => (
              <React.Fragment key={col.key}>
                <th
                  data-key={col.key}
                  style={{ width: widths[col.key] ? `${widths[col.key]}%` : 'auto', boxSizing: 'border-box', cursor: 'pointer' }}
                  onClick={() => handleSort(col.key)}
                >
                  {/* <div className="th-content" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}> */}
                    {col.label}
                    {sortConfig?.key === col.key && (   
                      <span>{sortConfig.direction === 'asc' ? <IoIosArrowRoundDown /> : <IoIosArrowRoundUp/>}</span>
                    )}
                  {/* </div> */}
                </th>   
                {index < visible.length - 1 && (
                  <th className="column-divider-cell">
                    <button
                      className="column-divider-button"
                      aria-label="Divisor de columna"
                      onMouseDown={(e) => {
                        e.stopPropagation(); // Prevent sort trigger
                        startResize(col.key, visible[index + 1].key, e);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                )}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td colSpan={visible.length * 2}>
              <div className="links"><a href="#">&laquo;</a> <a className="active" href="#">1</a> <a href="#">2</a> <a href="#">3</a> <a href="#">4</a> <a href="#">&raquo;</a></div>
            </td>
          </tr>
        </tfoot>
        <tbody>
          {sortedRows.map((row, index) => (
            <tr
              key={getRowKey ? getRowKey(row, index) : index}
              onContextMenu={(e) => {
                if (onRowContextMenu) {
                  e.preventDefault();
                  onRowContextMenu(e, row);
                }
              }}
            >
              {visible.map((col, colIndex) => (
                <React.Fragment key={col.key}>
                  <td style={{ width: widths[col.key] ? `${widths[col.key]}%` : 'auto', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {col.render(row)}
                  </td>
                  {colIndex < visible.length - 1 && (
                    <td className="column-divider-cell">
                      <div className="column-divider-spacer" />
                    </td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table