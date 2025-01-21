import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { PedidosAPI } from "../../api/api.pedidos";
import ModalComponent from "../../components/UI/ModalComponent";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cartItems, calculateTotal, clearCart } = useCart();
  const [direccionEnvio, setDireccionEnvio] = useState("");
  const [metodosEnvio, setMetodosEnvio] = useState([]);
  const [metodoEnvioSeleccionado, setMetodoEnvioSeleccionado] = useState("");
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [detallesTarjeta, setDetallesTarjeta] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState({
    correoContacto: "",
    telefonoContacto: "",
  });

  useEffect(() => {
    const fetchMetodos = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        if (!storedUser) {
          toast.error("Usuario no autenticado.");
          return;
        }

        // Llenar dirección de envío y datos de contacto automáticamente
        setDireccionEnvio(storedUser.direccion || "");
        setDatosUsuario({
          correoContacto: storedUser.correo,
          telefonoContacto: storedUser.telefono,
        });

        // Obtener métodos de envío y pago
        const metodosEnvioResponse = await PedidosAPI.getMetodosEnvio();
        const metodosPagoResponse = await PedidosAPI.getMetodosPago();
        setMetodosEnvio(metodosEnvioResponse);
        setMetodosPago(metodosPagoResponse);
      } catch (error) {
        console.error("Error al cargar métodos:", error);
        toast.error("No se pudieron cargar los métodos de pago o envío.");
      }
    };
    fetchMetodos();
  }, []);

  const handleRealizarPedido = async () => {
    if (!direccionEnvio || !metodoEnvioSeleccionado || !metodoPagoSeleccionado) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    if (metodoPagoSeleccionado === "credito" || metodoPagoSeleccionado === "debito") {
      setModalVisible(true); // Abre el modal para capturar los datos de la tarjeta
      return;
    }

    realizarPedido(); // Realiza el pedido directamente si no es con tarjeta
  };

  const realizarPedido = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      const pedidoData = {
        direccionEnvio,
        metodoPagoId: parseInt(
          metodosPago.find((m) => m.nombre.toLowerCase() === metodoPagoSeleccionado)?.id,
          10
        ),
        metodoEnvioId: parseInt(metodoEnvioSeleccionado, 10),
        detallesPago: {
          ...detallesTarjeta,
          correoContacto: datosUsuario.correoContacto,
          telefonoContacto: datosUsuario.telefonoContacto,
        },
      };

      await PedidosAPI.createPedido(storedUser.id, pedidoData);
      toast.success("Pedido realizado con éxito.");
      clearCart();
      setModalVisible(false); // Cierra el modal después de realizar el pedido
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      toast.error("Hubo un error al realizar el pedido.");
    }
  };

  const validarFechaExpiracion = (fecha) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Valida formato MM/AA
    return regex.test(fecha);
  };

  const manejarFormatoFechaExpiracion = (valor) => {
    const valorLimpio = valor.replace(/\D/g, ""); // Elimina cualquier carácter no numérico
    if (valorLimpio.length <= 2) {
      return valorLimpio; // Devuelve los primeros 2 dígitos
    }
    return `${valorLimpio.slice(0, 2)}/${valorLimpio.slice(2, 4)}`; // Aplica formato MM/AA
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen de Compra */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resumen de Compra</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4 mb-4">
              <img
                src={item.producto?.imagen || "/placeholder.png"}
                alt={item.producto?.nombre || "Producto"}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">{item.producto?.nombre}</h3>
                <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                <p className="font-semibold">{`$${item.precio_unitario || 0}`}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-lg">{`$${calculateTotal()}`}</span>
          </div>
        </div>

        {/* Información del Pedido */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Información de Envío</h2>
          <p className="mb-4">{direccionEnvio}</p>
          <h2 className="text-xl font-bold mb-4">Método de Envío</h2>
          <select
            value={metodoEnvioSeleccionado}
            onChange={(e) => setMetodoEnvioSeleccionado(e.target.value)}
            className="w-full p-3 border rounded mb-4"
          >
            <option value="">Seleccionar método de envío</option>
            {metodosEnvio.map((metodo) => (
              <option key={metodo.id} value={metodo.id}>
                {metodo.nombre} - {`$${metodo.costo}`}
              </option>
            ))}
          </select>
          <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
          <select
            value={metodoPagoSeleccionado}
            onChange={(e) => setMetodoPagoSeleccionado(e.target.value.toLowerCase())}
            className="w-full p-3 border rounded mb-4"
          >
            <option value="">Seleccionar método de pago</option>
            {metodosPago.map((metodo) => (
              <option key={metodo.id} value={metodo.nombre.toLowerCase()}>
                {metodo.nombre}
              </option>
            ))}
          </select>
          <button
            onClick={handleRealizarPedido}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Realizar Pedido
          </button>
        </div>
      </div>

      {/* Modal */}
      <ModalComponent
        title="Detalles de Tarjeta"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={() => {
          if (!validarFechaExpiracion(detallesTarjeta.fechaExpiracion)) {
            toast.error("La fecha de expiración debe estar en formato MM/AA.");
            return;
          }
          realizarPedido();
        }}
      >
        <p className="mb-2 font-bold">Correo: {datosUsuario.correoContacto}</p>
        <p className="mb-4 font-bold">Teléfono: {datosUsuario.telefonoContacto}</p>
        <input
          type="text"
          placeholder="Número de Tarjeta"
          value={detallesTarjeta.numeroTarjeta}
          onChange={(e) => setDetallesTarjeta({ ...detallesTarjeta, numeroTarjeta: e.target.value })}
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Nombre del Titular"
          value={detallesTarjeta.nombreTitular}
          onChange={(e) => setDetallesTarjeta({ ...detallesTarjeta, nombreTitular: e.target.value })}
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Fecha de Expiración (MM/AA)"
          value={detallesTarjeta.fechaExpiracion}
          onChange={(e) =>
            setDetallesTarjeta({
              ...detallesTarjeta,
              fechaExpiracion: manejarFormatoFechaExpiracion(e.target.value),
            })
          }
          className="w-full p-3 border rounded"
        />
      </ModalComponent>
    </div>
  );
};

export default CartPage;
