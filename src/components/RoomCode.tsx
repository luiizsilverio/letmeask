import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type Props = {
  code: string
}

export function RoomCode(props: Props) {
  function copyToClipboard() {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className="room-code" onClick={copyToClipboard}>
      <div>
        <img src={copyImg} alt="Copiar o código da sala" />
      </div>
      <span>Sala {props.code}</span>
    </button>
  )
}