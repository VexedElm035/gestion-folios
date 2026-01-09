import './table.css';

const campos= ['Folio', 'Nombre', 'Apellido', 'Distancia', 'Telefono'];

const persons=[
...Array.from({ length: 50 }, (_, i) => ({
  folio: Math.random().toString(36).substring(2, 8).toUpperCase(),
  name: ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen', 'José', 'Laura', 'Miguel', 'Sofia'][Math.floor(Math.random() * 10)],
  apellido: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores'][Math.floor(Math.random() * 10)],
  distancia: ['5KM', '10KM', '15KM', '21KM', '42KM'][Math.floor(Math.random() * 5)],
  tel: `${Math.floor(Math.random() * 9000000000) + 1000000000}`
}))
];

const Table = () => {
  return (
    <table className='main-table sticky-header-table'>
        <thead>
            <tr>
                {campos.map((campo) => (
                  <th key={campo}>{campo}</th>
                ))}
            </tr>
        </thead>
        <tfoot>
          <tr>
          <td colSpan={3}>
          <div className="links"><a href="#">&laquo;</a> <a className="active" href="#">1</a> <a href="#">2</a> <a href="#">3</a> <a href="#">4</a> <a href="#">&raquo;</a></div>
          </td>
          </tr>
        </tfoot>
        <tbody>
            {persons.map((person) => (
                <tr key={person.folio}>
                    <td>{person.folio}</td>
                    <td>{person.name}</td>
                    <td>{person.apellido}</td>
                    <td>{person.distancia}</td>
                    <td>{person.tel}</td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default Table