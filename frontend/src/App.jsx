import './App.css';
import Todos from './pages/Todos.jsx';

function App() {
    const isTodosPage = window.location.pathname === '/todos';

    if (isTodosPage) {
        return <Todos />;
    }

    return (
        <main className="home-page">
            <section className="home-content">
                <p className="eyebrow">Ziptrrip Todo App</p>
                <h1>Manage your daily tasks</h1>
                <p>
                    A simple React, Express, and MongoDB todo application built phase by phase.
                </p>
                <a href="/todos" className="primary-link">
                    Open Todo List
                </a>
            </section>
        </main>
    );
}

export default App;
