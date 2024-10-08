import { Navigate, useNavigate } from "react-router-dom";
import './styles/AdminHome.css'
import { useState } from "react";

function AdminHome({user}){
    if(user!=='admin' || !user){
        return <Navigate to="/"/>
    }
    const home = useNavigate();
    const [textoEditar, setTextoEditar] = useState("");
    const [signoEditar, setSignoEditar] = useState("");

    function handleSelect(event){
        const signo = event.target.value;
        if(signo!=="0"){
            setSignoEditar(signo);
        } 
    }

    function goHome(){
        home("/");
    }

    function handleClick(e) {
        e.preventDefault();
    
        // Expresión regular para verificar si "hola" está en cualquier parte del texto
        const palabraProhibida = "culo";
        const regex = new RegExp(palabraProhibida, 'i'); // 'i' para ignorar mayúsculas y minúsculas
    
        // Verifica si "hola" está en cualquier parte del texto
        if (regex.test(textoEditar)) {
            // Si el texto contiene "hola", no realiza la solicitud y muestra un mensaje
            alert(`La palabra '${palabraProhibida}' no puede estar en el texto.`);
            return; // Salir de la función sin hacer la solicitud fetch
        }
    
        // Realiza la solicitud fetch solo si "hola" no está en el texto
        fetch(`http://localhost:4000/v1/signos/${signoEditar}`, {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"textoEditar": textoEditar})
        })
        .then(response => response.json())
        .then(data => {
            // Maneja la respuesta aquí si es necesario
            console.log("Respuesta del servidor:", data);
        })
        .catch(error => {
            // Maneja los errores aquí si es necesario
            console.error("Error en la solicitud:", error);
        });
    }
    

    return (
        <div class="container">
            <h2 id="textoAdmin">Edita un Signo Zodiacal</h2>
            <select id="editSignos" onClick={handleSelect}>
                <option value="0">Seleciona un signo zodiacal</option>
                <option value="Aries">Aries</option>
                <option value="Geminis">Géminis</option>
                <option value="Cancer">Cáncer</option>
                <option value="Leo">Leo</option>
                <option value="Virgo">Virgo</option>
                <option value="Libra">Libra</option>
                <option value="Escorpio">Escorpio</option>
                <option value="Sagitario">Sagitario</option>
                <option value="Capricornio">Capricornio</option>
                <option value="Acuario">Acuario</option>
                <option value="Piscis">Piscis</option>
            </select>
            <textarea id="textoEditar" cols="50" rows="10" onChange={(e)=> setTextoEditar(e.target.value)}>

            </textarea>
            <button id="btnEditar" onClick={handleClick}>Editar</button>
            <button id="btnHomeAdmin" onClick={goHome}>Home</button>
        </div>
    )
}

export default AdminHome;