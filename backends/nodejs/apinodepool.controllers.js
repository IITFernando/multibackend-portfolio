import pool from "../db.js"

const controller = {
  getProductos: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM productos WHERE Cantidad > 0");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },

  atualizarProductos: async (req, res) => {
    try {
      const { productosVendidos } = req.body;
      for (const producto of productosVendidos) {
        await pool.query("UPDATE productos SET Cantidad = Cantidad - ? WHERE Codigo = ?", [
          producto.Cantidad,
          producto.Codigo,
        ]);
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  },
};

export default controller;