import React, {useState} from "react";
import InputField from "./InputField";
import Button from "./Button";

const LoginForm = () => {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        //validacion basica de email y password
        if (email === "" || password === "") {
            alert("Por favor, completa todos los campos");
            return;
        }
        console.log("Datos enviados",{email, password});
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required={true}
            />
            <InputField
                id="password"
                label="Contraseña"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
            />
            <Button type="submit">Iniciar sesión</Button>
        </form>
    );
};

export default LoginForm;