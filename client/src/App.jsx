import React, { useCallback, useEffect, useState } from 'react';
import Terminal from './components/terminal';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import "./App.css";
import FileTree from './components/tree';
import socket from './socket';

const App = () => {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [code, setCode] = useState('');
  const [isSaved, setIsSaved] = useState(true); // Track saved status

  const getFileTree = async () => {
    const response = await fetch('http://localhost:3001/files');
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContent = useCallback(async () => {
    if (!selectedFile) return;

    const response = await fetch(`http://localhost:3001/files/content?path=${selectedFile}`);
    const result = await response.json();
    setSelectedFileContent(result.content);
    setCode(result.content); // Update the code state with the fetched content
    setIsSaved(true); // Mark as saved after fetching new content
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContent();
  }, [getFileContent, selectedFile]);

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on('file:refresh', getFileTree);
    socket.on('file:saved', () => {
      setIsSaved(true); // Update isSaved state on confirmation
    });

    return () => {
      socket.off('file:refresh', getFileTree);
      socket.off('file:saved');
    };
  }, []);

  // Update isSaved whenever selectedFileContent or code changes
  useEffect(() => {
    setIsSaved(selectedFileContent === code);
  }, [selectedFileContent, code]);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit('file:change', {
          path: selectedFile,
          content: code
        });
      }, 5 * 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

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
          {
            selectedFile
            &&
            <p className="file-status">
                <span className="folder-path">{selectedFile.split('/').map((part, index) => 
                  <React.Fragment key={index}>
                    {part}
                    {index < selectedFile.split('/').length - 1 && <span className="folder-separator">&gt;</span>}
                  </React.Fragment>
                )}</span>
                <span className={`status ${isSaved ? 'saved' : 'unsaved'}`}>{isSaved ? 'Saved' : 'Unsaved'}</span>
            </p>
          }
          <AceEditor
            value={code}
            onChange={(newValue) => setCode(newValue)}
            mode="javascript"
            theme="github"
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
      <div className='terminal-container'>
        <Terminal />
      </div>
    </div>
  );
};

export default App;
