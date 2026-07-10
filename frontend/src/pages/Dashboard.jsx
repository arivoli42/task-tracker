import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import ProgressChart from '../components/ProgressChart';
import ReminderNotifier from '../components/ReminderNotifier';
import { ListTodo, CheckCircle, BarChart2, Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Study', 'Personal', 'Work', 'Health'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    // View tabs: active | history | chart
    const [tab, setTab] = useState('active');
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/api/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            const res = await api.post('/api/tasks', taskData);
            setTasks(prev => [res.data, ...prev]);
        } catch (err) { console.error('Failed to add task', err); }
    };

    const handleDeleteTask = async (id) => {
        try {
            await api.delete(`/api/tasks/${id}`);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) { console.error('Failed to delete task', err); }
    };

    const handleUpdateTask = async (id, updatedTask) => {
        try {
            const res = await api.put(`/api/tasks/${id}`, updatedTask);
            setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
        } catch (err) { console.error('Failed to update task', err); }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '6rem' }}>
                <div style={{
                    width: '40px', height: '40px', border: '3px solid var(--border-color)',
                    borderTop: '3px solid var(--primary-color)',
                    borderRadius: '50%', animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                }} />
                <p style={{ color: 'var(--text-muted)' }}>Loading your tasks…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
            </div>
        );
    }

    // Stats
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Filter active tasks
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const historyTasks = tasks.filter(t => t.status === 'completed');

    const applyFilters = (list) => list.filter(t => {
        const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.description || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCategory === 'All' || t.category === filterCategory;
        const matchPri = filterPriority === 'All' || t.priority === filterPriority;
        return matchSearch && matchCat && matchPri;
    });

    const displayActive = applyFilters(activeTasks);
    const displayHistory = applyFilters(historyTasks);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <ReminderNotifier tasks={tasks} />

            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Your Tasks
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                        {total} total · {completed} completed · {pct}% done
                    </p>
                </div>
                {/* Overall progress mini-bar */}
                <div style={{ minWidth: '160px', flex: '1 1 160px', maxWidth: '260px' }}>
                    <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total', value: total, color: 'var(--primary-color)' },
                    { label: 'Pending', value: pending, color: 'var(--warning)' },
                    { label: 'In Progress', value: inProgress, color: 'var(--primary-color)' },
                    { label: 'Completed', value: completed, color: 'var(--success)' },
                ].map(s => (
                    <div key={s.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: s.color }}>{s.value}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tab bar */}
            <div className="tab-bar" style={{ marginBottom: '1.25rem' }}>
                <button id="tab-active" className={`tab-btn ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
                    <ListTodo size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    Active ({activeTasks.length})
                </button>
                <button id="tab-history" className={`tab-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
                    <CheckCircle size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    History ({historyTasks.length})
                </button>
                <button id="tab-chart" className={`tab-btn ${tab === 'chart' ? 'active' : ''}`} onClick={() => setTab('chart')}>
                    <BarChart2 size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                    Dashboard
                </button>
            </div>

            {/* Search & Filters (shown on active/history tabs) */}
            {tab !== 'chart' && (
                <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 200px', position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            id="task-search"
                            type="text"
                            placeholder="Search tasks…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field"
                            style={{ marginBottom: 0, paddingLeft: '2.2rem', fontSize: '0.875rem' }}
                        />
                    </div>
                    <button id="filter-toggle-btn" className="btn-secondary" onClick={() => setShowFilters(v => !v)} style={{ whiteSpace: 'nowrap' }}>
                        <SlidersHorizontal size={14} /> Filters
                    </button>
                    {showFilters && (
                        <>
                            <select id="filter-category" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field" style={{ marginBottom: 0, width: 'auto', fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <select id="filter-priority" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field" style={{ marginBottom: 0, width: 'auto', fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}>
                                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </>
                    )}
                </div>
            )}

            {/* ── Active Tab ── */}
            {tab === 'active' && (
                <>
                    <TaskForm onAdd={handleAddTask} />
                    {displayActive.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {activeTasks.length === 0
                                    ? '🎉 No active tasks! Add one above.'
                                    : 'No tasks match your filter.'}
                            </p>
                        </div>
                    ) : (
                        displayActive.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleUpdateTask}
                                onEdit={handleUpdateTask}
                            />
                        ))
                    )}
                </>
            )}

            {/* ── History Tab ── */}
            {tab === 'history' && (
                <>
                    <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem' }}>
                        <p style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: '500' }}>
                            ✅ {historyTasks.length} task{historyTasks.length !== 1 ? 's' : ''} completed
                        </p>
                    </div>
                    {displayHistory.length === 0 ? (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {historyTasks.length === 0 ? 'No completed tasks yet.' : 'No tasks match your filter.'}
                            </p>
                        </div>
                    ) : (
                        displayHistory.map(task => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleUpdateTask}
                                onEdit={handleUpdateTask}
                            />
                        ))
                    )}
                </>
            )}

            {/* ── Chart Tab ── */}
            {tab === 'chart' && (
                <ProgressChart tasks={tasks} />
            )}
        </div>
    );
}
