import React, {useEffect, useState} from 'react';
import {UsuariosService} from '../services/usuarios.services';

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fecthUsuarios = async() => {
            const data = await UsuariosService.getUsuarios();
            setUsuarios(data);
        };

        fecthUsuarios();

    }, []);
    return (
        <div className='p-6'> 
            <h1 className='text-2xl font-bold mb-4'>Usuarios</h1>
            <table className='min-w-full bg-white'>
                <thead>
                    <tr>
                        <th className='py-2 px-4'>ID</th>
                        <th className='py-2 px-4'>Nombre</th>
                        <th className='py-2 px-4'>Apellido</th>
                        <th className='py-2 px-4'>Email</th>
                        <th className='py-2 px-4'>Fecha de Nacimiento</th>
                        <th className='py-2 px-4'>Direccion</th>
                        <th className='py-2-px-4'>Pais</th>
                        <th className='py-2 px-4'>Telefono</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {usuarios.map((usuario) =>(
                        <tr key={usuario.id}>
                            <th className='py-2 px-4'>{usuario.id}</th>
                            <th className='py-2 px-4'>{usuario.nombre}</th>
                            <th className='py-2 px-4'>{usuario.apellido}</th>
                            <th className='py-2 px-4'>{usuario.correo}</th>
                            <th className='py-2 px-4'>{usuario.fechaNacimiento}</th>
                            <th className='py-2 px-4'>{usuario.direccion}</th>
                            <th className='py-2 px-4'>{usuario.pais}</th>
                            <th className='py-2 px-4'>{usuario.telefono}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsuariosPage;