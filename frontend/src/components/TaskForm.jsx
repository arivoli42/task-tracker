import React, { useState } from 'react';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ['Study', 'Personal', 'Work', 'Health'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Personal');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [reminder, setReminder] = useState('');
    const [expanded, setExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({
            title: title.trim(),
            description: description.trim(),
            status: 'pending',
            category,
            priority,
            dueDate: dueDate || null,
            reminder: reminder || null,
        });
        setTitle('');
        setDescription('');
        setCategory('Personal');
        setPriority('Medium');
        setDueDate('');
        setReminder('');
        setExpanded(false);
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '700' }}>➕ Add New Task</h2>
                <button
                    type="button"
                    onClick={() => setExpanded(v => !v)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded ? 'Less' : 'More options'}
                </button>
            </div>

            {/* Row 1: Title */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: 0 }}>
                <div style={{ flex: '1 1 220px' }}>
                    <label className="input-label">Task Title *</label>
                    <input
                        id="task-title-input"
                        type="text"
                        placeholder="What do you need to do?"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div style={{ flex: '1 1 160px' }}>
                    <label className="input-label">Category</label>
                    <select id="task-category-select" value={category} onChange={e => setCategory(e.target.value)} className="input-field">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ flex: '1 1 130px' }}>
                    <label className="input-label">Priority</label>
                    <select id="task-priority-select" value={priority} onChange={e => setPriority(e.target.value)} className="input-field">
                        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* Expanded section */}
            {expanded && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 220px' }}>
                        <label className="input-label">Description</label>
                        <input
                            id="task-desc-input"
                            type="text"
                            placeholder="Optional description..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div style={{ flex: '1 1 160px' }}>
                        <label className="input-label">Due Date</label>
                        <input
                            id="task-due-date"
                            type="datetime-local"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div style={{ flex: '1 1 160px' }}>
                        <label className="input-label">Reminder</label>
                        <input
                            id="task-reminder"
                            type="datetime-local"
                            value={reminder}
                            onChange={e => setReminder(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </div>
            )}

            <button
                id="add-task-btn"
                type="submit"
                className="btn-primary"
                style={{ marginTop: '0.25rem', padding: '0.65rem 1.75rem' }}
            >
                <PlusCircle size={16} />
                Add Task
            </button>
        </form>
    );
}
