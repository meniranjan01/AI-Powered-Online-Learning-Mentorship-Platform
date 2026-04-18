import React from 'react';
import './App.css';
import UserList from './UserList';
import CourseList from './CourseList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Learning Platform</h1>
        <p>Welcome to the future of education</p>
      </header>
      <main>
        <section>
          <h2>Features</h2>
          <ul>
            <li>AI-driven course recommendations</li>
            <li>Mentorship matching</li>
            <li>Progress tracking</li>
            <li>Collaborative learning</li>
          </ul>
        </section>
        <section>
          <UserList />
        </section>
        <section>
          <CourseList />
        </section>
      </main>
    </div>
  );
}

export default App;