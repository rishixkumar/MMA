import React, { useState } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';

function App() {
  const [page, setPage] = useState<'login' | 'register'>('login');

  return (
    <>
      {page === 'login' ? (
        <Login onSignupClick={() => setPage('register')} />
      ) : (
        <Register onSigninClick={() => setPage('login')} />
      )}
    </>
  );
}

export default App;
