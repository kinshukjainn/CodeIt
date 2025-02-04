// TODO: Implement React Folder Tree
// TODO: https://www.npmjs.com/package/react-folder-tree
import './FileTree.css'; 

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {

    const isDir = !nodes

    return (
        <div
            onClick={(e) => {
                // To prevent event bubbling
                e.stopPropagation()
                if (!isDir) {
                    return
                }
                onSelect(path)
            }}
            style={{ marginLeft: '10px' }}
        >
            <p className={isDir ? "folder-node" : "file-node"}>
                {fileName}
            </p>
            {
                nodes 
                &&
                fileName !== "node_modules"
                &&
                <ul>

                    {/* Iterates over the keys of the nodes object. Each key represents a child node */}

                    {Object.keys(nodes).map((child) => (
                        <li key={child}>

                            {/* FileTreeNode component is recursively rendered with the fileName set to the child node's name and nodes set to the child node's children */}

                            <FileTreeNode
                                fileName={child}
                                nodes={nodes[child]}
                                onSelect={onSelect}
                                path={path + "/" + child}
                            />

                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

const FileTree = ({ tree, onSelect }) => {
    return (
        <FileTreeNode
            fileName="/"
            nodes={tree}
            path=""
            onSelect={onSelect}
        />
    )
}

export default FileTree