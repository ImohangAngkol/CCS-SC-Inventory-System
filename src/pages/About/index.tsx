export default function AboutPage() {
  const devs = [
    { name: 'Andrew Daniel C. Corpuz' },
    { name: 'Andrei Nikolai Sialana' },
    { name: 'Hannah Hontiveros' },
    { name: 'Ronie Dane Niog' }
  ];
  return (
    <div className="container">
      <h2>About / Developers</h2>
      <p>SCIS is a frontend-only prototype with mock backend logic using localStorage.</p>
      <div className="grid" style={{ marginTop: '1rem' }}>
        {devs.map(d => (
          <div key={d.name} className="card" style={{ textAlign: 'center', borderColor: 'var(--accent)' }}>
            <div style={{ width: 100, height: 100, margin: '0 auto', borderRadius: '50%', background: 'var(--gray-300)' }} />
            <h3 style={{ marginBottom: 0, color: 'var(--accent)' }}>{d.name}</h3>
            <div style={{ color: 'var(--muted)' }}>CCS Student Council</div>
          </div>
        ))}
      </div>
    </div>
  );
}
