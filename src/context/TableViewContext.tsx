import { createContext, useContext, useMemo, useState } from 'react'

export type TableColumnKey =
  | 'folio'
  | 'name'
  | 'apellido'
  | 'distancia'
  | 'tel'
  | 'categoria'
  | 'fecha_registro'

type VisibleColumns = Record<TableColumnKey, boolean>

type TableViewContextValue = {
  visibleColumns: VisibleColumns
  toggleColumn: (key: TableColumnKey) => void
  setColumn: (key: TableColumnKey, value: boolean) => void
  setAll: (value: boolean) => void
}

const DEFAULT_VISIBLE_COLUMNS: VisibleColumns = {
  folio: true,
  name: true,
  apellido: true,
  distancia: true,
  tel: true,
  categoria: true,
  fecha_registro: true,
}

const TableViewContext = createContext<TableViewContextValue | null>(null)

export const TableViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(DEFAULT_VISIBLE_COLUMNS)

  const toggleColumn = (key: TableColumnKey) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setColumn = (key: TableColumnKey, value: boolean) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: value }))
  }

  const setAll = (value: boolean) => {
    setVisibleColumns({
      folio: value,
      name: value,
      apellido: value,
      distancia: value,
      tel: value,
      categoria: value,
      fecha_registro: value,
    })
  }

  const value = useMemo<TableViewContextValue>(
    () => ({ visibleColumns, toggleColumn, setColumn, setAll }),
    [visibleColumns]
  )

  return <TableViewContext.Provider value={value}>{children}</TableViewContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTableView = () => {
  const ctx = useContext(TableViewContext)
  if (!ctx) throw new Error('useTableView must be used within a TableViewProvider')
  return ctx
}
