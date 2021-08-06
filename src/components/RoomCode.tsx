import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

export function RoomCode() {
  return (
    <button className="room-code">
      <div>
        <img src={copyImg} alt="Copiar o código da sala" />
      </div>
      <span>Sala #1234567890</span>
    </button>
  )
}