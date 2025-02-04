import React, { useState, useEffect } from "react";
import TableComponent from "../../components/UI/TableComponent";
import ModalComponent from "../../components/UI/ModalComponent";
import { ProductosService } from "../../api/api.productos";
import { CategoriasService } from "../../api/api.categorias";
import { PromocionesService } from "../../api/api.promociones";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionProductosPage = () => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedPromocion, setSelectedPromocion] = useState("");
  const [sortOrderPrecio, setSortOrderPrecio] = useState(""); // Estado para ordenar el precio
  const [sortOrderStock, setSortOrderStock] = useState("");  // "asc" para ascendente, "desc" para descendente


  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    especificaciones: "",
    imagen: null,
    marca: "",
    precio: "",
    stock: "",
    garantia: "",
    categoriaId: "",
    promocionId: "",
    ivaPorcentaje: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await ProductosService.getProductos();
        const categoriasResponse = await CategoriasService.getCategorias();
        const promocionesResponse = await PromocionesService.getPromociones();
        const productosProcesados = productosResponse.productos.map(producto => ({
          ...producto,
          precio: parseFloat(producto.precio).toFixed(2), // ✅ No modificar el precio
          ivaPorcentaje: parseInt(producto.ivaPorcentaje, 10) || 0 // ✅ Asegurar que es número
        }));

        setData(productosProcesados);
        setCategorias(categoriasResponse || []);
        setPromociones(promocionesResponse || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos");
        setData([]);
        setCategorias([]);
        setPromociones([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearNewProduct = () => {
    setNewProduct({
      nombre: "",
      descripcion: "",
      especificaciones: "",
      imagen: "",
      marca: "",
      precio: "",
      stock: "",
      garantia: "",
      categoriaId: "",
      promocionId: "",
      ivaPorcentaje: "",
    });
  };

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
      const formData = new FormData();
  
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key === "imagen" && value instanceof File) {
          formData.append(key, value); // ✅ Asegurar que la imagen se envía correctamente
        } else {
          formData.append(key, value || "");
        }
      });
  
      const createdProduct = await ProductosService.createProducto(formData);
  
      // 🔄 Agregar solo el nuevo producto sin recargar
      setData((prevData) => [...prevData, createdProduct]);
      clearNewProduct();
      setIsAddModalOpen(false);
      toast.success("Producto añadido correctamente");
    } catch (error) {
      console.error("Error al añadir producto:", error.response?.data || error.message);
      toast.error("Error al añadir producto. Verifica los datos.");
    }
  };
  

  const handleEditProduct = async () => {
    try {
      if (selectedProduct) {
        const updatedData = {
          descripcion: selectedProduct.descripcion || "",
          garantia: selectedProduct.garantia || "",
          especificaciones: selectedProduct.especificaciones || "",
          imagen: selectedProduct.imagen || "",
          marca: selectedProduct.marca || "",
          nombre: selectedProduct.nombre || "",
          precio: parseFloat(selectedProduct.precio), // ✅ Enviar el precio sin modificación
          stock: parseInt(selectedProduct.stock, 10),
          categoriaId: selectedProduct.categoriaId ? parseInt(selectedProduct.categoriaId, 10) : null,
          promocionId: selectedProduct.promocionId ? parseInt(selectedProduct.promocionId, 10) : null,
          ivaPorcentaje: parseFloat(selectedProduct.ivaPorcentaje), // ✅ Enviar solo el valor, sin cálculos adicionales
        };
  
        const updatedProduct = await ProductosService.updateProducto(selectedProduct.id, updatedData);
  
        // 🔄 Actualizar solo el producto modificado en la lista sin recargar
        setData((prevData) =>
          prevData.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
        );
  
        setSelectedProduct(null);
        setIsEditModalOpen(false);
        toast.success("Producto editado correctamente");
      }
    } catch (error) {
      console.error("Error al editar producto:", error.response?.data || error.message);
      toast.error("Error al editar producto");
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await ProductosService.deleteProducto(id);
  
      // Volver a obtener los productos sin recargar la página
      const productosResponse = await ProductosService.getProductos();
      const productosProcesados = productosResponse.productos.map(producto => ({
        ...producto,
        precio: parseFloat(producto.precio).toFixed(2),
        ivaPorcentaje: parseInt(producto.ivaPorcentaje, 10) || 0,
      }));
  
      setData(productosProcesados);
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
  
      const backendErrors = error.response?.data?.errors || [];
      const generalError = error.response?.data?.error || "Ocurrió un error al eliminar el producto.";
  
      if (backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          toast.error(err.msg || err.message, { position: "top-right" });
        });
      } else {
        toast.error(generalError, { position: "top-right" });
      }
    }
  };
    

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const filteredData = data
  .filter((producto) => {
    const nombre = producto.nombre ? producto.nombre.toLowerCase() : "";
    const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : "";

    return (
      nombre.includes(searchTerm.toLowerCase()) ||
      descripcion.includes(searchTerm.toLowerCase())
    );
  })
  .filter((producto) => !selectedCategoria || (producto.categoriaId && producto.categoriaId.toString() === selectedCategoria))
  .filter((producto) => !selectedMarca || (producto.marca && producto.marca === selectedMarca))
  .filter((producto) => !selectedPromocion || (producto.promocionId && producto.promocionId.toString() === selectedPromocion));

  // Ordenar por precio
  if (sortOrderPrecio) {
    filteredData.sort((a, b) => {
      return sortOrderPrecio === "asc" ? a.precio - b.precio : b.precio - a.precio;
    });
  }

  // Ordenar por stock
  if (sortOrderStock) {
    filteredData.sort((a, b) => {
      return sortOrderStock === "asc" ? a.stock - b.stock : b.stock - a.stock;
    });
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  if (isLoading) {
    return <div className="text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>

        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded pl-10 w-64 text-gray-700"
          />
        </div>

        {/* Botón para añadir */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setIsAddModalOpen(true);
            clearNewProduct();
          }}
        >
          Añadir
        </button>

        {/* Paginación */}
        <div className="flex items-center space-x-2">
          <button
            className="px-1 py-1 mx-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span className="text-gray-700">{`${currentPage} de ${totalPages || 1}`}</span>
          <button
            className="px-1 py-1 mx-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        {/* Filtro por categoría */}
        <select
          className="border p-2 rounded text-gray-700"
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        {/* Filtro por marca */}
        <select
          className="border p-2 rounded text-gray-700"
          value={selectedMarca}
          onChange={(e) => setSelectedMarca(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {["Intel", "AMD", "Nvidia", "Corsair", "Kingston", "Seagate"].map((marca) => (
            <option key={marca} value={marca}>
              {marca}
            </option>
          ))}
        </select>

        {/* Filtro por promoción */}
        <select
          className="border p-2 rounded text-gray-700"
          value={selectedPromocion}
          onChange={(e) => setSelectedPromocion(e.target.value)}
        >
          <option value="">Todas las promociones</option>
          {promociones.map((promo) => (
            <option key={promo.id} value={promo.id}>
              {promo.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded text-gray-700"
          value={sortOrderPrecio}
          onChange={(e) => setSortOrderPrecio(e.target.value)}
        >
          <option value="">Ordenar Precio</option>
          <option value="asc">Menor a Mayor</option>
          <option value="desc">Mayor a Menor</option>
        </select>

        {/* Select para ordenar por stock */}
        <select
          className="border p-2 rounded text-gray-700"
          value={sortOrderStock}
          onChange={(e) => setSortOrderStock(e.target.value)}
        >
          <option value="">Ordenar Stock</option>
          <option value="asc">Menor a Mayor</option>
          <option value="desc">Mayor a Menor</option>
        </select>
      </div>

      <TableComponent
        columns={[
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          { key: "marca", label: "Marca" },
          { key: "precio", label: "Precio" },
          { key: "stock", label: "Stock" },
          { key: "categoria", label: "Categoría" },
          { key: "promocion", label: "Promoción" },
          { key: "iva", label: "IVA" },
          { key: "acciones", label: "Acciones" },
        ]}
        data={paginatedData.map((item) => ({
          ...item,
          descripcion: item.descripcion
          ? item.descripcion.split(" ").slice(0, 10).join(" ") + (item.descripcion.split(" ").length > 10 ? "..." : "")
          : "", // Limita a 10 palabras y añade "..." si es necesario
          precio: parseFloat(item.precio).toFixed(2),
          iva: `${item.ivaPorcentaje}%`,
          categoria: categorias.find((categoria) => categoria.id === item.categoriaId)?.nombre,
          promocion:
            promociones.find((promocion) => promocion.id === item.promocionId)?.nombre ||
            "Sin promoción",
          acciones: (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedProduct(item);
                  setIsEditModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ),
        }))}
      />
      <ModalComponent
        title="Añadir Producto"
        visible={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          clearNewProduct();
        }}
        onSave={handleAddProduct}
      >
        {renderProductInputs(newProduct, setNewProduct, categorias, promociones, marcasPopulares, garantiaOptions)}
      </ModalComponent>
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
          promociones,
          marcasPopulares,
          garantiaOptions
        )}
      </ModalComponent>
    </div>
  );
};

const renderProductInputs = (product, setProduct, categorias, promociones, marcasPopulares, garantiaOptions) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label>Nombre:</label>
      <input
        type="text"
        value={product?.nombre || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, nombre: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Descripción:</label>
      <textarea
        value={product?.descripcion || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, descripcion: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Marca:</label>
      <select
        value={product?.marca || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, marca: e.target.value }))}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione una marca</option>
        {marcasPopulares.map((marca) => (
          <option key={marca} value={marca}>
            {marca}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label>Precio:</label>
      <input
        type="number"
        value={product?.precio || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, precio: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Stock:</label>
      <input
        type="number"
        value={product?.stock || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, stock: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Garantía:</label>
      <select
        value={product?.garantia || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, garantia: e.target.value }))}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione una garantía</option>
        {garantiaOptions.map((garantia) => (
          <option key={garantia} value={garantia}>
            {garantia}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label>Categoría:</label>
      <select
        value={product?.categoriaId || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, categoriaId: e.target.value }))}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label>Promoción:</label>
      <select
        value={product?.promocionId || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, promocionId: e.target.value }))}
        className="border p-2 rounded w-full"
      >
        <option value="">Seleccione una promoción</option>
        {promociones.map((promocion) => (
          <option key={promocion.id} value={promocion.id}>
            {promocion.nombre}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label>Especificaciones:</label>
      <textarea
        value={product?.especificaciones || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, especificaciones: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>IVA (%):</label>
      <input
        type="number"
        min="0"
        max="100"
        value={product?.ivaPorcentaje || ""}
        onChange={(e) => setProduct((prev) => ({ ...prev, ivaPorcentaje: e.target.value }))}
        className="border p-2 rounded w-full"
      />
    </div>
    <div>
      <label>Imagen:</label>
      <input
        type="file"
        name="imagen"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setProduct((prev) => ({ ...prev, imagen: e.target.files[0] }));
          }
        }}
        className="border p-2 rounded w-full"
      />
    </div>

  </div>
);

export default GestionProductosPage;
