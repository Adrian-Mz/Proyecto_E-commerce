import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { PedidosAPI } from "../../api/api.pedidos";
import ModalComponent from "../../components/UI/ModalComponent";
import { toast } from "react-toastify";
import { FaCcVisa } from "react-icons/fa";

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
    fechaExpiracionMes: "",
    fechaExpiracionAnio: "",
    cvv: "",
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

        setDireccionEnvio(storedUser.direccion || "");
        setDatosUsuario({
          correoContacto: storedUser.correo,
          telefonoContacto: storedUser.telefono,
        });

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
      setModalVisible(true);
      return;
    }

    realizarPedido();
  };

  const realizarPedido = async () => {
    const fechaExpiracion = `${detallesTarjeta.fechaExpiracionMes}/${detallesTarjeta.fechaExpiracionAnio}`;

    if (!/^\d{2}\/\d{2}$/.test(fechaExpiracion)) {
      toast.error("La fecha de expiración debe estar en el formato MM/YY.");
      return;
    }

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
          fechaExpiracion,
          correoContacto: datosUsuario.correoContacto,
          telefonoContacto: datosUsuario.telefonoContacto,
        },
      };

      await PedidosAPI.createPedido(storedUser.id, pedidoData);
      toast.success("Pedido realizado con éxito.");
      clearCart();
      setModalVisible(false);
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      toast.error("Hubo un error al realizar el pedido.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <ModalComponent
        title="Detalles de Tarjeta"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={() => realizarPedido()}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre en la tarjeta</label>
            <input
              type="text"
              placeholder="Jason Doe"
              value={detallesTarjeta.nombreTitular}
              onChange={(e) =>
                setDetallesTarjeta({ ...detallesTarjeta, nombreTitular: e.target.value })
              }
              className="w-full p-2 border rounded shadow-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">Número de tarjeta</label>
            <input
              type="text"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              maxLength={16}
              value={detallesTarjeta.numeroTarjeta}
              onChange={(e) =>
                setDetallesTarjeta({ ...detallesTarjeta, numeroTarjeta: e.target.value })
              }
              className="w-full p-2 border rounded shadow-sm"
            />
            <FaCcVisa className="absolute right-4 top-10 text-gray-500" />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium">Expiración (MM/YY)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                  value={detallesTarjeta.fechaExpiracionMes}
                  onChange={(e) =>
                    setDetallesTarjeta({ ...detallesTarjeta, fechaExpiracionMes: e.target.value })
                  }
                  className="w-16 p-2 border rounded shadow-sm"
                />
                <input
                  type="text"
                  placeholder="YY"
                  maxLength={2}
                  value={detallesTarjeta.fechaExpiracionAnio}
                  onChange={(e) =>
                    setDetallesTarjeta({ ...detallesTarjeta, fechaExpiracionAnio: e.target.value })
                  }
                  className="w-16 p-2 border rounded shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">CVV</label>
              <input
                type="text"
                placeholder="•••"
                maxLength={3}
                value={detallesTarjeta.cvv}
                onChange={(e) =>
                  setDetallesTarjeta({ ...detallesTarjeta, cvv: e.target.value })
                }
                className="w-16 p-2 border rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default CartPage;
