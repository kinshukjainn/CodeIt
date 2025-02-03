import { Terminal as XTerminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { useEffect, useRef } from 'react'

import socket from '../socket'

const Terminal = () => {

    const terminalRef = useRef()
    const isRendered = useRef(false)

    // In developement mode, useEffect is rendered twice
    useEffect(() => {
        if(isRendered.current) return
        isRendered.current = true

        const term = new XTerminal({
            rows: 20,
        })
        term.open(terminalRef.current)

        // Client to Server
        term.onData(data => {
            // console.log(data)
            socket.emit('terminal:write', data)
        })

        // Server to Client
        socket.on('terminal:data', (data) => {
            term.write(data)
            
        })
    }, [])

    return (
        <div ref={terminalRef} id='terminal' />
    )
}

export default Terminal