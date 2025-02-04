const http = require('http')
const os = require('os')
const { promises: fs } = require('fs')
const path = require('path')

const express = require('express')
const pty = require('node-pty')
const cors = require('cors')
const chokidar = require('chokidar')
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
    cwd: process.env.INIT_CWD + '/user',
    env: process.env
})

// Don't need to manually handle the upgrade event yourself when using socket.io, leads to conflicts and the "handleUpgrade called more than once" error
// io.attach(server)

app.use(cors())

chokidar.watch('./user').on('all', (event, path) => {
    io.emit('file:refresh', path)
})

ptyProcess.onData(data => {
    io.emit('terminal:data', data)
})

io.on('connection', (socket) => {
    console.log("User successfully connected to server with id: ", socket.id)

    socket.on('file:change', async ({ path, content }) => {
        await fs.writeFile(`./user/${path}`, content)
        socket.emit('file:saved', { path }); // Emit confirmation event
    })

    socket.on('terminal:write', (data) => {
        ptyProcess.write(data)
    })
})

app.get('/files', async (req, res) => {
    const fileTree = await generateFileTree('./user')
    return res.json({tree: fileTree})
})

app.get('/files/content', async (req, res) => {
    const path = req.query.path
    const content = await fs.readFile(`./user/${path}`, 'utf8')
    return res.json({content: content})
})

server.listen(port, () => {
    console.log(`🐳 Docker Server is listening on port: ${port}`)
})

// Files are a type of tree data-structure
// Trees work recursively

async function generateFileTree(directory) {
    const tree = {}

    async function buildTree(currentDir, currentTree) {
        let files
        try {
            files = await fs.readdir(currentDir)
        } catch (err) {
            console.error("Error reading directory: ", err)
            return
        }

        for (const file of files) {
            const filePath = path.join(currentDir, file)
            let stat
            try {
                stat = await fs.stat(filePath)
            } catch (err) {
                console.error("Error getting file stats: ", err)
                continue
            }

            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            } else {
                currentTree[file] = null
            }
        }
    }

    await buildTree(directory, tree)
    return tree
}