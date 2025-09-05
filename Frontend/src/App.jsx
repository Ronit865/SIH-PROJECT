import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='bg-orange-600 text-white text-center text-6xl m-2 p-2'>This is the start of project.</h1>
    </>
  )
}

export default App
