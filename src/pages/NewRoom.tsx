import { Link } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleImg from '../assets/images/google-icon.svg'

import '../styles/home.scss'
import { Button } from '../components/Button'

export function NewRoom() {
  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração de fundo" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main className="main-content">
        <div>
          <img src={logoImg} alt="Logotipo Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form>
            <input 
              type="text" 
              placeholder="Nome da sala"
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala existente? 
            <Link to="/">
              clique aqui
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}