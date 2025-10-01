// Librerías
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import "./css/estilosPuntoventa.css";

// Módulos y componentes
import { ticket } from './ticket';
import Logo3D from './Logo3D';
import ProductoSelect from './ProductoSelect';
import DetalleTicket from './DetalleTicket';
import Botonera from './Botonera';
import { backend } from './backendAdapter';  // <--- usamos el adapter

function Selectreact() {
  const [total, setTotal] = useState(0);
  const [productosVendidos, setproductosVendidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [backendActivo, setBackendActivo] = useState("Desconocido");

  // Traer productos desde servidor
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        console.log("Iniciando carga de productos...");
        const { backend: usado, data } = await backend.getProductos();
        setBackendActivo(usado);

        if (!Array.isArray(data)) {
          console.error("El backend no devolvió un array:", data);
          alert("Error: El servidor no devolvió los datos esperados");
          return;
        }

        if (data.length === 0) {
          console.warn("No hay productos en la base de datos");
          alert("No hay productos disponibles en la base de datos");
          return;
        }

        const opcionesParaSelect = data.map(p => ({
          codigo: p.Codigo,
          descripcion: p.Descripcion,
          label: `${p.Cantidad} - $${p.Precio} - ${p.Descripcion}`,
          precio: p.Precio,
          cantidad: p.Cantidad,
          eliminado: false
        }));

        setProductos(opcionesParaSelect);
        console.log(`✅ Productos cargados desde ${usado}:`, opcionesParaSelect.length);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        alert("Error al conectar con cualquier backend.");
      }
    };
    obtenerProductos();
  }, []);

  // Actualizar total
  useEffect(() => {
    const nuevoTotal = productosVendidos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    setTotal(nuevoTotal);
  }, [productosVendidos]);

  // Actualizar productos en el servidor
  const actualizarTabla = async () => {
    const productosParaEnviar = productosVendidos.map(p => ({
      Codigo: p.codigo,
      Cantidad: p.cantidad
    }));

    try {
      const { backend: usado, data } = await backend.actualizarProductos(productosParaEnviar);
      setBackendActivo(usado);

      if (data.success) {
        console.log(`✅ Stock actualizado en ${usado}`);
        return true;
      } else {
        alert("Error al actualizar: " + data.message);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
    setproductosVendidos([]);
    setTotal(0);
  };

  // Gestor de venta
  const actualizarCantidadAlmacenada = (pIdx, pCantidad) => {
    const productosTemp = [...productos];
    productosTemp[pIdx].cantidad -= pCantidad;
    if (productosTemp[pIdx].cantidad <= 0) {
      productosTemp[pIdx].eliminado = true;
    } else {
      productosTemp[pIdx].eliminado = false;
      productosTemp[pIdx].label = `${productosTemp[pIdx].cantidad} - $${productosTemp[pIdx].precio} - ${productosTemp[pIdx].descripcion}`;
    }
    setProductos(productosTemp);
  };

  const agregarProductoVendido = (opcion) => {
    const idxProductoYaVendido = productosVendidos.findIndex(p => p.codigo === opcion.codigo);
    const idxProducto = productos.findIndex(p => p.codigo === opcion.codigo);

    if (idxProductoYaVendido !== -1) {
      const productosVendidosTemp = [...productosVendidos];
      productosVendidosTemp[idxProductoYaVendido].cantidad++;
      setproductosVendidos(productosVendidosTemp);
    } else {
      const nuevoProducto = {
        codigo: opcion.codigo,
        descripcion: opcion.descripcion,
        cantidad: 1,
        precio: opcion.precio
      };
      setproductosVendidos([...productosVendidos, nuevoProducto]);
    }
    actualizarCantidadAlmacenada(idxProducto, 1);
  };

  const cambiarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    const productosVendidosTemp = [...productosVendidos];
    const idxProducto = productos.findIndex(p => p.codigo === productosVendidosTemp[index].codigo);
    if (nuevaCantidad > productos[idxProducto].cantidad + productosVendidosTemp[index].cantidad) return;

    const difCantidad = nuevaCantidad - productosVendidosTemp[index].cantidad;
    productosVendidosTemp[index].cantidad = parseInt(nuevaCantidad) || 0;
    setproductosVendidos(productosVendidosTemp);

    actualizarCantidadAlmacenada(idxProducto, difCantidad);
  };

  const cancelarTicket = () => {
    productosVendidos.forEach(item => {
      const idxProducto = productos.findIndex(p => p.codigo === item.codigo);
      if (idxProducto !== -1) {
        actualizarCantidadAlmacenada(idxProducto, -item.cantidad);
      }
    });
    setproductosVendidos([]);
    setTotal(0);
  };

  const eliminarProductoVendido = (index) => {
    const productoEliminado = productosVendidos[index];
    setproductosVendidos(prev => prev.filter((_, i) => i !== index));
    setTotal(prev => prev - productoEliminado.precio * productoEliminado.cantidad);
    actualizarCantidadAlmacenada(index, -productoEliminado.cantidad);
  };

  const finalizarVenta = () => {
    if (ticket(productosVendidos)) {
      actualizarTabla();
      setproductosVendidos([]);
    } else {
      alert("Error en la impresión del ticket.\nNo se actualizó el stock.");
    }
  };

  return (
    <>
      <div className="raiz">
        <div className='header'>
          <h1>Punto de venta</h1>
          <h2>Back ({backendActivo}) / Front-React</h2>
        </div>
        <div className="contenedorProceso">
          <div className='productos'>
            <ProductoSelect
              productos={productos}
              onAgregar={agregarProductoVendido}
              titulo={"Productos"}
              contraido={false}
              productoMostrado={null}
            />
          </div>
          <div className='video'>
            <Logo3D />
          </div>
          <div className='ticket'>
            <h3>Ticket de compra</h3>
            <div className='detalle'>
              <DetalleTicket
                productosVendidos={productosVendidos}
                onCambiarCantidad={cambiarCantidad}
                onEliminarProducto={eliminarProductoVendido}
              />
            </div>
            <div className='total'>Total: ${total}</div>
            <div className='botones'>
              <Botonera
                habilitar={!productosVendidos.length}
                onImprimir={finalizarVenta}
                onCancelar={cancelarTicket}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Selectreact;
