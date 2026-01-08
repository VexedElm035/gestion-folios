import './table.css';

const persons=[
    {name: "luis",
     folio: "123",
     tel: "9631410015"
    },
    {name: "naso",
     folio: "456",
     tel: "9631410013"},
    {name: "dudosa",
     folio: "432",
     tel: "9631410011"},
    {name: "buno",
     folio: "982",
     tel: "9631410012"}
];

const Table = () => {
  return (
    <table className='main-table'>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Folio</th>
                <th>Telefono</th>
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
                    <td>{person.name}</td>
                    <td>{person.folio}</td>
                    <td>{person.tel}</td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default Table