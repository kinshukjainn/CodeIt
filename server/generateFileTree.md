### That's why folks DSA is important
If you were wondering how the generateFileTree is working (as if someone would ever read this except me)
<br/>
Here is the explaination for the code :- 

    function generateFileTree(directory) {
        const tree = {}

        async function buildTree(currentDir, currentTree) {

            const files = fs.readdir(currentDir)

            for (const file of files) {
                const filePath = path.join(currentDir, file)

                const stat = await fs.stat(filePath)

                if (stat.isDirectory()) {
                    currentTree[file] = {}
                    buildTree(filePath, currentTree[file])
                } else {
                    currentTree[file] = null
                }
            }
        }

        buildTree(directory, tree)
        return tree
    } 



### I Love You Le-Mistral (What's DeepSeek !?)
### Don't believe me? Look at this [Why Le-mistral is my man](https://chat.mistral.ai/chat/e3d059a6-7eb7-40d6-b212-b1aeb39d76ab)

Purpose

The function `generateFileTree` creates a tree structure that represents the files and directories within a given directory.
How It Works

1. **Initialization**:

    - The function starts by creating an empty object called `tree`. This object will hold the structure of the directory.

2. **Helper Function (`buildTree`)**:
    - Inside `generateFileTree`, there's another function called `buildTree`. This helper function does the actual work of reading the directory and building the tree.
    - `buildTree` takes two arguments:
        - `currentDir`: The current directory being processed.
        - `currentTree`: The current part of the tree being built.

3. **Reading the Directory**:
    - `buildTree` uses `fs.readdir(currentDir)` to get a list of all files and directories inside `currentDir`.

4. **Processing Each Item**:
    - For each item (`file`) in the list:
        - It creates the full path to the item using path.join(currentDir, file).
        - It then checks if the item is a directory or a file using fs.stat(filePath).

5. **Building the Tree**:
    - If the item is a directory:
        - It adds an empty object to currentTree with the directory name as the key.
        - It then calls buildTree again (recursively) to process the contents of this directory.
    - If the item is a file:
        - It adds the file name to currentTree with a value of null.

6. **Starting the Process**:
    - `generateFileTree` calls buildTree with the initial directory and the empty `tree` object.
    - Finally, it returns the tree object, which now contains the structure of the directory.

**Example**
If you have a directory structure like this:

    /myDirectory
        /subDir1
            file1.txt
        /subDir2
            file2.txt
        file3.txt

The `generateFileTree` function will produce an object like this:

    {
        subDir1: {
            file1.txt: null
        },
        subDir2: {
            file2.txt: null
        },
        file3.txt: null
    }

### I Am A Sucker Of Making Notes In Markdown files (welp can't be helped)