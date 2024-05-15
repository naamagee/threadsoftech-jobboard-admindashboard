import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CompanyDataEditor, CompanyListPage } from "./pages";
import PRT from './models/prt'
import './app.css';

export default function App() {
  const prts = [
    new PRT(<CompanyDataEditor />, 'new-company', 'Insert New Company'),
    new PRT(<CompanyListPage />, 'edit-view-companies', 'Edit/View Companies'),
    new PRT(() => <>new page here</>, 'new-job', 'Insert New Job'),
    new PRT(() => <>new page here</>, 'edit-view-jobs', '')
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <div className="container">
              <h1 className="title">Dashboard Menu</h1>
              <ul>
                {prts.map((prt, i) => (
                  <li key={i}>
                    <Link to={`/${prt.route}`}>{`-> ${prt.title}`}</Link>
                  </li>
                ))}
              </ul>
            </div>
          } />

          {prts.map((prt, i) => (
            <Route key={i} path={prt.route} element={prt.page} />
          ))}
          
          <Route path="*" element={<>...</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
