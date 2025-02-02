const http = require('http')
const os = require('os')

const express = require('express')
const pty = require('node-pty')
const { Server: SocketServer } = require('socket.io')

const app = express()
const port = process.env.PORT || 3001

const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: '*'
})

const isWindows = os.platform() === 'win32' || os.platform() === 'win64';
const shell = isWindows ? 'powershell.exe' : 'bash';

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD,
    env: process.env
})

// Don't need to manually handle the upgrade event yourself when using socket.io, leads to conflicts and the "handleUpgrade called more than once" error
// io.attach(server)

ptyProcess.onData(data => {
    io.emit('terminal:data', data)
})

io.on('connection', (socket) => {
    console.log("User successfully connected to server with id: ", socket.id)

    socket.on('terminal:write', (data) => {
        ptyProcess.write(data)
    })
})

server.listen(port, () => {
    console.log(`🐳 Docker Server is listening on port: ${port}`)
})