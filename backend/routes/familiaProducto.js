const { Router } = require('express');
const { crearFamilia, getFamilias, deleteFamilia, getFamiliaById, updateFamilia } = require("../controllers/familiaProducto");

const familiaRoutes =  Router();


familiaRoutes.post("/", crearFamilia);
familiaRoutes.get("/", getFamilias);
familiaRoutes.get("/:id", getFamiliaById);
familiaRoutes.delete("/:id", deleteFamilia);
familiaRoutes.put("/:id", updateFamilia);

module.exports = familiaRoutes;
