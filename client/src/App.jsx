import React, { useCallback, useEffect, useState } from 'react'
import Terminal from './components/terminal'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import "./App.css"
import FileTree from './components/tree'
import socket from './socket'

const App = () => {

  const [fileTree, setFileTree] = useState({})
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedFileContent, setSelectedFileContent] = useState('')
  const [code, setCode] = useState('')

  const isSaved = selectedFileContent === code

  const getFileTree = async () => {
    const response = await fetch('http://localhost:3001/files')
    const result = await response.json()
    // return res.json({tree: fileTree}) in server/index.js
    setFileTree(result.tree)
  }

  const getFileContent = useCallback(async () => {
    if (!selectedFile) return
    
    const response = await fetch(`http://localhost:3001/files/content?path=${selectedFile}`)
    const result = response.json()
    setSelectedFileContent(result.content)

  }, [selectedFile]) 

  useEffect(() => {
    if (selectedFile && selectedFileContent) {
      setCode(selectedFileContent)
    }
  }, [selectedFile, selectedFileContent])

  useEffect(() => {
    if(selectedFile) getFileContent()
  }, [])

  useEffect(() => {
    getFileTree()
  }, [])

  useEffect(() => {
    socket.on('file:refresh', getFileTree)

    return () => {
      socket.off('file:refresh', getFileTree)
    }
  }, [])

  useEffect(() => {

  }, [selectedFile])

  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        // console.log("Save Code", code)
        socket.emit('file:change', {
          path: selectedFile,
          content: code
        })
      }, 5 * 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [code])

  return (
    <div className='playground-container'>
      <div className='editor-container'>
        <div className="files">
          <FileTree
            tree={fileTree}
            onSelect={(path) => setSelectedFile(path)}
          />
        </div>
        <div className="editor">
          {selectedFile && <p>{selectedFile.replaceAll('/', ' > ')}</p>}
          <AceEditor
            value={code}
            onChange={(e) => setCode(e)}
          />
        </div>
      </div>
      <div className='terminal-container'>
        <Terminal />
      </div>
    </div>
  )
}

export default App