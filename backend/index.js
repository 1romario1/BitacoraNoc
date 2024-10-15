const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "registronoc"
});

app.post("/create", (req, res) => {
    console.log(req.body); 
    const {
        FechaHoraEntrada,
        Documento,
        Nombre,
        Apellido,
        Empresa,
        Cargo,
        Eps,
        Arl,
        ContactoEmergencia,
        Firma,
        FechaHoraSalida
    } = req.body;

    const query = "INSERT INTO proveedores (FechaHoraEntrada, Documento, Nombre, Apellido, Empresa, Cargo, Eps, Arl, ContactoEmergencia, Firma, FechaHoraSalida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(query, [FechaHoraEntrada, Documento, Nombre, Apellido, Empresa, Cargo, Eps, Arl, ContactoEmergencia, Firma, FechaHoraSalida], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al registrar los datos.");
        } else {
            res.send("Registrado");
        }
    });
});


app.listen(3001, () => {
    console.log("Servidor escuchando en el puerto 3001");
});