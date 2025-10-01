import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Form from './Form'
import Counter from './counter.jsx'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Counter /> 
     <Form/>
    </>
  )
}

export default App;