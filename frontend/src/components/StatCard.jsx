export default function StatCard({ title, value, icon, tone = "primary", subtitle }) {
  return (
    <article className={`card stat-card border-0 shadow-sm border-start border-4 border-${tone}`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted small text-uppercase fw-semibold">{title}</div>
          <div className="fs-3 fw-bold mt-1">{value}</div>
          {subtitle && <div className="small text-muted">{subtitle}</div>}
        </div>
        <div className={`stat-icon text-${tone}`}><i className={`bi ${icon}`} /></div>
      </div>
    </article>
  );
}
