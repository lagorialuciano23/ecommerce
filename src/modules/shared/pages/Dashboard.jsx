import './dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav>
        <ul>
          <li>hola</li>
          <li>como</li>
          <li>estas</li>
        </ul>  
      </nav>
      <header>Header</header>
      <main>
        <div className="card">Card 1</div>
        <div className="card">Card 2</div>
        <div className="card">Card 3</div>
      </main>
      <footer>Mi footer</footer>
    </div>
  );
}

export default Dashboard;
