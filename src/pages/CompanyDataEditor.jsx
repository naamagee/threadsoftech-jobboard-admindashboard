import { collection, doc, setDoc } from "firebase/firestore";
import { COMPANIES_COLLECTION_NAME } from '../constants';
import { db } from '../firebase';
import { Company } from '../models/company';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyDataEditor({ editItem }) {
    const initialCompanyObj = new Company('', '', '', '', '', '', '', '', '', '', '', ''),
        [companyFormError, setCompanyFormError] = useState(''),
        [companyObject, setCompanyObject] = useState(editItem ? editItem : initialCompanyObj),
        reqFieldMessage = 'Missing required field: ',
        navigate = useNavigate();

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
        setCompanyObject(prevState => ({
            ...prevState,
            [event.target.id.split('_')[1]]: event.target.value
        }));
    }

    async function validateCompanyObj() {
        return new Promise(resolve => {
            if (companyObject.title === '') {
                setCompanyInputInvalid('title');
                resolve(`${reqFieldMessage} title`);
                setCompanyFormError(`${reqFieldMessage} title`);
                return;
            }

            if (companyObject.hqLocation === '') {
                setCompanyInputInvalid('hqLocation');
                resolve(`${reqFieldMessage} hqLocation`);
                setCompanyFormError(`${reqFieldMessage} hqLocation`);
                return;
            }

            if (companyObject.companyContent === '') {
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
        setCompanyObject({ ...initialCompanyObj });
        clearInvalidInputStyle();
    }

    async function submitCompany(e) {
        e.preventDefault();
        clearInvalidInputStyle();

        const error = await validateCompanyObj();

        if (!error) {
            let comp = companyObject;

            Object.keys(companyObject).forEach(property => {
                if (comp[property]) {
                    comp[property] = comp[property].trim();
                }
            });

            setCompanyObject(comp);

            const collectionRef = collection(db, COMPANIES_COLLECTION_NAME);

            if (!editItem) { 
                try {
                    await setDoc(doc(collectionRef), Object.assign({}, companyObject));
                }
                catch (e) {
                    alert(e);
                    console.error(e);
                } finally {
                    alert('inserted doc!');
                    clearCompanyForm();
                    navigate('/');
                }
            } else { 
                try {
                    //await setDoc(doc(collectionRef), Object.assign({}, companyObject));
                }
                catch (e) {
                    // alert(e);
                    // console.error(e);
                } finally {
                    // alert('updated doc!');
                    // clearCompanyForm();
                    // navigate('/edit-view-companies');
                }
            }
           
        } else {
            console.error(error);
        }
    }

    return (
        <div className="container" style={{ padding: 10 }}>
            <h1 className="title">Insert New Company 💼</h1>
            <div>
                {Object.keys(companyObject).map((p, i) => (
                    p !== 'companyContent' ?
                        <div className="field" key={`company_input_${i}`}>
                            <label className="label">{p}</label>
                            <input id={`company_${p}_input`} value={companyObject[p]}
                                className="input company-input" onChange={updateCompanyProperty} />
                        </div>
                        :
                        <div className="field" key={`company_input_${i}`}>
                            <label className="label">{p}</label>
                            <textarea id={`company_${p}_input`} value={companyObject[p]} rows={20}
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
