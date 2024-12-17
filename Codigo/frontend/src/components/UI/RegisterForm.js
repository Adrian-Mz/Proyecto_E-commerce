import React, {useState} from 'react';
import InputField from './InputField';
import Button from './Button';
import { UsuariosService } from '../../services/usuarios.services'
import countries from '../../utils/countries'

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        direccion: "",
        telefono: "",
        pais: "",
        fechaNacimiento: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Manejar cambios en los campos
    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({...prevData, [id]:value}))

        
    }

    //Envio de datos BackEnd
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({type: "success", text: "Datos enviados correctamente"});

        const formattedFormData = {
            ...formData,
            fechaNacimiento: new Date(formData.fechaNacimiento).toISOString().split("T")[0],
          };

        setIsSubmitting(true);
        const response = await UsuariosService.createUsuario(formattedFormData);

        if (response.success) {
            setMessage({ type: "success", text: response.message });
            setFormData({
                nombre: "",
                apellido: "",
                email: "",
                password: "",
                direccion: "",
                telefono: "",
                pais: "",
                fechaNacimiento: "",
            });
        }else {
            setMessage({ type: "error", text: response.message });
        }
        setIsSubmitting(false);
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
          {message.type &&(
            <div className={`p-2 rounded-md ${
                message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
            >
                {message.text}
            </div>
          )}
          
          <InputField
            id="nombre"
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <InputField
            id="apellido"
            label="Apellido"
            type="text"
            placeholder="Tu apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <InputField
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="email@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <InputField
            id="direccion"
            label="Dirección"
            type="text"
            placeholder="Tu dirección"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          <InputField
            id="telefono"
            label="Teléfono"
            type="text"
            placeholder="0123456789"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <div>
            <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
              País
            </label>
            <select
              id="pais"
              value={formData.pais}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
                <option value = "">Selecciona tu país</option>
                {countries.map((country, index) => (
                    <option key={index} value={country}>
                        {country}
                    </option>
                ))}
            </select>
          </div>
          <InputField
                id="fechaNacimiento"
                label="Fecha de nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
    );
}

export default RegisterForm;