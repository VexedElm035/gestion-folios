import './table.css';

import type { Key, ReactNode } from 'react';

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
}

const Table = <Row,>({ columns, rows, getRowKey, visibleColumnKeys }: TableProps<Row>) => {
  const visible = visibleColumnKeys
    ? columns.filter((col) => visibleColumnKeys.includes(col.key))
    : columns

  const colSpan = Math.max(visible.length, 1)

  return (
    <table className='main-table sticky-header-table'>
        <thead>
            <tr>
                {visible.map((col) => (
                  <th key={col.key}>{col.label}</th>
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
                    {visible.map((col) => (
                      <td key={col.key}>{col.render(row)}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default Table