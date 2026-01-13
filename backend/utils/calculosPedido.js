function calcularImporteBruto(precioUnitario, cantidad) {
    return precioUnitario * cantidad;
}

function calcularImporteConIVA(importeBruto, iva) {
    return importeBruto * (1 + iva / 100);
}

module.exports = { calcularImporteBruto, calcularImporteConIVA };