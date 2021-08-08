import { FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase';
import '../styles/room.scss'

type RoomParams = {
  id: string
}

type FirebaseQuestion = {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
}

type FirebaseQuestions = Record<string, FirebaseQuestion>

type Question = FirebaseQuestion & {
  id: string
}

export function Room() {
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  const { user } = useAuth()

  const params = useParams<RoomParams>();

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    
    if (newQuestion.trim() === '' ) {
      return
    }

    if (!user) {
      toast.error('Você precisa estar logado.')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${params.id}/questions`).push(question)

    setNewQuestion('')

    toast.success('Pergunta enviada com sucesso.')
  }

  useEffect(() => {
    const roomRef = database.ref(`rooms/${params.id}`)

    // cria um event listener que ouve toda vez que muda o valor da roomId
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions || {}

      // como a API retorna a coleção como objeto, e não como array, precisamos converter
      const parsedQuestions = Object.entries(firebaseQuestions)
        .map(([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered
          }
        })

        setTitle(databaseRoom.title)
        setQuestions(parsedQuestions)
    })
  }, [params.id])

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logotipo Letmeask" />
          <RoomCode code={params.id} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala { title }</h1>
          {
            questions.length > 0 &&
              <span>{ questions.length } pergunta(s)</span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">
            {
              user ? (
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
              )
            }
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questions)}

      </main>

      <Toaster />
    </div>
  )
}