import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getStorage } from "firebase/storage";
import { COMPANIES_COLLECTION_NAME, STORAGE_BUCKET_LOGO_DIR } from '../constants';
import { db } from '../firebase';
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function CompanyDataEditor({token, user}) {
    const newLogoId = uuidv4(), location = useLocation(),
        navigate = useNavigate(), editItem = location.state ?? null,
        [companyLogo, setCompanyLogo] = useState(),
        [companyLogoFilename, setCompanyLogoFilename] = useState(''),
        [companyLogoGuidFilename, setCompanyLogoGuidFilename] = useState(newLogoId),
        [companyLogoFiletype, setCompanyLogoFiletype] = useState(''),
        initialCompanyObj = {
            'linkTikTok': '',
            'subtitle': '',
            'linkLinkedin': '',
            'title': '',
            'linkTelegram': '',
            'linkDiscord': '',
            'linkXTwitter': '',
            'companyLogoId': '',
            'linkFacebook': '',
            'linkWebsite': '',
            'linkInsta': '',
            'companyContent': '',
            'hqLocation': '',
            'id': '',
        },
        [companyFormError, setCompanyFormError] = useState(''),
        [companyObject, setCompanyObject] = useState(initialCompanyObj),
        [hasUpdatedCompanyLogo, setHasUpdatedCompanyLogo] = useState(false),
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

            if (!companyLogo && !editItem) { 
                setCompanyInputInvalid('logo');
                resolve(`${reqFieldMessage} logo`);
                setCompanyFormError(`${reqFieldMessage} logo`);
                return;
            }

            resolve(null);
            return;
        })
    }

    function handleFileInputChange(e) {
        setHasUpdatedCompanyLogo(true);
        setCompanyLogoFilename(e.target.files[0].name);
        setCompanyLogoGuidFilename(`${companyLogoGuidFilename}.${e.target.files[0].type.replace(/(.*)\//g, '')}`);
        setCompanyObject(prevState => ({
            ...prevState,
            ['companyLogoId']: `${companyLogoGuidFilename}.${e.target.files[0].type.replace(/(.*)\//g, '')}`
        }));
        setCompanyLogoFiletype(e.target.files[0].type);
        setCompanyLogo(e.target.files[0]);
    }
    
    function clearCompanyForm() {
        setCompanyObject({ ...initialCompanyObj });
        setCompanyLogo(null)
        clearInvalidInputStyle();
    }

    async function submitCompany(e) {
        e.preventDefault();
        clearInvalidInputStyle();

        const error = await validateCompanyObj();

        if (!error) {
            let comp = companyObject;

            if (!editItem) { 
                comp.companyLogoId = companyLogoGuidFilename;
            }

            Object.keys(companyObject).forEach(property => {
                try { 
                    let t = typeof property;
                    if (t === 'string') {
                        if (comp[property]) {
                            comp[property] = comp[property].trim();
                        }
                    }
                } catch { }
            });

            setCompanyObject(comp);

            const storage = getStorage(),
                collectionRef = collection(db, COMPANIES_COLLECTION_NAME),
                storageRef = ref(storage, `${STORAGE_BUCKET_LOGO_DIR}${companyLogoGuidFilename}`);

            if (!editItem) { 
                comp.isActive = true;

                try {
                    async function fileUpload() { 
                        uploadBytes(storageRef, companyLogo, {
                            contentType: companyLogoFiletype,
                          });
                    }
                   
                    await fileUpload();
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
                    if (hasUpdatedCompanyLogo) { 
                        async function fileUpload() { 
                            uploadBytes(storageRef, companyLogo, {
                                contentType: companyLogoFiletype,
                              });
                        }
                       
                        await fileUpload();
                    }

                    await updateDoc(doc(db, COMPANIES_COLLECTION_NAME, companyObject.id), companyObject)
                }
                catch (e) {
                    alert(e);
                    console.error(e);
                } finally {
                    alert('updated doc!');
                    clearCompanyForm();
                    navigate('/edit-view-companies');
                }
            }
           
        } else {
            console.error(error);
        }
    }

    function handleCheckboxChange(event)  {
        setCompanyObject(prevState => ({
            ...prevState,
            ['isActive']: event.target.checked
        }));
    }

    useEffect(() => {
        if (editItem) { 
            let editing = editItem.editItem;
            if (editing.isActive === undefined) { 
                editing.isActive = true;
            }
            setCompanyObject(editItem.editItem);
        }
    }, []);

    return (
        <div className="container" style={{ padding: 10 }}>
            {/* {token}
            {user} */}
            <Link to={editItem ? '/edit-view-companies' : '/' }>{'<- '}Back</Link>
            <h1 className="title">
                {editItem ? `Update ${editItem.editItem.title}` : 'Insert New Company 💼'}
            </h1>
  
            <div>
                <div className="field">
                    <label className="label">id: {companyObject.id ?? '...'}</label>
                </div>

                <div className="field">
                    <label className="checkbox">
                    <input type="checkbox" 
                        checked={companyObject.isActive == true} 
                        onChange={handleCheckboxChange} id={`company_isActive_input`} />
                        isActive
                    </label>
                </div>

                {[
                   'title', 'subtitle', 'hqLocation',
                   'linkWebsite', 'linkXTwitter', 'linkTikTok',
                   'linkInsta', 'linkFacebook', 'linkLinkedin',
                   'linkDiscord', 'linkTelegram',
                ].map((p, i) => (
                    <div className="field" key={`company_input_${i}`}>
                        <label className="label">{p}</label>
                        <input id={`company_${p}_input`} value={companyObject[p]}
                            className="input company-input" onChange={updateCompanyProperty} />
                    </div>
                ))}

                <div className="field">
                    <label className="label">companyContent</label>
                    <textarea id={`company_companyContent_input`} value={companyObject.companyContent} rows={25}
                        className="input company-input" onChange={updateCompanyProperty} style={{ minHeight: 100 }}>
                    </textarea>
                </div>

                <div className="file has-name">
                    <label className="file-label">
                        <input id={'company_logo_input'} type="file" onChange={handleFileInputChange}
                          accept="image/*" className="file-input company-input" />
                        <span className="file-cta">
                        <span className="file-icon">
                            <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label"> Choose a file… </span>
                        </span>
                        <span className="file-name">{companyLogoFilename}</span>
                    </label>
                </div>

                <div>
                    {companyFormError && <p className="has-text-danger">{companyFormError}</p>}

                    <span className="is-pulled-right">
                    <button className="button is-danger" onClick={clearCompanyForm}>CLEAR</button>{' '}
                        <button type="submit" className="button is-primary" onClick={submitCompany}>{editItem ? 'UPDATE' : 'INSERT'}</button>
                    </span>
                </div>
            </div>

        </div>
    )
}
