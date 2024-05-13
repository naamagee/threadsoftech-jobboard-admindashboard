import { useState } from "react";
import { Company } from './models/company'
import './app.css'

export default function App() {
  const [companyFormError, setCompanyFormError] = useState(''),
   [newCompany, setNewCompany] = useState(new Company('','','','','','','','','','','','')), 
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
    let c = newCompany;
    c[event.target.id.split('_')[1]] = event.target.value;
    setNewCompany(c);
  }

  async function validateCompanyObj() { 
    return new Promise(resolve => {
      if (newCompany.title === '') { 
        setCompanyInputInvalid('title');
        resolve(`${reqFieldMessage} title`);
        setCompanyFormError(`${reqFieldMessage} title`)
        return;
      }

      if (newCompany.hqLocation === '') { 
        setCompanyInputInvalid('hqLocation');
        resolve(`${reqFieldMessage} hqLocation`);
        setCompanyFormError(`${reqFieldMessage} hqLocation`)
        return;
      }

      if (newCompany.companyContent === '') { 
        setCompanyInputInvalid('companyContent');
        resolve(`${reqFieldMessage} companyContent`);
        setCompanyFormError(`${reqFieldMessage} companyContent`)
        return;
      }

      resolve(null)
      return;
    })
  }

  async function submitCompany() {
    console.info('no error!', newCompany)
    clearInvalidInputStyle();

    const error = await validateCompanyObj();

    if (!error) { 
      console.info('no error!', newCompany)
      // TODO create rec in firestore ... 
    } else { 
      console.error(error)
    }
  }

  return (
   <div className="box">
      <div className="grid has-2-cols">
        <div className="card cell box">
            <h1 className="title">Insert New Company</h1>
            
            {Object.keys(newCompany).map((p, i) => (
                <div className="field" key={i}>
                  <label className="label">{p}</label>
                  <input id={`company_${p}_input`} defaultValue={newCompany[p]} 
                    className="input company-input" placeholder={p} onChange={updateCompanyProperty} />
                </div>
            ))}
       
            <div>
              <button type="submit" className="button is-primary is-pulled-right" onClick={submitCompany}>INSERT</button>
              <button className="button is-danger is-pulled-right">CLEAR</button>
              {companyFormError && <p className="has-text-danger">{companyFormError}</p>}
            </div>
        </div>

        <div className="card cell">
          ... Insert New Job TODO ...
        </div>
      </div>
    </div>
  );
};
