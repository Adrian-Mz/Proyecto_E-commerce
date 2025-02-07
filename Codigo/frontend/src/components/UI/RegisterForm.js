
import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import countries from "../../utils/countries";
import { UsuariosAPI } from "../../api/api.usuarios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    fechaNacimiento: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, color: "bg-red-500" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Para redirigir al login

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Eliminar errores específicos al escribir en el campo
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: undefined,
    }));

    setFormData((prevData) => ({ ...prevData, [id]: value }));

    if (id === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // Validar el teléfono al enviar el formulario
  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return "El teléfono debe ser un número de 10 dígitos y empezar con '09'.";
    }
    return undefined;
  };

  // Evaluar la fuerza de la contraseña
  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[@$!%*?&]/.test(password)) score += 25;

    let color = "bg-red-500";
    if (score >= 75) color = "bg-green-500";
    else if (score >= 50) color = "bg-yellow-500";
    else if (score >= 25) color = "bg-orange-500";

    setPasswordStrength({ score, color });
  };

  // Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setIsSubmitting(true);
    
    const phoneError = validatePhone(formData.telefono);

    if (phoneError) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        telefono: phoneError,
      }));
      toast.error(phoneError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Convertir fecha de nacimiento al formato correcto
      const formattedData = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento.split("T")[0],
      };
  
      // Llamar a la API para registrar al usuario
      await UsuariosAPI.createUsuario(formattedData);
  
      // Si el registro es exitoso
      toast.success("Usuario registrado correctamente. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login"); // Redirigir al login después de 2 segundos
      }, 2000);
    } catch (error) {
      const backendErrors = error.response?.data?.errors || [];
      const fieldErrors = backendErrors.reduce((acc, curr) => {
        const key = curr.path || "general"; // Si no hay un `path`, se asigna como error general.
        acc[key] = curr.msg || curr.message; // Manejar tanto `msg` como `message`.
        return acc;
      }, {});
  
      setValidationErrors(fieldErrors);
  
      // Mostrar errores específicos del backend como notificaciones
      if (backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          toast.error(err.msg || err.message, { position: "top-right" });
        });
      } else {
        toast.error(
          error.response?.data?.error || "Ocurrió un error al registrar el usuario.",
          { position: "top-right" }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-2 xl:grid-cols-2 gap-6">
        <InputField
          id="nombre"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        {validationErrors.nombre && (
          <p className="text-red-500 text-sm">{validationErrors.nombre}</p>
        )}

        <InputField
          id="apellido"
          label="Apellido"
          type="text"
          placeholder="Tu apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        {validationErrors.apellido && (
          <p className="text-red-500 text-sm">{validationErrors.apellido}</p>
        )}

        <InputField
          id="correo"
          label="Correo electrónico"
          type="email"
          placeholder="email@ejemplo.com"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        {validationErrors.correo && (
          <p className="text-red-500 text-sm">{validationErrors.correo}</p>
        )}

        {/* Contraseña */}
        <div>
          <InputField
            id="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="text-blue-500 text-sm underline mt-1"
          >
            {showPassword ? "Ocultar" : "Mostrar"} contraseña
          </button>
          <div className="mt-2 w-full bg-gray-300 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score}%` }}></div>
          </div>
          <ul className="text-sm text-gray-400 mt-2">
            <li>• Al menos 8 caracteres</li>
            <li>• Una letra mayúscula</li>
            <li>• Un número</li>
            <li>• Un carácter especial (@, $, !, %, *, ?, &)</li>
          </ul>
          {validationErrors.password && (
            <p className="text-red-500 text-sm">{validationErrors.password}</p>
          )}
        </div>

        <InputField
          id="direccion"
          label="Dirección"
          type="text"
          placeholder="Tu dirección"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
        {validationErrors.direccion && (
          <p className="text-red-500 text-sm">{validationErrors.direccion}</p>
        )}

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-white-100">
            Teléfono
          </label>
          <div className="flex items-center relative mt-2">
            <input
              id="telefono"
              type="text"
              placeholder="09XXXXXXXX"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-2 border rounded text-gray-700"
              required
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg"
              alt="Ecuador Flag"
              className="w-6 h-6 absolute right-3"
            />
          </div>
          {validationErrors.telefono && (
            <p className="text-red-500 text-sm">{validationErrors.telefono}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="ciudad"
            className="block text-sm font-medium text-gray-100"
          >
            Ciudad
          </label>
          <select
            id="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona tu ciudad</option>
            {countries.map((countries, index) => (
              <option key={index} value={countries}>
                {countries}
              </option>
            ))}
          </select>
          {validationErrors.ciudad && (
            <p className="text-red-500 text-sm">{validationErrors.ciudad}</p>
          )}
        </div>

        <InputField
          id="fechaNacimiento"
          label="Fecha de nacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          required
        />
        {validationErrors.fechaNacimiento && (
          <p className="text-red-500 text-sm">
            {validationErrors.fechaNacimiento}
          </p>
        )}
      </div>

      {/* Botón de envío */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;