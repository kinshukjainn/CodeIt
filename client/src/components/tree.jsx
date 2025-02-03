const FileTreeNode = ({ fileName, nodes }) => {

    const isDir = !nodes

    return (
        <div style={{marginLeft: '10px'}}>
            <p className={isDir ? "folder-node": "file-node"}>
            {fileName}
            </p>
            {
                nodes
                &&
                <ul>
                        
                        {/* Iterates over the keys of the nodes object. Each key represents a child node */}

                        {Object.keys(nodes).map((child) => (
                            <li key={child}>

                                {/* FileTreeNode component is recursively rendered with the fileName set to the child node's name and nodes set to the child node's children */}

                                <FileTreeNode
                                    fileName={child}
                                    nodes={nodes[child]}
                                />

                            </li>
                    ))}
                </ul>
            }
        </div>
    )
}

const FileTree = ({ tree }) => {
    return (
        <FileTreeNode
            fileName="/"
            nodes={tree}
        />
    )
}

export default FileTree