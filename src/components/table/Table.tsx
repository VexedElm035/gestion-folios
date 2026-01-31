import type { Key, ReactNode } from 'react';
import './table.css';

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
}

const Table = <Row,>({ columns, rows, getRowKey, visibleColumnKeys, stickyHeader = true }: TableProps<Row>) => {
  const visible = visibleColumnKeys
    ? columns.filter((col) => visibleColumnKeys.includes(col.key))
    : columns

  const colSpan = Math.max(visible.length, 1)

  return (
    <div className="table-container">
    <table className={`main-table ${stickyHeader ? 'sticky-header-table' : 'normal-header-table'}`.trim()}>
        <thead>
            <tr>
                {visible.map((col, index) => (
                  <>
                    <th key={col.key}>{col.label}</th>
                    {index < visible.length - 1 && (
                      <th key={`divider-${col.key}`} className="column-divider-cell">
                        <button className="column-divider-button" aria-label="Divisor de columna" />
                      </th>
                    )}
                  </>
                ))}
            </tr>
        </thead>
        <tfoot>
          <tr>
          <td colSpan={colSpan}>
          <div className="links"><a href="#">&laquo;</a> <a className="active" href="#">1</a> <a href="#">2</a> <a href="#">3</a> <a href="#">4</a> <a href="#">&raquo;</a></div>
          </td>
          </tr>
        </tfoot>
        <tbody>
            {rows.map((row, index) => (
                <tr key={getRowKey ? getRowKey(row, index) : index}>
                    {visible.map((col, colIndex) => (
                      <>
                        <td key={col.key}>{col.render(row)}</td>
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