import { Sparkles } from 'lucide-react';

export function TopBanner({ status }) {
  return (
    <div className="form-card animate-fade-up" style={{ marginBottom: 28, padding: '20px 28px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={22} color="#FFF" />
        </div>
        <div>
          <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 800 }}>Welcome to HirePulse Job Portal</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Discover top tech roles, track your submitted applications, and view real-time career insights.
          </p>
        </div>
      </div>
      {status && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700 }}>SYSTEM STATUS</div>
            <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.9rem' }}>
              Online • Live Sync
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopBanner;
