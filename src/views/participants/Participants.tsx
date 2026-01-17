import { Table } from "../../components";
import './participants.css';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useTableView, type TableColumnKey } from '../../context/TableViewContext';

type ColumnDef = {
  key: TableColumnKey
  label: string
  render: (person: (typeof persons)[number]) => ReactNode
}

const persons=[
...Array.from({ length: 50 }, () => ({
  folio: Math.random().toString(36).substring(2, 8).toUpperCase(),
  name: ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Miguel', 'Sofia'][Math.floor(Math.random() * 10)],
  apellido: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'][Math.floor(Math.random() * 10)],
  distancia: ['5KM', '10KM', '15KM', '21KM', '42KM'][Math.floor(Math.random() * 5)],
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

  const { visibleColumns } = useTableView();
  const visibleColumnKeys = columns.filter((c) => visibleColumns[c.key]).map((c) => c.key);

  return (
    <div>
        <Table
          columns={columns}
          rows={persons}
          visibleColumnKeys={visibleColumnKeys}
          getRowKey={(p) => p.folio}
        />
    </div>
  )
}

export default Participants