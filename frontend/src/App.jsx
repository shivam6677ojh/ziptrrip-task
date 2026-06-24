import './App.css';
import TodoDetails from './pages/TodoDetails.jsx';
import Todos from './pages/Todos.jsx';

function App() {
    const isTodosPage = window.location.pathname === '/todos';
    const isTodoDetailsPage = window.location.pathname === '/todo';

    if (isTodosPage) {
        return <Todos />;
    }

    if (isTodoDetailsPage) {
        return <TodoDetails />;
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
