import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom' // replace next/navigation with react-router-dom
import Sidebar from './Sidebar.jsx'
import SnippetEditor from './SnippetEditor.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSnippets } from '../Store/SnippetSlices/snippetslice.js'
import { set } from 'date-fns'

export default function Dashboard() {
    const navigate = useNavigate() // useNavigate for routing in React
    const [currentSnippet, setCurrentSnippet] = useState({
        id: '',
        title: 'Welcome to DevVault',
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
        code:  "// Start coding here",
        notes: ' // Add your notes here',
         language: 'javascript',
    })
    const{isAuthenticated,isLoading}= useSelector((state) => state.authenticationSlice)
    const{snippetData}= useSelector((state) => state.snippetSlice) 
    useEffect(() => {
        if(snippetData && snippetData?.snippet?.snippet_id){
        setCurrentSnippet({
            id: snippetData.snippet.snippet_id,
            title: snippetData.snippet.snippet_title || 'Untitled Snippet',
            tasks:[],
            code: snippetData.snippet.snippet_code  || "// Start coding here",
            notes: snippetData.notes[0].note_description || ' // Add your notes here',
            language:snippetData.snippet.language || 'typescript',
        })
    }
    }, [snippetData])

    console.log(snippetData)
    const dispatch = useDispatch();
    const{notes}=snippetData
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
    const handleSnippetCreate = () => {
        const newSnippet ={
            id: '',
            title: 'Welcome to DevVault',
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
            code:  "// Start coding here",
            notes: ' // Add your notes here',
             language: 'javascript',
        }
        setCurrentSnippet(newSnippet)
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar
                onSnippetCreate={handleSnippetCreate}
                currentSnippetId={currentSnippet?.id}
            />
            <main className="flex-1 overflow-hidden">
                {currentSnippet ? (
                    <SnippetEditor
                        snippet={currentSnippet}
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
