import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NewCompanyPage from "./pages/CompanyDataEditor";
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
                {[
                    <Link to="/new-company"> - Insert New Company</Link>,
                    <Link to="/edit-view-companies"> - Edit/View Companies</Link>,
                    <Link to="/new-job"> - Insert New Job</Link>,
                    <Link to="/edit-view-jobs"> - Edit/View Jobs</Link>,
                ].map((link, i) => (<li key={i}>{link}</li>))}
              </ul>
            </div>
          } />
          <Route path="new-company" element={<NewCompanyPage />} />
          <Route path="*" element={<>...</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
