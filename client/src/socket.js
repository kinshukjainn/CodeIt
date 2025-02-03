import { io } from 'socket.io-client'

// Adding backend path to communicate with backend
const socket = io('http://localhost:3001')

export default socket