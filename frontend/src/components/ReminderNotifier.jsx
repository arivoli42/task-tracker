import React, { useEffect, useState, useRef } from 'react';
import { Bell, X } from 'lucide-react';

export default function ReminderNotifier({ tasks }) {
    const [toasts, setToasts] = useState([]);
    const firedRef = useRef(new Set());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            tasks.forEach(task => {
                if (!task.reminder || task.status === 'completed') return;
                const reminderTime = new Date(task.reminder);
                const diff = reminderTime - now;
                // Fire if within the next 60 seconds and not already fired
                if (diff > 0 && diff <= 60000 && !firedRef.current.has(task._id)) {
                    firedRef.current.add(task._id);
                    setToasts(prev => [...prev, { id: task._id, title: task.title, time: reminderTime }]);
                }
                // Also fire if overdue by less than 60 seconds (just passed)
                if (diff <= 0 && diff >= -60000 && !firedRef.current.has(task._id)) {
                    firedRef.current.add(task._id);
                    setToasts(prev => [...prev, { id: task._id, title: task.title, time: reminderTime }]);
                }
            });
        }, 10000); // check every 10s

        return () => clearInterval(interval);
    }, [tasks]);

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    if (toasts.length === 0) return null;

    return (
        <div style={{ position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {toasts.map(toast => (
                <div key={toast.id} className="reminder-toast">
                    <Bell size={20} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.2rem' }}>⏰ Reminder</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{toast.title}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.2rem' }}>
                            {toast.time.toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                        </div>
                    </div>
                    <button onClick={() => dismiss(toast.id)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0', marginTop: '-0.25rem', opacity: 0.8 }}>
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
