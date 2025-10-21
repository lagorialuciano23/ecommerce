import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">Sidebar</aside>
      <header className="header">Header</header>
      <main className="main">
        <div className="card">Card 1</div>
        <div className="card">Card 2</div>
        <div className="card">Card 3</div>
      </main>
    </div>
  );
}
