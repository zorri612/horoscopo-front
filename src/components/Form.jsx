import './styles/Form.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ callback }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Asigna un rol por defecto
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre login y registro
    const goTo = useNavigate();

    // Función para validar al usuario (Login)
    const validateUser = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://horoscopo-back-mu.vercel.app/v1/auth/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Login failed');
                return;
            }

            const data = await response.json();

            if (data && data.role) {
                callback(data.role);

                if (data.role === 'user') {
                    goTo("/userHome");
                } else if (data.role === 'admin') {
                    goTo("/adminHome");
                }
            } else {
                alert('Role not found in response');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    };

    // Función para cambiar la contraseña
    const handleChangePassword = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://horoscopo-back-mu.vercel.app/v1/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Contraseña cambiada con éxito');
                setIsChangePassword(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error durante el cambio de contraseña:', error);
            alert('Ha ocurrido un error al cambiar la contraseña.');
        }
    };

    // Función para registrar un nuevo usuario
    const registerUser = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://horoscopo-back-mu.vercel.app/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, role })
            });

            if (response.ok) {
                alert('Usuario creado exitosamente');
                setIsRegister(false); // Volver al formulario de login
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error durante la creación del usuario:', error);
            alert('Ha ocurrido un error al crear el usuario.');
        }
    };

    return (
        <div>
            {!isRegister ? (
                // Formulario de login
                !isChangePassword ? (
                    <form onSubmit={validateUser}>
                        <h1 id="txtBienvenida">Bienvenido a nuestro portal del Zodiaco</h1>
                        <h4 className="txt">Nombre de Usuario</h4>
                        <input type="text" className="entry" onChange={(e) => setUsername(e.target.value)} /><br />
                        <h4 className="txt">Contraseña</h4>
                        <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br />
                        <input type="submit" value="Ingresar" id="btnEnviar" />
                        <button type="button" onClick={() => setIsChangePassword(true)} id="btnChangePassword">
                            Cambiar Contraseña
                        </button>
                        <button type="button" onClick={() => setIsRegister(true)} id="btnRegister">
                            Crear Usuario
                        </button>
                    </form>
                ) : (
                    // Formulario de cambio de contraseña
                    <form onSubmit={handleChangePassword}>
                        <h1 id="txtCambiar">Cambiar Contraseña</h1>
                        <h4 className="txt">Nombre de Usuario</h4>
                        <input type="text" className="entry" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                        <h4 className="txt">Nueva Contraseña</h4>
                        <input type="password" className="entry" onChange={(e) => setNewPassword(e.target.value)} /><br />
                        <input type="submit" value="Cambiar" id="btnEnviar" />
                        <button type="button" onClick={() => setIsChangePassword(false)} id="btnCancel">
                            Cancelar
                        </button>
                    </form>
                )
            ) : (
                // Formulario de registro
                <form onSubmit={registerUser}>
                    <h1 id="txtRegistro">Crear Nuevo Usuario</h1>
                    <h4 className="txt">Nombre de Usuario</h4>
                    <input type="text" className="entry" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
                    <h4 className="txt">Contraseña</h4>
                    <input type="password" className="entry" onChange={(e) => setPassword(e.target.value)} /><br />
                    <h4 className="txt">Rol</h4>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="entry">
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select><br />
                    <input type="submit" value="Crear Usuario" id="btnEnviar" />
                    <button type="button" onClick={() => setIsRegister(false)} id="btnCancel">
                        Cancelar
                    </button>
                </form>
            )}
        </div>
    );
}

export default Form;
