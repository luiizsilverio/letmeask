import { useEffect, useState } from "react"
import { database } from "../services/firebase"

type FirebaseQuestion = {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}

type FirebaseQuestions = Record<string, FirebaseQuestion>

interface IQuestion extends FirebaseQuestion {
  id: string
}

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [title, setTitle] = useState('')
  

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

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
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            hasLiked: boolean
          }
        })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])
  
  return { questions, title }
}