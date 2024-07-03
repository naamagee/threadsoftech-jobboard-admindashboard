import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CompanyDataEditor, CompanyListPage, JobDataEditor, JobListPage } from "./pages";
import './app.css';
import { useEffect, useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from './firebase'

// date extension
Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}

export default function App() {
  const [token, setToken] = useState(null), [user, setUser] = useState(null),
    APP_ROUTES_ARRAY = [
      { page: <CompanyDataEditor token={token} user={user} />, route: 'company-editor', title: 'Insert New Company'},
      { page: <CompanyListPage />, route: 'edit-view-companies', title: 'Edit/View Companies' },
      { page: <JobDataEditor token={token} user={user} />, route: 'job-editor', title: 'Insert New Job' },
      { page: <JobListPage />, route: 'edit-view-jobs', title: 'Edit/View Jobs' },
    ];

  const authenticate = async() => {
    if (token === null || user == null) {
      const firebasetoken = localStorage.getItem("firebasetoken");
      const firebasetokenexpires = localStorage.getItem("firebasetokenexpires");
      const firebaseuser = localStorage.getItem("firebasetokenuser");
      let tokenExpired;

      if (firebasetoken !== null) { 
        tokenExpired = Date.parse(firebasetokenexpires) < new Date();
      }

      if (firebasetoken === null || tokenExpired) { 
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
          .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
    
            localStorage.setItem("firebasetoken", credential.accessToken)
            localStorage.setItem("firebasetokenexpires", new Date().addHours(12))
            localStorage.setItem("firebaseuser", JSON.stringify(result.user))
    
            setToken(credential.accessToken);
            setUser(result.user);
          }).catch((error) => { console.error(error) });
      }
      else { 
        setToken(firebasetoken);
        setUser(firebaseuser);
      }
    }
  }

  useEffect(() => {
    authenticate()
  }, [token, user])

  return (
    (token !== null) && (user !== null) ? 
      <>
      <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={
                <div className="container">
                  <span>Welcome back, {user.displayName}</span>
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
      </> : <p style={{ textAlign: 'center' }}>Authenticating ...</p>
  );
};
