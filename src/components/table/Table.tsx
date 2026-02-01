import type { Key, ReactNode } from 'react';
import './table.css';
import { useColumnResizing } from './useColumnResizing';

export type TableColumn<Row> = {
  key: string
  label: string
  render: (row: Row) => ReactNode
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

const Table = <Row,>({ columns, rows, getRowKey, visibleColumnKeys, stickyHeader = true, id, onRowContextMenu }: TableProps<Row>) => {
  const visible = visibleColumnKeys
    ? columns.filter((col) => visibleColumnKeys.includes(col.key))
    : columns

  //const colSpan = Math.max(visible.length, 1) // Approximation due to dividers

  const { widths, startResize } = useColumnResizing(id, visible);

  return (
    <div className="table-container">
      <table className={`main-table ${stickyHeader ? 'sticky-header-table' : 'normal-header-table'}`.trim()} style={{ tableLayout: Object.keys(widths).length > 0 ? 'fixed' : 'auto' }}>
        <thead>
          <tr>
            {visible.map((col, index) => (
              <>
                <th
                  key={col.key}
                  data-key={col.key}
                  style={{ width: widths[col.key] ? `${widths[col.key]}%` : 'auto', boxSizing: 'border-box' }}
                >
                  <span className="th-content">{col.label}</span>
                </th>
                {index < visible.length - 1 && (
                  <th key={`divider-${col.key}`} className="column-divider-cell">
                    <button
                      className="column-divider-button"
                      aria-label="Divisor de columna"
                      onMouseDown={(e) => startResize(col.key, visible[index + 1].key, e)}
                    />
                  </th>
                )}
              </>
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
          {rows.map((row, index) => (
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
                <>
                  <td key={col.key} style={{ width: widths[col.key] ? `${widths[col.key]}%` : 'auto', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {col.render(row)}
                  </td>
                  {colIndex < visible.length - 1 && (
                    <td key={`divider-${col.key}`} className="column-divider-cell">
                      <div className="column-divider-spacer" />
                    </td>
                  )}
                </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table