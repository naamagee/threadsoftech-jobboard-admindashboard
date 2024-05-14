import { collection, doc, setDoc } from "firebase/firestore"; 
import { COMPANIES_COLLECTION_NAME, JOBS_COLLECTION_NAME } from '../constants';
import { db } from '../firebase';
import { Company } from '../models/company';
import { useState } from "react";

export default function NewCompanyPage() {
    const initialCompanyObj = new Company('','','','','','','','','','','',''),
    [companyFormError, setCompanyFormError] = useState(''),
    [newCompany, setNewCompany] = useState(initialCompanyObj), 
    reqFieldMessage = 'Missing required field: ';

  function setCompanyInputInvalid(elementId) { 
    const thisInput = document.getElementById(`company_${elementId}_input`);

    if (thisInput) { 
      thisInput.focus();
      thisInput.classList.add('is-danger');
    }
  }

  function clearInvalidInputStyle() {
    setCompanyFormError('');

    const formInputs = document.getElementsByClassName('company-input');

    for (let i = 0; i < formInputs.length; i++) { 
      formInputs[i].classList.remove('is-danger');
    }
  }

  function updateCompanyProperty(event) { 
    setNewCompany(prevState => ({
      ...prevState,
      [event.target.id.split('_')[1]]: event.target.value
    }));
  }

  async function validateCompanyObj() { 
    return new Promise(resolve => {
      if (newCompany.title === '') { 
        setCompanyInputInvalid('title');
        resolve(`${reqFieldMessage} title`);
        setCompanyFormError(`${reqFieldMessage} title`);
        return;
      }

      if (newCompany.hqLocation === '') { 
        setCompanyInputInvalid('hqLocation');
        resolve(`${reqFieldMessage} hqLocation`);
        setCompanyFormError(`${reqFieldMessage} hqLocation`);
        return;
      }

      if (newCompany.companyContent === '') { 
        setCompanyInputInvalid('companyContent');
        resolve(`${reqFieldMessage} companyContent`);
        setCompanyFormError(`${reqFieldMessage} companyContent`);
        return;
      }

      resolve(null);
      return;
    })
  }

  function clearCompanyForm() {
    setNewCompany({ ...initialCompanyObj });
    clearInvalidInputStyle();
  }

  async function submitCompany(e) {
    e.preventDefault();
    clearInvalidInputStyle();

    const error = await validateCompanyObj();

    if (!error) { 
      let comp = newCompany;

      Object.keys(newCompany).forEach(property => {
        if (comp[property]) { 
          comp[property] = comp[property].trim();
        }
      });

      setNewCompany(comp);

      const collectionRef = collection(db, COMPANIES_COLLECTION_NAME);

      try { 
        await setDoc(doc(collectionRef), Object.assign({}, newCompany));
      }
      catch(e) { 
        alert(e);
        console.error(e);
      } finally { 
        alert('inserted doc!');
        clearCompanyForm();
        // TODO: maybe stash the current data in localStorage here, incase something happpens, so there is no need to enter everythin again 
      }
    } else { 
      console.error(error);
    }
  }
    return (
        <div className="container" style={{ padding: 10 }}>
            <h1 className="title">Insert New Company 💼</h1>
            <div>
                {Object.keys(newCompany).map((p, i) => (
                    p !== 'companyContent' ?
                        <div className="field" key={`company_input_${i}`}>
                            <label className="label">{p}</label>
                            <input id={`company_${p}_input`} value={newCompany[p]}
                                className="input company-input" onChange={updateCompanyProperty} />
                        </div>
                        :
                        <div className="field" key={`company_input_${i}`}>
                            <label className="label">{p}</label>
                            <textarea id={`company_${p}_input`} value={newCompany[p]} rows={20}
                                className="input company-input" onChange={updateCompanyProperty} style={{ minHeight: 100 }}>
                            </textarea>
                        </div>
                ))}

                <button type="submit" className="button is-primary is-pulled-right" onClick={submitCompany}>INSERT</button>
                <button className="button is-danger is-pulled-right" onClick={clearCompanyForm}>CLEAR</button>
                {companyFormError && <p className="has-text-danger">{companyFormError}</p>}
            </div>
        </div>
    )
}
