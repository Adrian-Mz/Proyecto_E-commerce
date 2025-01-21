import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { UsuariosAPI } from "../../api/api.usuarios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corregido
import { useCart } from "../../context/CartContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { changeUser, clearCart } = useCart(); // Importar funciones del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (!email.trim() || !password.trim()) {
      setMessage("Por favor, completa todos los campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await UsuariosAPI.loginUsuario({ correo: email, password });

      // Guarda el token y el usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(response));

      // Decodifica el token para obtener el ID del usuario
      const decodedToken = jwtDecode(response.token);

      // Limpia el carrito actual y lo sincroniza con el usuario logueado
      clearCart(); // Opcional: limpia el carrito visual antes de sincronizar
      changeUser(decodedToken.id); // Establece el nuevo usuario para cargar su carrito

      setMessage("Inicio de sesión exitoso.");

      // Redirige en función del rol
      setTimeout(() => {
        if (decodedToken.rol === "Administrador") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 1000);
    } catch (error) {
      setMessage("Credenciales incorrectas. Verifica tus datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-2 rounded-md ${
            message.includes("exitoso")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <InputField
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        id="password"
        label="Contraseña"
        type="password"
        placeholder="******"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
};

export default LoginForm;
