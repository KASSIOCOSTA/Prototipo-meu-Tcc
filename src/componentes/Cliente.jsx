import { useState } from "react"

function Cliente() {
    const [fotoPrincipal, setFotoPrincipal] = useState(null)

    const escolherFoto = (evento) => {
        setFotoPrincipal(evento.target.files[0])
    }

    return (
        <div>
            <h1>Personalize sua experiência</h1>
            <p>Preencha os dados para criar sua experiência.</p>

            <div>
                <label htmlFor="fotoPrincipal">
                    Escolha a foto principal
                </label>

                <input
                    id="fotoPrincipal"
                    type="file"
                    accept="image/*"
                    onChange={escolherFoto}
                />

                {fotoPrincipal && (
                    <p>Foto selecionada: {fotoPrincipal.name}</p>
                )}
            </div>
        </div>
    )
}

export default Cliente