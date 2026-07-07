import React, { useState } from 'react';
import { Trash2, Edit, Check, X, Calendar, Bell, Tag, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Study', 'Personal', 'Work', 'Health'];
const PRIORITIES = ['Low', 'Medium', 'High'];

function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function isOverdue(dueDate, status) {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
}

export default function TaskItem({ task, onDelete, onStatusChange, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');
    const [editCategory, setEditCategory] = useState(task.category || 'Personal');
    const [editPriority, setEditPriority] = useState(task.priority || 'Medium');
    const [editDueDate, setEditDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 16) : '');
    const [editReminder, setEditReminder] = useState(task.reminder ? task.reminder.slice(0, 16) : '');

    const handleSave = () => {
        if (!editTitle.trim()) return;
        onEdit(task._id, {
            ...task,
            title: editTitle.trim(),
            description: editDescription.trim(),
            category: editCategory,
            priority: editPriority,
            dueDate: editDueDate || null,
            reminder: editReminder || null,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setEditDescription(task.description || '');
        setEditCategory(task.category || 'Personal');
        setEditPriority(task.priority || 'Medium');
        setEditDueDate(task.dueDate ? task.dueDate.slice(0, 16) : '');
        setEditReminder(task.reminder ? task.reminder.slice(0, 16) : '');
        setIsEditing(false);
    };

    const overdue = isOverdue(task.dueDate, task.status);

    const catClass = `badge badge-${(task.category || 'personal').toLowerCase()}`;
    const priClass = `badge badge-${(task.priority || 'medium').toLowerCase()}`;
    const statusClass = `badge badge-${task.status}`;

    return (
        <div
            className="glass-card animate-fade-in"
            style={{
                padding: '1.25rem',
                marginBottom: '0.75rem',
                borderLeft: `3px solid ${
                    task.priority === 'High' ? 'var(--pri-high)' :
                    task.priority === 'Medium' ? 'var(--pri-medium)' : 'var(--pri-low)'
                }`,
                opacity: task.status === 'completed' ? 0.75 : 1,
            }}
        >
            {isEditing ? (
                /* ─── Edit Mode ─── */
                <div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: 0 }}>
                        <div style={{ flex: '2 1 200px' }}>
                            <label className="input-label">Title</label>
                            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input-field" autoFocus />
                        </div>
                        <div style={{ flex: '1 1 130px' }}>
                            <label className="input-label">Category</label>
                            <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="input-field">
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 100px' }}>
                            <label className="input-label">Priority</label>
                            <select value={editPriority} onChange={e => setEditPriority(e.target.value)} className="input-field">
                                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '2 1 200px' }}>
                            <label className="input-label">Description</label>
                            <input type="text" value={editDescription} onChange={e => setEditDescription(e.target.value)} className="input-field" placeholder="Optional..." />
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <label className="input-label">Due Date</label>
                            <input type="datetime-local" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} className="input-field" />
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <label className="input-label">Reminder</label>
                            <input type="datetime-local" value={editReminder} onChange={e => setEditReminder(e.target.value)} className="input-field" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleSave} className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.875rem' }}>
                            <Check size={14} /> Save
                        </button>
                        <button onClick={handleCancel} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            <X size={14} /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                /* ─── View Mode ─── */
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)',
                                wordBreak: 'break-word'
                            }}>
                                {task.title}
                            </h3>
                            {overdue && (
                                <span title="Overdue!" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center' }}>
                                    <AlertTriangle size={14} />
                                </span>
                            )}
                        </div>

                        {task.description && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '0.6rem' }}>{task.description}</p>
                        )}

                        {/* Badges row */}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className={catClass}><Tag size={9} />{task.category || 'Personal'}</span>
                            <span className={priClass}>{task.priority || 'Medium'}</span>
                            <span className={statusClass}>{task.status.replace('-', ' ')}</span>
                        </div>

                        {/* Due date & reminder */}
                        {(task.dueDate || task.reminder) && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {task.dueDate && (
                                    <span style={{ fontSize: '0.78rem', color: overdue ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={11} /> {formatDate(task.dueDate)}
                                    </span>
                                )}
                                {task.reminder && (
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Bell size={11} /> {formatDate(task.reminder)}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                        <select
                            value={task.status}
                            onChange={e => onStatusChange(task._id, { ...task, status: e.target.value })}
                            className="input-field"
                            style={{ marginBottom: 0, padding: '0.4rem 0.5rem', width: 'auto', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button onClick={() => setIsEditing(true)} className="btn-icon" title="Edit Task" style={{ color: 'var(--text-muted)' }}>
                            <Edit size={15} />
                        </button>
                        <button onClick={() => onDelete(task._id)} className="btn-icon" title="Delete Task" style={{ color: 'var(--danger)' }}>
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
