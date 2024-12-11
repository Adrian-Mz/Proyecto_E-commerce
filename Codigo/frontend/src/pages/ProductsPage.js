import React, { useEffect, useState} from 'react';
import {ProductosService} from '../services/productos.services';

const ProductosPage = () => {
    const[productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async() => {
            const data = await ProductosService.getProductos();
            setProductos(data);
        };

        fetchProductos();
    }, []);

    return (
        <div className='p-6'> 
        <h1 className='text-2xl font-bold mb-4'>Productos</h1>
        <div className='grid grid-cols-3 gap-4'>
            {productos.map((producto) =>(
                <div
                    key={producto.id}
                    className='p-4 border roundend shadow-sm hover:shadow-lg'
                >
                    <h2 className='font-bold'>{producto.nombre}</h2>
                    <p>{producto.descripcion}</p>
                    <p className='font-bold'>{producto.precioFormateado}</p>
                </div>
            ))}
        </div>
    </div>
    )
}

export default ProductosPage;