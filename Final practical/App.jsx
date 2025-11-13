import React from 'react';

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

const App = () => {
  const handleClick = (fruit) => {
    alert(`You clicked on: ${fruit}`);
  };

  return (
    <div>
      <h1>Fruit List</h1>
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index} onClick={() => handleClick(fruit)} style={{ cursor: 'pointer' }}>
            {fruit}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;