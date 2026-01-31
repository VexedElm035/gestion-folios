import { useMemo, useEffect, useState, type ReactNode } from 'react';
import { useTableView, type TableColumnKey } from '@/context/TableViewContext';
import { Table, RunnerButton } from "@/components";
import { groupBy as groupByUtil } from '@/utils/groupBy';
import { api } from '@/utils/api';
import './participants.css';

type BackendParticipant = {
  folio?: { folio: string }
  nombre: string
  apellido: string
  distancia?: number
  categoria?: string
  telefono: string
  created_at: string
}

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
  render: (person: Person) => ReactNode
}

const Participants = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchParticipants = async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const data = await api.getParticipants();

        if (!isMounted) return;

        // Map backend data to frontend model
        const mapped = data.map((p: BackendParticipant) => ({
          folio: p.folio?.folio || 'N/A', // Assuming relation is loaded
          name: p.nombre,
          apellido: p.apellido,
          distancia: p.distancia ? `${p.distancia} KM` : 'N/A',
          categoria: p.categoria || 'N/A',
          tel: p.telefono,
          fecha_registro: new Date(p.created_at).toLocaleDateString()
        }));
        setPersons(mapped);
        setError(null);
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (isMounted && !isBackground) setLoading(false);
      }
    };

    // Initial fetch
    fetchParticipants();

    // Auto-refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchParticipants(true);
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

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

    const map = groupByUtil(persons, (p) => (p as Record<string, string>)[groupBy])
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
  }, [groupBy, persons]);

  if (loading) return <div className="p-4">Cargando participantes...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      {!groupBy && (
        <Table
          id="participants-table-main"
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
                id={`participants-table-${groupBy}-${groupValue}`}
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

      <div className="runner-section">
        <RunnerButton />
      </div>

    </div>
  )
}

export default Participants