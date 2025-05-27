import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom' // replace next/navigation with react-router-dom
import Sidebar from './Sidebar.jsx'
import SnippetEditor from './SnippetEditor.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getAllSnippets } from '../Store/SnippetSlices/snippetslice.js'
import DeleteSnippet from "./Ui/DeleteSnippet.jsx"


export default function Dashboard() {
    const navigate = useNavigate() // useNavigate for routing in React
    const [currentSnippet, setCurrentSnippet] = useState({
        id: '',
        title: 'Welcome to DevVault',
        tasks: [
            {
                id: "1",
                text: 'Create your first snippet',
                completed: false,
            },
            { id: "2", text: 'Add some tasks', completed: false },
            {
                id: "3",
                text: 'Write code in the editor',
                completed: false,
            },
        ],
        code:  "// Start coding here",
        notes: ' // Add your notes here',
         language: 'javascript',
        questions: [],
    })
    const [width, setWidth] = useState(window.innerWidth);
    const[isSmallScreen,setIsSmallScreeen]=useState(false);
    const [showSideBar,setShowSideBar]=useState(false)
    const{isAuthenticated,isLoading}= useSelector((state) => state.authenticationSlice)
    const{snippetData}= useSelector((state) => state.snippetSlice) 
    const{isVerifyingUser}=useSelector(state=>state.authenticationSlice)
    useEffect(() => {
        const snippetTasks=[]
        if(snippetData && snippetData?.snippet?.snippet_id){
         if(snippetData.tasks && snippetData.tasks.length > 0){
            snippetData.tasks.forEach((task) => {
                snippetTasks.push({
                    id: task.task_id,
                    text: task.task_description,                    
                    completed: task.is_completed,
                })
            })
        }
        setCurrentSnippet({
            id: snippetData.snippet.snippet_id,
            title: snippetData.snippet.snippet_title || 'Untitled Snippet',
            tasks:snippetTasks,
            code: snippetData.snippet.snippet_code  || "// Start coding here",
            notes: snippetData.notes[0].note_description || ' // Add your notes here',
            language:snippetData.snippet.language || 'typescript',
            questions: snippetData.userQuestion || [],
        })
    }
    }, [snippetData])

    const dispatch = useDispatch();
    const{notes}=snippetData
    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated && !isLoading && !isVerifyingUser) {
            navigate('/') // Redirect to home if not authenticated
        }
    }, [isAuthenticated, isLoading, navigate, dispatch,isVerifyingUser])
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
                    id: "1",
                    text: 'Create your first snippet',
                    completed: false,
                },
                { id: "2", text: 'Add some tasks', completed: false },
                {
                    id: "3",
                    text: 'Write code in the editor',
                    completed: false,
                },
            ],
            code:  "// Start coding here",
            notes: ' // Add your notes here',
            language: 'javascript',
            questions: [],
        }
        setCurrentSnippet(newSnippet)
    }


    useEffect(() => {
        const handleResize = () => {
          setWidth(window.innerWidth);
        }
    
        window.addEventListener("resize", handleResize);
             
        // Cleanup on unmount
        return () => window.removeEventListener("resize", handleResize);
      }, []);
      useEffect(()=>{
        if(width <=1024){
          setIsSmallScreeen(true)  
          }
       else if(width> 1025){
        setIsSmallScreeen(false)
      }
      },[width])
    return (
        <div className="flex h-screen bg-black text-white relative">
          {/* <DeleteSnippet/> */}
            <Sidebar
                onSnippetCreate={handleSnippetCreate}
                currentSnippetId={currentSnippet?.id}
                showSideBar={showSideBar}
                setShowSideBar={setShowSideBar}
                isSmallScreen={isSmallScreen}

            />
            <main className="flex-1 overflow-hidden">
                {currentSnippet ? (
                    <SnippetEditor
                        snippet={currentSnippet}
                        note_id={snippetData.notes[0]?.note_id || ''}
                        isSmallScreen={isSmallScreen}
                        showSideBar={showSideBar}
                        setShowSideBar={setShowSideBar}
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
