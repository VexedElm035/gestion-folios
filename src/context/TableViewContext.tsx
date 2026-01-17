import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type TableColumnKey =
  | 'folio'
  | 'name'
  | 'apellido'
  | 'distancia'
  | 'tel'
  | 'categoria'
  | 'fecha_registro'

export type TableGroupByKey = 'distancia' | 'categoria'

type VisibleColumns = Record<TableColumnKey, boolean>

type TableViewContextValue = {
  visibleColumns: VisibleColumns
  groupBy: TableGroupByKey | null
  toggleColumn: (key: TableColumnKey) => void
  setColumn: (key: TableColumnKey, value: boolean) => void
  setAll: (value: boolean) => void
  toggleGroupBy: (key: TableGroupByKey) => void
  clearGroupBy: () => void
}

const STORAGE_KEY = 'tableVisibleColumns'
const STORAGE_GROUP_BY_KEY = 'tableGroupBy'

const DEFAULT_VISIBLE_COLUMNS: VisibleColumns = {
  folio: true,
  name: true,
  apellido: true,
  distancia: true,
  tel: true,
  categoria: true,
  fecha_registro: true,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const readStoredVisibleColumns = (): VisibleColumns => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_VISIBLE_COLUMNS

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return DEFAULT_VISIBLE_COLUMNS

    const merged: VisibleColumns = { ...DEFAULT_VISIBLE_COLUMNS }
    ;(Object.keys(DEFAULT_VISIBLE_COLUMNS) as TableColumnKey[]).forEach((key) => {
      const value = parsed[key]
      if (typeof value === 'boolean') merged[key] = value
    })

    return merged
  } catch {
    return DEFAULT_VISIBLE_COLUMNS
  }
}

const readStoredGroupBy = (): TableGroupByKey | null => {
  try {
    const raw = localStorage.getItem(STORAGE_GROUP_BY_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed === 'distancia' || parsed === 'categoria') return parsed
    return null
  } catch {
    return null
  }
}

const TableViewContext = createContext<TableViewContextValue | null>(null)

export const TableViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(() => readStoredVisibleColumns())
  const [groupBy, setGroupBy] = useState<TableGroupByKey | null>(() => readStoredGroupBy())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns))
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [visibleColumns])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GROUP_BY_KEY, JSON.stringify(groupBy))
    } catch {
      // ignore (storage could be unavailable)
    }
  }, [groupBy])

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

  const toggleGroupBy = (key: TableGroupByKey) => {
    setGroupBy((prev) => (prev === key ? null : key))
  }

  const clearGroupBy = () => {
    setGroupBy(null)
  }

  const value = useMemo<TableViewContextValue>(
    () => ({ visibleColumns, groupBy, toggleColumn, setColumn, setAll, toggleGroupBy, clearGroupBy }),
    [visibleColumns, groupBy]
  )

  return <TableViewContext.Provider value={value}>{children}</TableViewContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTableView = () => {
  const ctx = useContext(TableViewContext)
  if (!ctx) throw new Error('useTableView must be used within a TableViewProvider')
  return ctx
}
