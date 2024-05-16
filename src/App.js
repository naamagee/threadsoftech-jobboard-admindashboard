import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { APP_ROUTES_ARRAY } from "./constants";
import './app.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <div className="container">
              <h1 className="title">Dashboard Menu</h1>
              <ul>
                {APP_ROUTES_ARRAY.map((prt, i) => (
                  <li key={i}>
                    <Link to={`/${prt.route}`}>{`-> ${prt.title}`}</Link>
                  </li>
                ))}
              </ul>
            </div>
          } />

          {APP_ROUTES_ARRAY.map((prt, i) => (
            <Route key={i} path={prt.route} element={prt.page} />
          ))}

          <Route path="*" element={<>...</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
