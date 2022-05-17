import { FormEvent, useState } from "react";
import { useHistory } from 'react-router-dom'

import { database } from '../services/firebase';
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";

import illustration from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }
        history.push('/rooms/new')
    }
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();
        if (roomCode.trim() === '') {
            return;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if (!roomRef.exists()){
            alert('Essa sala não existe!');
            return;
        }
        if (roomRef.val().closedAt) {
            alert('Esta sala foi encerrada.')
        }
        history.push(`/`);
    }
    return(
        <div id="page-auth">
            <aside>
                <img src={ illustration } alt="Inicial Imagem Login"/>
                <strong>Crie salas de Q&amp;A ao vivo!</strong>
                <p>Tire as dúvidas de sua audiência em tempo real.</p>
            </aside >
            <main>
                <div className="main-content">
                    <img src={ logoImg } alt="LetMeAsk" />
                    <button
                        onClick={handleCreateRoom}
                        className="create-room">
                        <img src={ googleImg } alt="Logo do Google"/>
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        Ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite seu código de sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}