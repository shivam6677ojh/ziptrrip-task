import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function TodoDetails() {
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const todoId = new URLSearchParams(window.location.search).get('id');

    useEffect(() => {
        let isMounted = true;

        const loadTodo = async () => {
            if (!todoId) {
                if (isMounted) {
                    setError('Todo id is missing');
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/todos/${todoId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch todo');
                }

                if (isMounted) {
                    setTodo(data);
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

        loadTodo();

        return () => {
            isMounted = false;
        };
    }, [todoId]);

    const formattedDate = todo
        ? new Date(todo.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : '';

    return (
        <main className="todos-page">
            <section className="todos-header">
                <div>
                    <p className="eyebrow">Todo Details</p>
                    <h1>Task Information</h1>
                </div>
                <a href="/todos" className="home-link" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </a>
            </section>

            {loading && (
                <section className="details-card">
                    <div>
                        <span className="details-label">Title</span>
                        <div className="skeleton-details-title skeleton-shimmer" style={{ marginTop: '8px' }}></div>
                    </div>

                    <div>
                        <span className="details-label">Description</span>
                        <div className="skeleton-details-desc skeleton-shimmer" style={{ marginTop: '8px' }}></div>
                    </div>

                    <div className="details-grid">
                        <div>
                            <span className="details-label">Completed Status</span>
                            <div className="skeleton-details-grid-item skeleton-shimmer" style={{ marginTop: '8px' }}></div>
                        </div>

                        <div>
                            <span className="details-label">Created Date</span>
                            <div className="skeleton-details-grid-item skeleton-shimmer" style={{ marginTop: '8px' }}></div>
                        </div>
                    </div>
                </section>
            )}

            {!loading && error && <p className="message error-message">{error}</p>}

            {!loading && todo && (
                <section className="details-card">
                    <div>
                        <span className="details-label">Title</span>
                        <h2>{todo.title}</h2>
                    </div>

                    <div>
                        <span className="details-label">Description</span>
                        <p>{todo.description || 'No description added.'}</p>
                    </div>

                    <div className="details-grid">
                        <div>
                            <span className="details-label">Completed Status</span>
                            <div>
                                <span className={`status-badge ${todo.completed ? 'completed-badge' : 'pending-badge'}`}>
                                    {todo.completed ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="details-label">Created Date</span>
                            <p>{formattedDate}</p>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

export default TodoDetails;
