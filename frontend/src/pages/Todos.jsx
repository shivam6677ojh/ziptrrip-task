import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCompleted, setEditCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [busyTodoId, setBusyTodoId] = useState(null);
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

    const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );

    const isAnyApiPending = isCreating || busyTodoId !== null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            setIsCreating(true);
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
        } finally {
            setIsCreating(false);
        }
    };

    const toggleTodo = async (todo) => {
        try {
            setBusyTodoId(todo._id);
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
        } finally {
            setBusyTodoId(null);
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
        setEditCompleted(todo.completed);
        setError('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
        setEditCompleted(false);
    };

    const updateTodo = async (event) => {
        event.preventDefault();

        if (!editTitle.trim()) {
            setError('Title is required');
            return;
        }

        try {
            setBusyTodoId(editingId);
            const response = await fetch(`${API_URL}/api/todos/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    completed: editCompleted,
                }),
            });
            const updatedTodo = await response.json();

            if (!response.ok) {
                throw new Error(updatedTodo.message || 'Failed to update todo');
            }

            setTodos((currentTodos) =>
                currentTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)),
            );
            cancelEdit();
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setBusyTodoId(null);
        }
    };

    const deleteTodo = async (id) => {
        try {
            setBusyTodoId(id);
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
        } finally {
            setBusyTodoId(null);
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
                            disabled={isAnyApiPending}
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
                            disabled={isAnyApiPending}
                        />
                    </div>

                    <button type="submit" disabled={isAnyApiPending}>
                        {isCreating ? (
                            <>
                                <span className="spinner"></span>
                                Adding...
                            </>
                        ) : (
                            'Add Todo'
                        )}
                    </button>
                </form>

                {error && <p className="message error-message">{error}</p>}
            </section>

            <section className="search-panel">
                <div className="form-field">
                    <label htmlFor="search">Search by title</label>
                    <div className="search-field-container">
                        <span className="search-icon-svg">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>
                        <input
                            id="search"
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search todos..."
                            disabled={loading}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => setSearchTerm('')}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px',
                                }}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="todo-list" aria-live="polite">
                {loading && (
                    <div className="todo-list">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="skeleton-card">
                                <div className="todo-main" style={{ width: '100%' }}>
                                    <div className="skeleton-checkbox skeleton-shimmer"></div>
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton-title skeleton-shimmer"></div>
                                        <div className="skeleton-desc skeleton-shimmer"></div>
                                    </div>
                                </div>
                                <div className="todo-actions">
                                    <div className="skeleton-btn skeleton-shimmer"></div>
                                    <div className="skeleton-btn skeleton-shimmer"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && todos.length === 0 && (
                    <div className="message empty-message">
                        <div className="empty-message-icon">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <h3>No tasks found</h3>
                        <p>Your task list is empty. Add your first todo above to get started!</p>
                    </div>
                )}

                {!loading && todos.length > 0 && filteredTodos.length === 0 && (
                    <div className="message empty-message">
                        <div className="empty-message-icon">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        </div>
                        <h3>No matching tasks</h3>
                        <p>We couldn't find any todo matching "{searchTerm}". Try another search term.</p>
                    </div>
                )}

                {!loading &&
                    filteredTodos.map((todo) => {
                        const isEditing = editingId === todo._id;
                        const isThisTodoBusy = busyTodoId === todo._id;

                        return (
                            <article
                                className={`todo-card ${todo.completed ? 'completed' : ''} ${
                                    isThisTodoBusy ? 'todo-card-busy' : ''
                                }`}
                                key={todo._id}
                            >
                                {isEditing ? (
                                    <form className="edit-form" onSubmit={updateTodo}>
                                        <div className="form-field">
                                            <label htmlFor={`edit-title-${todo._id}`}>Title</label>
                                            <input
                                                id={`edit-title-${todo._id}`}
                                                type="text"
                                                value={editTitle}
                                                onChange={(event) => setEditTitle(event.target.value)}
                                                disabled={isAnyApiPending}
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor={`edit-description-${todo._id}`}>
                                                Description
                                            </label>
                                            <input
                                                id={`edit-description-${todo._id}`}
                                                type="text"
                                                value={editDescription}
                                                onChange={(event) =>
                                                    setEditDescription(event.target.value)
                                                }
                                                disabled={isAnyApiPending}
                                            />
                                        </div>

                                        <label className="status-field">
                                            <input
                                                type="checkbox"
                                                checked={editCompleted}
                                                onChange={(event) =>
                                                    setEditCompleted(event.target.checked)
                                                }
                                                disabled={isAnyApiPending}
                                            />
                                            Completed
                                        </label>

                                        <div className="todo-actions">
                                            <button
                                                type="submit"
                                                className="save-button"
                                                disabled={isAnyApiPending}
                                            >
                                                {isThisTodoBusy ? (
                                                    <>
                                                        <span className="spinner"></span>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={cancelEdit}
                                                disabled={isAnyApiPending}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="todo-main">
                                            <button
                                                type="button"
                                                className={`custom-checkbox ${
                                                    todo.completed ? 'checked' : ''
                                                } ${isAnyApiPending ? 'disabled' : ''}`}
                                                onClick={() => !isAnyApiPending && toggleTodo(todo)}
                                                disabled={isAnyApiPending}
                                                aria-label={`Mark ${todo.title} as ${
                                                    todo.completed ? 'incomplete' : 'completed'
                                                }`}
                                            >
                                                <svg viewBox="0 0 24 24">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </button>
                                            <div>
                                                <h2>
                                                    <a href={`/todo?id=${todo._id}`}>{todo.title}</a>
                                                </h2>
                                                {todo.description && <p>{todo.description}</p>}
                                            </div>
                                        </div>

                                        <div className="todo-actions">
                                            <button
                                                type="button"
                                                className="edit-button"
                                                onClick={() => startEdit(todo)}
                                                disabled={isAnyApiPending || editingId !== null}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => deleteTodo(todo._id)}
                                                disabled={isAnyApiPending}
                                            >
                                                {isThisTodoBusy ? (
                                                    <>
                                                        <span className="spinner"></span>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </article>
                        );
                    })}
            </section>
        </main>
    );
}

export default Todos;
