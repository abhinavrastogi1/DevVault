import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Editor from '@monaco-editor/react';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return <>
  <div className='bg-neutral-700'>
  <Editor height="20vh" defaultLanguage="javascript" defaultValue="enter your code" className=' border-2 border-black '  theme='vs-dark'/>;
  </div>
  </>

}

export default App
