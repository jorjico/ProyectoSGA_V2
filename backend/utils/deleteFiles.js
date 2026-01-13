const cloudinary = require("cloudinary").v2;

const deleteFile = async (public_id) => {
    if (!public_id) return;

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log("Imagen eliminada en Cloudinary:", result);
    } catch (error) {
        console.error("Error eliminando imagen de Cloudinary:", error);
    }
};

module.exports = { deleteFile };

