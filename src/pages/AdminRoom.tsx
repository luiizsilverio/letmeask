import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question';
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const [newQuestion, setNewQuestion] = useState('')
  const { user } = useAuth()
  const params = useParams<RoomParams>();

  const { title, questions } = useRoom(params.id)

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

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logotipo Letmeask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
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
    
        <div className="question-list">
          {
            questions.map(question => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            ))
          }
        </div>

      </main>

      <Toaster />
    </div>
  )
}