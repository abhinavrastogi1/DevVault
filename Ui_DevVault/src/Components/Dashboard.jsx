import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom' // replace next/navigation with react-router-dom
import Sidebar from './Sidebar.jsx'
import SnippetEditor from './SnippetEditor.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSnippets } from '../Store/SnippetSlices/snippetslice.js'

export default function Dashboard() {
    const navigate = useNavigate() // useNavigate for routing in React
    const [snippets, setSnippets] = useState([])
    const [currentSnippet, setCurrentSnippet] = useState(null)
    const{isAuthenticated,isLoading}= useSelector((state) => state.authenticationSlice)
    const dispatch = useDispatch();
    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated && !isLoading) {
            navigate('/') // Redirect to home if not authenticated
        }
    }, [isAuthenticated, isLoading, navigate, dispatch])
    // Load snippets from localStorage on initial render
    useEffect(() => {
        dispatch(getAllSnippets())
    },[])

    useEffect(() => {
        const savedSnippets = localStorage.getItem('snippets')
        if (savedSnippets) {
            const parsedSnippets = JSON.parse(savedSnippets)
            setSnippets(parsedSnippets)

            // Set the first snippet as current if available
            if (parsedSnippets.length > 0) {
                setCurrentSnippet(parsedSnippets[0])
            }
        } else {
            // Create a default snippet if none exist
            const defaultSnippet = {
                id: '1',
                title: 'Welcome to DevVault',
                createdAt: new Date().toISOString(),
                tasks: [
                    {
                        id: '1',
                        text: 'Create your first snippet',
                        completed: false,
                    },
                    { id: '2', text: 'Add some tasks', completed: false },
                    {
                        id: '3',
                        text: 'Write code in the editor',
                        completed: false,
                    },
                ],
                code: `import { Request, Response } from 'express';

const userLoginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Simulate user validation (replace with actual database lookups)
  const user = await mockUserAuthentication(username, password);

  if (user) {
    // Create session or JWT token here
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

const mockUserAuthentication = async (username: string, password: string) => {
  // This function simulates user authentication. Replace with actual logic.
  return username === 'testUser' && password === 'testPass'
    ? { id: 1, username: 'testUser' }
    : null;
};

export default userLoginController;`,
                notes: 'Welcome to DevVault! This is your first snippet. You can add notes here to keep track of your thoughts and ideas.',
                language: 'javascript',
            }

            setSnippets([defaultSnippet])
            setCurrentSnippet(defaultSnippet)
            localStorage.setItem('snippets', JSON.stringify([defaultSnippet]))
        }
    }, [])

    const handleSnippetSelect = (snippet) => {
        setCurrentSnippet(snippet)
    }

    const handleSnippetCreate = () => {
        const newSnippet = {
            id: Date.now().toString(),
            title: 'New Snippet',
            createdAt: new Date().toISOString(),
            tasks: [],
            code: '// Start coding here',
            notes: '',
            language: 'javascript',
        }
        const updatedSnippets = [...snippets, newSnippet]
        setSnippets(updatedSnippets)
        setCurrentSnippet(newSnippet)
        localStorage.setItem('snippets', JSON.stringify(updatedSnippets))
    }

    const handleSnippetUpdate = (updatedSnippet) => {
        const updatedSnippets = snippets.map((s) =>
            s.id === updatedSnippet.id ? updatedSnippet : s
        )

        setSnippets(updatedSnippets)
        setCurrentSnippet(updatedSnippet)
        localStorage.setItem('snippets', JSON.stringify(updatedSnippets))
    }

    const handleLogout = () => {
        // For React, navigate to the home route
        navigate('/') // this replaces `router.push("/")`
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar
                snippets={snippets}
                onSnippetSelect={handleSnippetSelect}
                onSnippetCreate={handleSnippetCreate}
                onLogout={handleLogout}
                currentSnippetId={currentSnippet?.id}
            />

            <main className="flex-1 overflow-hidden">
                {currentSnippet ? (
                    <SnippetEditor
                        snippet={currentSnippet}
                        onUpdate={handleSnippetUpdate}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                No Snippet Selected
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Create a new snippet or select one from the
                                sidebar
                            </p>
                            <button
                                onClick={handleSnippetCreate}
                                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Create New Snippet
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
