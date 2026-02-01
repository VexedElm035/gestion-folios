import { useMemo, useEffect, useState, type ReactNode } from 'react';
import { useTableView, type TableColumnKey } from '@/context/TableViewContext';
import { Table, RunnerButton } from "@/components";
import { groupBy as groupByUtil } from '@/utils/groupBy';
import { api } from '@/utils/api';
import { IoMdCreate, IoIosTrash } from "react-icons/io";
import './participants.css';

type Person = {
  id: string
  folio: string
  name: string
  apellido: string
  distancia: string
  categoria: string
  tel: string
  fecha_registro: string
}

type BackendParticipant = {
  id: string
  folio?: { folio: string }
  nombre: string
  apellido: string
  distancia?: number
  categoria?: string
  telefono: string
  created_at: string
}

type ColumnDef = {
  key: TableColumnKey
  label: string
  render: (person: Person) => ReactNode
  sorter?: (a: Person, b: Person) => number
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
          id: p.id,
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
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; row: Person | null }>({ visible: false, x: 0, y: 0, row: null });

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null); // Folio is ID for UI
  const [editFormData, setEditFormData] = useState<Partial<Person>>({});

  // Close menu on click anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleRowContextMenu = (e: React.MouseEvent, row: Person) => {
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      row
    });
  };

  const handleDelete = async () => {
    if (!contextMenu.row) return;
    if (!confirm(`¿Eliminar a ${contextMenu.row.name}?`)) return;

    try {
      await api.deleteParticipant(contextMenu.row.id); // Placeholder
      setPersons(prev => prev.filter(p => p.id !== contextMenu.row!.id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleEdit = () => {
    if (!contextMenu.row) return;
    setEditingId(contextMenu.row.id);
    setEditFormData({ ...contextMenu.row });
  };

  const handleSave = async () => {
    if (!editingId || !editFormData) return;
    try {
      // Placeholder update
      await api.updateParticipant(editingId, editFormData);
      setEditingId(null);
      setEditFormData({});

      setPersons(prev => prev.map(p => p.id === editingId ? { ...p, ...editFormData } as Person : p));
    } catch (e: any) {
      alert('Error al guardar: ' + e.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleInputChange = (key: keyof Person, value: string) => {
    setEditFormData(prev => ({ ...prev, [key]: value }));
  };

  const columns = useMemo<ColumnDef[]>(
    () => [
      { key: 'folio', label: 'Folio', render: (p) => p.folio, sorter: (a, b) => a.folio.localeCompare(b.folio) },
      { key: 'name', label: 'Nombre', render: (p) => editingId === p.id ? <input className="edit-input" value={editFormData.name || ''} onChange={e => handleInputChange('name', e.target.value)} /> : p.name, sorter: (a, b) => a.name.localeCompare(b.name) },
      { key: 'apellido', label: 'Apellido', render: (p) => editingId === p.id ? <input className="edit-input" value={editFormData.apellido || ''} onChange={e => handleInputChange('apellido', e.target.value)} /> : p.apellido, sorter: (a, b) => a.apellido.localeCompare(b.apellido) },
      {
        key: 'distancia', label: 'Distancia', render: (p) => editingId === p.id ? <input className="edit-input" value={editFormData.distancia || ''} onChange={e => handleInputChange('distancia', e.target.value)} /> : p.distancia, sorter: (a, b) => {
          const valA = parseInt(a.distancia.replace(/\D/g, '') || '0');
          const valB = parseInt(b.distancia.replace(/\D/g, '') || '0');
          return valA - valB;
        }
      },
      { key: 'categoria', label: 'Categoria', render: (p) => editingId === p.id ? <input className="edit-input" value={editFormData.categoria || ''} onChange={e => handleInputChange('categoria', e.target.value)} /> : p.categoria, sorter: (a, b) => a.categoria.localeCompare(b.categoria) },
      { key: 'tel', label: 'Telefono', render: (p) => editingId === p.id ? <input className="edit-input" value={editFormData.tel || ''} onChange={e => handleInputChange('tel', e.target.value)} /> : p.tel, sorter: (a, b) => a.tel.localeCompare(b.tel) },
      {
        key: 'fecha_registro',
        label: 'Fecha de Registro',
        render: (p) => p.fecha_registro,
        sorter: (a, b) => {
          // Assuming format DD/MM/YYYY or similar from localeDateString. 
          // localeDateString might vary by browser. 
          // Ideally parse real date, but we only have string here.
          // We should probably store real date object in Person or IS0 string for reliable sort.
          // For now, let's try to parse it if standard, or improved approach: pass raw timestamps in Person if possible.
          // Since we mapped it in fetchParticipants, let's just try basic string compare or simple parse.
          // Format: "D/M/YYYY" usually in ES locale?
          const partsA = a.fecha_registro.split('/');
          const partsB = b.fecha_registro.split('/');
          if (partsA.length === 3 && partsB.length === 3) {
            const dateA = new Date(parseInt(partsA[2]), parseInt(partsA[1]) - 1, parseInt(partsA[0]));
            const dateB = new Date(parseInt(partsB[2]), parseInt(partsB[1]) - 1, parseInt(partsB[0]));
            return dateA.getTime() - dateB.getTime();
          }
          return a.fecha_registro.localeCompare(b.fecha_registro);
        }
      },
    ],
    [editingId, editFormData]
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
          getRowKey={(p: Person) => p.folio}
          stickyHeader
          onRowContextMenu={handleRowContextMenu}
          defaultSort={{ key: 'fecha_registro', direction: 'desc' }}
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
                getRowKey={(p: Person) => p.folio}
                stickyHeader={false}
                defaultSort={{ key: 'fecha_registro', direction: 'desc' }}
              />
            </section>
          ))}
        </>
      )}

      <div className="runner-section">
        <RunnerButton />
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={handleEdit} className='context-menu-edit'>
            <IoMdCreate /> Editar
          </button>
          <button onClick={handleDelete} className='context-menu-delete'>
            <IoIosTrash /> Eliminar
          </button>
        </div>
      )}

      {editingId && (
        <div className="edit-actions-menu"
          style={{ top: contextMenu.y + 10, left: contextMenu.x }}>
          <button onClick={handleSave} style={{ padding: '6px 12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
          <button onClick={handleCancel} style={{ padding: '6px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      )}

    </div>
  )
}

export default Participants