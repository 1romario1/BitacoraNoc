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

    const buffer = Buffer.from(Firma.split(',')[1], 'base64'); // Convertir a buffer

    const query = "INSERT INTO proveedores (FechaHoraEntrada, Documento, Nombre, Apellido, Empresa, Cargo, Eps, Arl, ContactoEmergencia, Firma, FechaHoraSalida) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(query, [FechaHoraEntrada, Documento, Nombre, Apellido, Empresa, Cargo, Eps, Arl, ContactoEmergencia, buffer, FechaHoraSalida], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al registrar los datos.");
        } else {
            res.send("Registrado");
        }
    });
});

app.get("/proveedores", (req, res) => {
    db.query("SELECT *, firma FROM proveedores", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            const proveedoresConFirma = result.map(row => ({
                ...row,
                Firma: `data:image/png;base64,${row.firma.toString('base64')}`
            }));
            res.send(proveedoresConFirma);
        }
    });
});

app.listen(3001,() => {
    console.log("Servidor escuchando en el puerto 3001");
});