import React from 'react';
import { BookOpen, User, Briefcase, Heart, TrendingUp } from 'lucide-react';

const CAT_ICONS = {
    Study: <BookOpen size={14} />,
    Personal: <User size={14} />,
    Work: <Briefcase size={14} />,
    Health: <Heart size={14} />,
};
const CAT_COLORS = {
    Study: 'var(--cat-study)',
    Personal: 'var(--cat-personal)',
    Work: 'var(--cat-work)',
    Health: 'var(--cat-health)',
};
const PRI_COLORS = {
    Low: 'var(--pri-low)',
    Medium: 'var(--pri-medium)',
    High: 'var(--pri-high)',
};

function DonutRing({ value, max, color, size = 80, stroke = 10, label, sub }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const pct = max > 0 ? Math.min(value / max, 1) : 0;
    const dash = pct * circ;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={stroke} />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
                    strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)' }}
                />
                <text
                    x="50%" y="50%"
                    textAnchor="middle" dominantBaseline="central"
                    fill="var(--text-main)"
                    fontSize={size * 0.22}
                    fontWeight="700"
                    style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontFamily: 'Inter, sans-serif' }}
                >
                    {value}
                </text>
            </svg>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-main)' }}>{label}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</span>
        </div>
    );
}

export default function ProgressChart({ tasks }) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // By category
    const cats = ['Study', 'Personal', 'Work', 'Health'];
    const byCat = cats.map(c => ({
        name: c,
        total: tasks.filter(t => t.category === c).length,
        done: tasks.filter(t => t.category === c && t.status === 'completed').length,
    }));

    // By priority
    const pris = ['High', 'Medium', 'Low'];
    const byPri = pris.map(p => ({
        name: p,
        count: tasks.filter(t => t.priority === p && t.status !== 'completed').length,
    }));
    const maxPri = Math.max(...byPri.map(p => p.count), 1);

    // Last 7 days completion
    const last7 = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
        const count = tasks.filter(t => {
            if (!t.completedAt) return false;
            const cd = new Date(t.completedAt);
            return cd.toDateString() === d.toDateString();
        }).length;
        return { label, count };
    });
    const maxDay = Math.max(...last7.map(d => d.count), 1);

    return (
        <div className="glass-card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <TrendingUp size={18} color="var(--primary-color)" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Progress Dashboard</h2>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Overall Completion</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{pct}%</span>
                </div>
                <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
            </div>

            {/* Status donuts */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <DonutRing value={total} max={total || 1} color="var(--primary-color)" label="Total" sub="tasks" />
                <DonutRing value={pending} max={total || 1} color="var(--warning)" label="Pending" sub="tasks" />
                <DonutRing value={inProgress} max={total || 1} color="var(--primary-color)" label="In Progress" sub="tasks" />
                <DonutRing value={completed} max={total || 1} color="var(--success)" label="Done" sub="tasks" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {/* By category */}
                <div>
                    <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>By Category</h3>
                    {byCat.map(c => (
                        <div key={c.name} style={{ marginBottom: '0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: CAT_COLORS[c.name] }}>
                                    {CAT_ICONS[c.name]} {c.name}
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>{c.done}/{c.total}</span>
                            </div>
                            <div className="progress-bar-track" style={{ height: '6px' }}>
                                <div className="progress-bar-fill" style={{
                                    width: c.total > 0 ? `${Math.round((c.done / c.total) * 100)}%` : '0%',
                                    background: CAT_COLORS[c.name]
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Priority breakdown & 7-day chart */}
                <div>
                    <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending by Priority</h3>
                    {byPri.map(p => (
                        <div key={p.name} style={{ marginBottom: '0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                                <span style={{ color: PRI_COLORS[p.name], fontWeight: '600' }}>{p.name}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{p.count} tasks</span>
                            </div>
                            <div className="progress-bar-track" style={{ height: '6px' }}>
                                <div className="progress-bar-fill" style={{
                                    width: `${Math.round((p.count / maxPri) * 100)}%`,
                                    background: PRI_COLORS[p.name]
                                }} />
                            </div>
                        </div>
                    ))}

                    {/* 7-day bar chart */}
                    <h3 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', margin: '1rem 0 0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completed (Last 7 Days)</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '60px' }}>
                        {last7.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', height: '100%', justifyContent: 'flex-end' }}>
                                <div
                                    title={`${d.count} completed`}
                                    style={{
                                        width: '100%',
                                        height: `${Math.max((d.count / maxDay) * 50, d.count > 0 ? 8 : 4)}px`,
                                        background: d.count > 0
                                            ? 'linear-gradient(180deg, var(--primary-color), var(--secondary-color))'
                                            : 'var(--border-color)',
                                        borderRadius: '3px 3px 0 0',
                                        transition: 'height 0.5s ease',
                                        cursor: 'default'
                                    }}
                                />
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{d.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
