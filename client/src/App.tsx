import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return <h1>{message || 'Loading...'}</h1>;
}

export default App;