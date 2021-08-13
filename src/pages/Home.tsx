import { FormEvent, useState } from 'react'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleImg from '../assets/images/google-icon.svg'
import { useHistory } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

import '../styles/home.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

export function Home() {
  const [roomCode, setRoomCode] = useState('')
  const history = useHistory()
  const { user, signInGoogle } = useAuth()

  async function handleCreateRoom() {
    if (!user) {
      await signInGoogle()
    }

    history.push('/rooms/new')    
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }
    
    // buscar a sala na coleção rooms
    const roomRef = await database.ref(`rooms/${roomCode}`).get()
    
    if (!roomRef.exists()) {
      toast.error('Sala não existe', {
        duration: 4000,
        position: 'top-right'
      })            
      return
    }

    if (roomRef.val().endedAt) {
      toast.error('Sala já foi fechada', {
        duration: 4000,
        position: 'top-right'
      })            
      return
    }

    history.push(`/rooms/${roomCode}`)    
  }

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
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              value={roomCode}
              onChange={ev => setRoomCode(ev.target.value)}
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>

        </div>
      </main>
      <Toaster />
    </div>
  )
}