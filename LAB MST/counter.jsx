import { useState } from 'react'
import React from 'react' 

function Counter() {
  const [count, setCount] = useState(0);

  const maxLimit = 10;

  const increment = () => {
    if (count < maxLimit) {
      setCount(count + 1);
    }
  }

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  const reset = () => {
    setCount(0);
  }

  const buttonClasses = (color) => `
    px-6 py-3 m-2 font-bold text-white rounded-xl shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
    ${color}
  `;

  return (
    <div className="p-8 bg-white shadow-2xl rounded-3xl w-full max-w-md mx-auto my-8 text-center border-t-4 border-blue-500">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
        Counter: <span className={count === maxLimit ? "text-red-600" : "text-blue-600"}>{count}</span>
      </h1>
      
      <div className="flex justify-center flex-wrap gap-4">
        <button 
          onClick={increment}
          disabled={count >= maxLimit}
          className={buttonClasses("bg-green-500 hover:bg-green-600")}
        >
          Increment
        </button>
        <button 
          onClick={decrement}
          disabled={count <= 0}
          className={buttonClasses("bg-yellow-500 hover:bg-yellow-600")}
        >
          Decrement
        </button>
        <button 
          onClick={reset}
          className={buttonClasses("bg-red-500 hover:bg-red-600")}
        >
          Reset
        </button>
      </div>

      {count > 10 && (
        <p className="mt-4 text-red-500 font-medium animate-pulse">
          Maximum limit reached
        </p>
      )}
    </div>
  )
}

export default Counter;
