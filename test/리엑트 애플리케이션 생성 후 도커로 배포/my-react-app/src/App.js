import React, { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/user')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>유저 정보</h1>
        {user ? (
          <p>이름: {user.name}, 이메일: {user.email}</p>
        ) : (
          <p>유저 정보를 불러오는 중...</p>
        )}
      </header>
    </div>
  );
}

export default App;
