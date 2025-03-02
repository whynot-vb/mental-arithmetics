import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <h1>MENTAL ARITHMETICS</h1>
      <nav>
        <ul>
          <li>
            <Link to="/first">First</Link>
          </li>
          <li>
            <Link to="/second">Second</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default App;
