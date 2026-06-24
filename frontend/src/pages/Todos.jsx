import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadTodos = async () => {
            try {
                const response = await fetch(`${API_URL}/api/todos`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch todos');
                }

                if (isMounted) {
                    setTodos(data);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadTodos();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });
            const newTodo = await response.json();

            if (!response.ok) {
                throw new Error(newTodo.message || 'Failed to add todo');
            }

            setTodos((currentTodos) => [newTodo, ...currentTodos]);
            setTitle('');
            setDescription('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleTodo = async (todo) => {
        try {
            const response = await fetch(`${API_URL}/api/todos/${todo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !todo.completed }),
            });
            const updatedTodo = await response.json();

            if (!response.ok) {
                throw new Error(updatedTodo.message || 'Failed to update todo');
            }

            setTodos((currentTodos) =>
                currentTodos.map((item) => (item._id === updatedTodo._id ? updatedTodo : item)),
            );
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/todos/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete todo');
            }

            setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== id));
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="todos-page">
            <section className="todos-header">
                <div>
                    <p className="eyebrow">Ziptrrip Todo App</p>
                    <h1>Todo List</h1>
                </div>
                <a href="/" className="home-link">
                    Home
                </a>
            </section>

            <section className="todo-panel">
                <form className="todo-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Add a task"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">Description</label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Optional details"
                        />
                    </div>

                    <button type="submit">Add Todo</button>
                </form>

                {error && <p className="message error-message">{error}</p>}
            </section>

            <section className="todo-list" aria-live="polite">
                {loading && <p className="message">Loading todos...</p>}

                {!loading && todos.length === 0 && (
                    <p className="message">No todos yet. Add your first task above.</p>
                )}

                {!loading &&
                    todos.map((todo) => (
                        <article
                            className={`todo-card ${todo.completed ? 'completed' : ''}`}
                            key={todo._id}
                        >
                            <div className="todo-main">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo)}
                                    aria-label={`Mark ${todo.title} as ${
                                        todo.completed ? 'incomplete' : 'completed'
                                    }`}
                                />
                                <div>
                                    <h2>{todo.title}</h2>
                                    {todo.description && <p>{todo.description}</p>}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={() => deleteTodo(todo._id)}
                            >
                                Delete
                            </button>
                        </article>
                    ))}
            </section>
        </main>
    );
}

export default Todos;
