import { useEffect, useState } from "react";
import { Company } from './models/company'
import './app.css'

export default function App() {
  let [newCompany, updateCompany] = 
    useState(new Company('','','','','','','','','','','','',true))

  function updateCompanyProperty(propertyName, newValue) { 
    let c = newCompany;
    c[propertyName] = newValue;
    updateCompany(c);
  }

  function validateCompanyObj() { 
    // TODO
  }

  function submitCompany() {
    // TODO: check obj validations
    // TODO: firestore insert 
  }

  return (
    <>
        <div>
          <p>insert new company:</p>
          {Object.keys(newCompany).map((p, i) => (
            <div key={i}>
              { `${p}: ` }
              <input value={newCompany[p]} onChange={(e) => updateCompanyProperty(p, e.target.value)} />
            </div>
          ))}
          <button type="submit" onClick={submitCompany}>INSERT</button>
        </div>
    </>
  );
};
