import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import '../styles/room.scss'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id
  const { title, questions } = useRoom(roomId)

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()      
    }
  }
  
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleCheckQuestion(questionId: string, is_Answered: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({      
      isAnswered: !is_Answered
    })
  }

  async function handleHighlightQuestion(questionId: string, is_Highlighted: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({      
      isHighlighted: !is_Highlighted
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logotipo Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                >
                <button 
                  type="button"
                  onClick={() => handleCheckQuestion(question.id, question.isAnswered)}
                  title="Marcar a pergunta como respondida"
                >
                  <img src={checkImg} alt="Marcar a pergunta como respondida" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                  title="Destacar a pergunta"
                >
                  <img src={answerImg} alt="Destacar a pergunta" />
                </button>
                <button 
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  title="Remover a pergunta"
                >
                  <img src={deleteImg} alt="Remover a pergunta" />
                </button>
              </Question>
            ))
          }
        </div>

      </main> 
    </div>
  )
}