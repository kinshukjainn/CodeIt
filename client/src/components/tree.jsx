import React, { useState, useCallback, memo } from "react";
import "./FileTree.css";

// Memoized component to prevent unnecessary re-renders
const FileTreeNode = memo(({ fileName, nodes, onSelect, path }) => {
    const isDir = !!nodes; // True if it has children (folder), false if it's a file
    const [expanded, setExpanded] = useState(false); // Control folder expansion

    const handleClick = useCallback((e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (isDir) {
            setExpanded((prev) => !prev); // Toggle expansion
        }
        onSelect(path);
    }, [isDir, path, onSelect]);

    return (
        <div className="tree-node" onClick={handleClick} style={{ marginLeft: "10px" }}>
            <p className={isDir ? "folder-node" : "file-node"}>
                {isDir ? (expanded ? "📂" : "📁") : "📄"} {fileName}
            </p>
            {isDir && expanded && fileName !== "node_modules" && (
                <ul>
                    {Object.keys(nodes).map((child) => (
                        <li key={child}>
                            <FileTreeNode 
                                fileName={child} 
                                nodes={nodes[child]} 
                                onSelect={onSelect} 
                                path={`${path}/${child}`} 
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

const FileTree = memo(({ tree, onSelect }) => {
    return (
        <FileTreeNode 
            fileName="/" 
            nodes={tree} 
            path="" 
            onSelect={onSelect} 
        />
    );
});

export default FileTree;
