import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl="https://localhost:44348/api/gestorescliente";
  const[data, setData]=useState([]);
  const[modalEditar, setModalEditar]=useState(false);
  const[modalInsertar, setModalInsertar]=useState(false);
  const[modalEliminar, setModalEliminar]=useState(false);
  const[gestorSeleccionado,setGestorSeleccionado]=useState({
    id_cliente:'',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    rfc:'',
    curp: ''
  })

const handleChange=e=>{
    const {name,value}=e.target;
    setGestorSeleccionado({
        ...gestorSeleccionado,
        [name]:value
    });
    console.log(gestorSeleccionado);

}


const abirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
}
const abirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
}
const abirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
}
const actualizar=()=>{
  window.location.reload(false);
}

  const peticionGet=async()=>{
    await axios.get(baseUrl).then(response=>{
      setData(response.data);
      
    }).catch(error =>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete gestorSeleccionado.id_cliente;
    await axios.post(baseUrl, gestorSeleccionado).then(response=>{
      setData(data.concat(response.data));
      abirCerrarModalInsertar();
    }).catch(error =>{
      console.log(error);
    })
  }

  const seleccionarAccion=(gestor,caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")? 
    abirCerrarModalEditar(): abirCerrarModalEliminar()

  }

const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+gestorSeleccionado.id_cliente, gestorSeleccionado).then(response=>{
      var respuesta = response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestor=>{
        if(gestor.id_cliente===gestorSeleccionado.id_cliente){
          gestor.nombre=respuesta.nombre;
          gestor.apellido_paterno=respuesta.apellido_paterno;
          gestor.apellido_materno=respuesta.apellido_materno;
          gestor.rfc=respuesta.rfc;
          gestor.curp=respuesta.curp;
        }
      })
      abirCerrarModalEditar();
    }).catch(error =>{
      console.log(error);
    })
  }

const peticionEliminar=async()=>{
    await axios.delete(baseUrl+"/"+gestorSeleccionado.id_cliente).then(response=>{
      setData(data.filter(gestor=>gestor.id_cliente!==response.data));
      abirCerrarModalEliminar();
    }).catch(error =>{
      console.log(error);
    })
  }


  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div className="App">
    <br /><br />
    <butto onClick={()=>abirCerrarModalInsertar()} className="btn btn-success"> Nuevo Cliente </butto>
    <br /><br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>RFC</th>
            <th>CURP</th>
            <th>Fecha Alta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(gestor=>(
            <tr key={gestor.id_cliente}>
              <td>{gestor.id_cliente}</td>
              <td>{gestor.nombre}</td>
              <td>{gestor.apellido_paterno}</td>
              <td>{gestor.apellido_materno}</td>
              <td>{gestor.rfc}</td>
              <td>{gestor.curp}</td>
              <td>{gestor.fecha_alta}</td>
              <td>
                <button className = "btn btn-primary" onClick={()=>seleccionarAccion(gestor,"Editar")}>Editar</button>{" "}
                <button className = "btn btn-danger" onClick={()=>seleccionarAccion(gestor,"Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

<Modal isOpen={modalInsertar}>
<ModalHeader>Insertar Nuevo Cliente</ModalHeader>
<ModalBody>
<div className = "form-group">
<label>Nombre: </label>
<br />
<input type="text" className="form-control" name = "nombre" onChange={handleChange}/>
<br />
<label>Apellido Paterno: </label>
<br />
<input type="text" className="form-control" name = "apellido_paterno"onChange={handleChange}/>
<br />
<label>Apellido Materno: </label>
<br />
<input type="text" className="form-control" name = "apellido_materno"onChange={handleChange}/>
<br />
<label>RFC: </label>
<br />
<input type="text" className="form-control" name = "rfc"onChange={handleChange}/>
<br />
<label>CURP: </label>
<br />
<input type="text" className="form-control" name = "curp"onChange={handleChange}/>
<br />
</div>
</ModalBody>
<ModalFooter>
<button className="btn btn-primary" onClick={()=>peticionPost()}>Guardar</button>{" "}
<button className="btn btn btn-danger" onClick={()=>abirCerrarModalInsertar()}>Cancelar</button>
</ModalFooter>
</Modal>

<Modal isOpen={modalEditar}>
<ModalHeader>Editar Cliente</ModalHeader>
<ModalBody>
<div className = "form-group">
<label>Id cliente: </label>
<br />
<input type="text" className="form-control" name = "id_cliente" readOnly value={gestorSeleccionado && gestorSeleccionado.id_cliente}/>
<br />
<label>Nombre: </label>
<br />
<input type="text" className="form-control" name = "nombre" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.nombre}/>
<br />
<label>Apellido Paterno: </label>
<br />
<input type="text" className="form-control" name = "apellido_paterno"onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.apellido_paterno}/>
<br />
<label>Apellido Materno: </label>
<br />
<input type="text" className="form-control" name = "apellido_materno"onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.apellido_materno}/>
<br />
<label>RFC: </label>
<br />
<input type="text" className="form-control" name = "rfc"onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.rfc}/>
<br />
<label>CURP: </label>
<br />
<input type="text" className="form-control" name = "curp"onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.curp}/>
<br />
</div>
</ModalBody>
<ModalFooter>
<button className="btn btn-primary" onClick={()=>peticionPut()}>Guardar cambios</button>{" "}
<button className="btn btn btn-danger" onClick={()=>abirCerrarModalEditar()}>Cancelar</button>
</ModalFooter>
</Modal>

<Modal isOpen={modalEliminar}>
<ModalHeader>Editar Cliente</ModalHeader>
<ModalBody>
¿Estás seguro que deseas eliminar al cliente {gestorSeleccionado && gestorSeleccionado.id_cliente} de nombre {gestorSeleccionado && gestorSeleccionado.nombre} ?
</ModalBody>
<ModalFooter>
<button className="btn btn-danger" onClick={()=>peticionEliminar()}>Si</button>{" "}
<button className="btn btn btn-secundary" onClick={()=>abirCerrarModalEliminar()}>No</button>
</ModalFooter>
</Modal>

    </div>
  );
}

export default App;
