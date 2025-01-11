import React, { useState, useEffect } from "react";
import TableComponent from "../components/UI/TableComponent";
import ModalComponent from "../components/UI/ModalComponent";
import { ProductosService } from "../api/api.productos";
import { CategoriasService } from "../api/api.categorias";
import { FaEdit, FaTrash } from "react-icons/fa";

const GestionProductosPage = () => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    especificaciones: "",
    precio: "",
    stock: "",
    garantia: "",
    imagen: "",
    categoriaId: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await ProductosService.getProductos();
        const categoriasResponse = await CategoriasService.getCategorias();

        setData(productosResponse.productos || []);
        setCategorias(categoriasResponse || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setData([]);
        setCategorias([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const marcasPopulares = [
    "Intel",
    "AMD",
    "Nvidia",
    "Corsair",
    "Kingston",
    "Seagate",
    "Western Digital",
    "MSI",
    "ASUS",
    "Gigabyte",
    "Lenovo",
    "HP",
    "Dell",
  ];

  const garantiaOptions = Array.from({ length: 12 }, (_, i) => `${(i + 1) * 3} meses`);
  garantiaOptions.unshift("1 mes");

  const handleAddProduct = async () => {
    try {
      const createdProduct = await ProductosService.createProducto(newProduct);
      setData((prevData) => [...prevData, createdProduct]);
      setNewProduct({
        nombre: "",
        descripcion: "",
        marca: "",
        especificaciones: "",
        precio: "",
        stock: "",
        garantia: "",
        imagen: "",
        categoriaId: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error al añadir producto:", error);
    }
  };

  const handleEditProduct = async () => {
    try {
      if (selectedProduct) {
        const updatedProduct = await ProductosService.updateProducto(
          selectedProduct.id,
          selectedProduct
        );
        setData((prevData) =>
          prevData.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item
          )
        );
        setSelectedProduct(null);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ProductosService.deleteProducto(id);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Gestión de Productos
      </h1>
      <p className="mb-6 text-gray-700">
        Bienvenido, administrador. Aquí puedes gestionar los productos:
        ver, añadir, editar o eliminar productos.
      </p>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Añadir
        </button>
      </div>
      <div className="relative">
        <div className="absolute top-[-40px] right-0">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <TableComponent
        columns={[
          { key: "id", label: "ID" },
          { key: "nombre", label: "Nombre" },
          { key: "marca", label: "Marca" },
          { key: "precio", label: "Precio" },
          { key: "stock", label: "Stock" },
          { key: "categoria", label: "Categoría" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((item) => ({
          ...item,
          categoria: categorias.find(
            (categoria) => categoria.id === item.categoriaId
          )?.nombre,
          acciones: (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedProduct(item);
                  setIsEditModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ),
        }))}
      />
      {/* Modal para añadir productos */}
      <ModalComponent
        title="Añadir Producto"
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      >
        {renderProductInputs(newProduct, setNewProduct, categorias, marcasPopulares, garantiaOptions)}
      </ModalComponent>
      {/* Modal para editar productos */}
      <ModalComponent
        title={`Editar Producto ${selectedProduct?.id}`}
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProduct}
      >
        {renderProductInputs(
          selectedProduct,
          setSelectedProduct,
          categorias,
          marcasPopulares,
          garantiaOptions
        )}
      </ModalComponent>
    </div>
  );
};

const renderProductInputs = (product, setProduct, categorias, marcasPopulares, garantiaOptions) => (
  <div>
    <label className="block mb-2">Nombre:</label>
    <input
      type="text"
      className="w-full p-2 border rounded"
      value={product?.nombre || ""}
      onChange={(e) =>
        setProduct((prev) => ({
          ...prev,
          nombre: e.target.value,
        }))
      }
    />
    <label className="block mb-2 mt-4">Marca:</label>
    <select
      className="w-full p-2 border rounded"
      value={product?.marca || ""}
      onChange={(e) =>
        setProduct((prev) => ({
          ...prev,
          marca: e.target.value,
        }))
      }
    >
      <option value="">Seleccione una marca</option>
      {marcasPopulares.map((marca, index) => (
        <option key={index} value={marca}>
          {marca}
        </option>
      ))}
    </select>
    <label className="block mb-2 mt-4">Precio:</label>
    <input
      type="number"
      min={1}
      max={10000}
      className="w-full p-2 border rounded"
      value={product?.precio || ""}
      onChange={(e) =>
        setProduct((prev) => ({
          ...prev,
          precio: e.target.value,
        }))
      }
    />
    <label className="block mb-2 mt-4">Stock:</label>
    <input
      type="number"
      min={1}
      max={1000}
      className="w-full p-2 border rounded"
      value={product?.stock || ""}
      onChange={(e) =>
        setProduct((prev) => ({
          ...prev,
          stock: e.target.value,
        }))
      }
    />
    <label className="block mb-2 mt-4">Garantía:</label>
    <select
      className="w-full p-2 border rounded"
      value={product?.garantia || ""}
      onChange={(e) =>
        setProduct((prev) => ({
          ...prev,
          garantia: e.target.value,
        }))
      }
    >
      <option value="">Seleccione una garantía</option>
      {garantiaOptions.map((opcion, index) => (
        <option key={index} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
    <label className="block mb-2 mt-4">Categoría:</label>
    <select
      className="w-full p-2 border rounded"
      value={product?.categoriaId || ""}
      onChange={(e) =>
        setProduct((prev) => ({
          ...prev,
          categoriaId: e.target.value,
        }))
      }
    >
      <option value="">Seleccione una categoría</option>
      {categorias.map((categoria) => (
        <option key={categoria.id} value={categoria.id}>
          {categoria.nombre}
        </option>
      ))}
    </select>
  </div>
);

export default GestionProductosPage;