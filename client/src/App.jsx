import React, { useEffect, useState } from 'react'
import Terminal from './components/terminal'

import "./App.css"
import FileTree from './components/tree'

const App = () => {

  const [fileTree, setFileTree] = useState({})

  const getFileTree = async () => {
    const response = await fetch('http://localhost:3001/files')
    const result = await response.json()
    // return res.json({tree: fileTree}) in server/index.js
    setFileTree(result.tree)
  }

  useEffect(() => {
    getFileTree()
  }, [])

  return (
    <div className='playground-container'>
      <div className='editor-container'>
        <div className="files">
          <FileTree tree={fileTree} />
        </div>
        <div className="editor">
          
        </div>
      </div>
      <div className='terminal-container'>
        <Terminal />
      </div>
    </div>
  )
}

export default App