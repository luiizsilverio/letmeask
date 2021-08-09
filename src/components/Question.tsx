import '../styles/question.scss'

type Props = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
}

export function Question({ content, author}: Props) {  
  return (
    <div className="question">
      <p>{ content }</p>
      <footer>
        <div className="user-info">
          <img src={ author.avatar } alt={ author.name } />
          <span>{ author.name }</span>
        </div>
        <div></div>
      </footer>
    </div>
  )
}