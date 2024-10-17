import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import Axios from "axios";
import { formatInTimeZone } from 'date-fns-tz';

function App() {
  const [FechaHoraEntrada, setFechaHoraEntrada] = useState("");
  const [Documento, setDocumento] = useState("");
  const [Nombre, setNombre] = useState("");
  const [Apellido, setApellido] = useState("");
  const [Empresa, setEmpresa] = useState("");
  const [Cargo, setCargo] = useState("");
  const [Eps, setEps] = useState("");
  const [Arl, setArl] = useState("");
  const [Contacto, setContacto] = useState("");
  const [Firma, setFirma] = useState("");
  const [FechaHoraSalida, setFechaHoraSalida] = useState("");
  const canvasRef = useRef(null);

  const [listaProveedores,setProveedores] = useState([]);

  const Añadir = () => {
    const canvas = canvasRef.current;
    const firmaData = canvas.toDataURL('image/png');
    setFirma(firmaData);

    const fechaSalidaActual = new Date();
    const formattedFechaHoraSalida = formatInTimeZone(fechaSalidaActual, 'America/Bogota', 'yyyy-MM-dd HH:mm:ss');
    setFechaHoraSalida(formattedFechaHoraSalida);

    Axios.post("http://localhost:3001/create", {
      FechaHoraEntrada,
      Documento,
      Nombre,
      Apellido,
      Empresa,
      Cargo,
      Eps,
      Arl,
      ContactoEmergencia: Contacto,
      Firma: firmaData,
      FechaHoraSalida: formattedFechaHoraSalida
    }).then(() => {
      getProveedores();
      alert("Registrado");
    }).catch((error) => {
      console.error("Error:", error);
      alert("Error al guardar los datos.");
    });
  };

  const handleDocumentoChange = (e) => {
    const nuevoDocumento = e.target.value;
    setDocumento(nuevoDocumento);

    if (nuevoDocumento) {
      const fechaActual = new Date();
      const formattedFechaHoraEntrada = formatInTimeZone(fechaActual, 'America/Bogota', 'yyyy-MM-dd HH:mm:ss');
      setFechaHoraEntrada(formattedFechaHoraEntrada);
    } else {
      setFechaHoraEntrada('');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let drawing = false;

    const startDrawing = (e) => {
      drawing = true;
      context.beginPath();
      context.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
      if (drawing) {
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
      }
    };

    const stopDrawing = () => {
      drawing = false;
      context.closePath();
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrawing({ offsetX: touch.clientX - canvas.offsetLeft, offsetY: touch.clientY - canvas.offsetTop });
    });

    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      draw({ offsetX: touch.clientX - canvas.offsetLeft, offsetY: touch.clientY - canvas.offsetTop });
    });

    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getProveedores = () => {
   
    Axios.get("http://localhost:3001/proveedores").then((response) => {
      setProveedores(response.data);
    });
  }

  return (
    <div className="App">
      <div className="informacion">
        <label>FechaHoraEntrada:</label>
        <input value={FechaHoraEntrada} readOnly placeholder='Fecha y hora de entrada' />

        <label>Documento:</label>
        <input type="number" value={Documento} onChange={handleDocumentoChange} />

        <label>Nombre:</label>
        <input type="text" value={Nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>Apellido:</label>
        <input type="text" onChange={(event) => { setApellido(event.target.value) }} />

        <label>Empresa:</label>
        <input type="text" onChange={(event) => { setEmpresa(event.target.value) }} />

        <label>Cargo:</label>
        <input type="text" onChange={(event) => { setCargo(event.target.value) }} />

        <label>Eps:</label>
        <input type="text" onChange={(event) => { setEps(event.target.value) }} />

        <label>Arl:</label>
        <input type="text" onChange={(event) => { setArl(event.target.value) }} />

        <label>ContactoEmergencia:</label>
        <input type="number" onChange={(event) => { setContacto(event.target.value) }} />

        <div className="contenido">
          <label>Firma:</label>
          <canvas
            ref={canvasRef}
            width={400}
            height={200}            
          />
          <br />
          <button type="button" onClick={clearCanvas}>Limpiar</button>
          <button onClick={Añadir}>Guardar</button>
        </div>
        
        <label>FechaHoraSalida:</label>
        <input value={FechaHoraSalida} readOnly placeholder='Fecha y hora de salida' />
      </div>
        <button onClick={getProveedores}>Consultar</button>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>FechaHoraEntrada</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Empresa</th>
              <th>Cargo</th>
              <th>Arl</th>
              <th>ContactoEmergencia</th>
              <th>Firma</th>
              <th>FechaHoraSalida</th>
            </tr>
          </thead>
            <tbody>
              {
                listaProveedores.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.id}</td>
                      <td>{val.FechaHoraEntrada}</td>
                      <td>{val.Documento}</td>
                      <td>{val.Nombre}</td>
                      <td>{val.Apellido}</td>
                      <td>{val.Empresa}</td>
                      <td>{val.Cargo}</td>
                      <td>{val.Arl}</td>
                      <td>{val.ContactoEmergencia}</td>
                      <td>
                        <img src={val.Firma} alt="Firma" style={{ maxWidth: '100px', maxHeight: '50px' , backgroundColor:"white"}} />
                      </td>
                      <td>{val.FechaHoraSalida}</td>
                    </tr>
                  )
                })
              }
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    </div>

   
  );
}

export default App;

