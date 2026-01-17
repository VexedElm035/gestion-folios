import { Table } from "../../components";
import './participants.css';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useTableView, type TableColumnKey } from '../../context/TableViewContext';
import { groupBy as groupByUtil } from '../../utils/groupBy';

type Person = {
  folio: string
  name: string
  apellido: string
  distancia: string
  categoria: string
  tel: string
  fecha_registro: string
}

type ColumnDef = {
  key: TableColumnKey
  label: string
  render: (person: (typeof persons)[number]) => ReactNode
}

const persons: Person[] = [
...Array.from({ length: 50 }, () => ({
  folio: Math.random().toString(36).substring(2, 8).toUpperCase(),
  name: ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Miguel', 'Sofia'][Math.floor(Math.random() * 10)],
  apellido: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'][Math.floor(Math.random() * 10)],
  distancia: ['5', '10'][Math.floor(Math.random() * 2)] + ' KM',
  categoria: ['Libre', 'Juvenil', 'Master'][Math.floor(Math.random() * 3)],
  tel: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  fecha_registro: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
}))
];

const Participants = () => {
  
  const columns = useMemo<ColumnDef[]>(
    () => [
      { key: 'folio', label: 'Folio', render: (p) => p.folio },
      { key: 'name', label: 'Nombre', render: (p) => p.name },
      { key: 'apellido', label: 'Apellido', render: (p) => p.apellido },
      { key: 'distancia', label: 'Distancia', render: (p) => p.distancia },
      { key: 'categoria', label: 'Categoria', render: (p) => p.categoria },
      { key: 'tel', label: 'Telefono', render: (p) => p.tel },
      { key: 'fecha_registro', label: 'Fecha de Registro', render: (p) => p.fecha_registro },
    ],
    []
  );

  const { visibleColumns, groupBy } = useTableView();
  const visibleColumnKeys = columns.filter((c) => visibleColumns[c.key]).map((c) => c.key);

  const grouped = useMemo(() => {
    if (!groupBy) return null

    const map = groupByUtil(persons, (p) => p[groupBy])
    const entries = Array.from(map.entries())

    entries.sort((a, b) => {
      if (groupBy === 'distancia') {
        const an = Number.parseInt(String(a[0]).replace(/\D+/g, ''), 10)
        const bn = Number.parseInt(String(b[0]).replace(/\D+/g, ''), 10)
        if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn
      }
      return String(a[0]).localeCompare(String(b[0]))
    })

    return entries
  }, [groupBy]);

  return (
    <div>
        {!groupBy && (
          <Table
            columns={columns}
            rows={persons}
            visibleColumnKeys={visibleColumnKeys}
            getRowKey={(p) => p.folio}
            stickyHeader
          />
        )}

        {groupBy && grouped && (
          <>
            {grouped.map(([groupValue, rows]) => (
              <section key={String(groupValue)} className='participants-group'>
                <div className='participants-group-title'>
                  {groupBy === 'distancia' ? `Distancia: ${groupValue}` : `Categoría: ${groupValue}`}
                </div>
                <Table
                  columns={columns}
                  rows={rows}
                  visibleColumnKeys={visibleColumnKeys}
                  getRowKey={(p) => p.folio}
                  stickyHeader={false}
                />
              </section>
            ))}
          </>
        )}
    </div>
  )
}

export default Participants