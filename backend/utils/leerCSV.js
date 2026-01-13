const path = require("path");
const { parse } = require("csv-parse/sync");
const fs = require("fs/promises");

const leerCSV = async (nombreArchivo) => {
    try {
        const archivo = await fs.readFile(path.join(process.cwd(), nombreArchivo), "utf-8");
        return parse( archivo, {
            columns: true,
            skip_empty_lines: true,
             delimiter: ";"
        });
    } catch (err) {
        console.error("Error al leer el archivo o parsear el archivo CSV:", err);
            return [];
    }
};

module.exports = leerCSV;
