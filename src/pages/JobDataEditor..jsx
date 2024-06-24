import { collection, doc, setDoc, updateDoc, query, getDocs } from "firebase/firestore";
import { JOBS_COLLECTION_NAME, COMPANIES_COLLECTION_NAME } from '../constants';
import { db } from '../firebase';
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from 'react-select';

export default function JobDataEditor() {
    const location = useLocation(), hasFetchedData = useRef(false),
        navigate = useNavigate(), editItem = location.state ?? null,
        initialJobObj = {}, [formError, setFormError] = useState(''),
        [jobObject, setJobObject] = useState(initialJobObj),
        [companies, setCompanies] = useState([]),
        reqFieldMessage = 'Missing required field: ',
        [tags, setTags] = useState(),
        multiSelectTagsOps = [
            { label: 'Engineering', value: 'Engineering' }, { label: 'Design', value: 'Design' },
            { label: 'Product Management', value: 'Product Management' }, { label: 'Marketing', value: 'Marketing' },
            { label: 'Operations', value: 'Operations' }, { label: 'Sales', value: 'Sales' }, { label: 'Data', value: 'Data' },
        ];

    function setInputInvalid(elementId) {
        const thisInput = document.getElementById(`job_${elementId}_input`);

        if (thisInput) {
            thisInput.focus();
            thisInput.classList.add('is-danger');
        }
    }

    function clearInvalidInputStyle() {
        setFormError('');

        const formInputs = document.getElementsByClassName('job-input');

        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].classList.remove('is-danger');
        }
    }

    function updateProperty(event) {
        setJobObject(prevState => ({
            ...prevState,
            [event.target.id.split('_')[1]]: event.target.value
        }));
    }

    async function validateJobObj() {
        return new Promise(resolve => {
            if (jobObject.jobTitle === '') {
                setInputInvalid('jobTitle');
                resolve(`${reqFieldMessage} jobTitle`);
                setFormError(`${reqFieldMessage} jobTitle`);
                return;
            }

            if (jobObject.applicationLinks === '') {
                setInputInvalid('applicationLinks');
                resolve(`${reqFieldMessage} applicationLinks`);
                setFormError(`${reqFieldMessage} applicationLinks`);
                return;
            }

            if (jobObject.tags === '') {
                setInputInvalid('tags');
                resolve(`${reqFieldMessage} tags`);
                setFormError(`${reqFieldMessage} tags`);
                return;
            }

            if (jobObject.postContent === '') {
                setInputInvalid('postContent');
                resolve(`${reqFieldMessage} postContent`);
                setFormError(`${reqFieldMessage} postContent`);
                return;
            }

            resolve(null);
            return;
        })
    }

    function clearForm() {
        setJobObject({ ...initialJobObj });
        clearInvalidInputStyle();
    }

    async function submitJob(e) {
        e.preventDefault();
        clearInvalidInputStyle();

        const error = await validateJobObj();

        if (!error) {
            let job = jobObject;

            if (tags) {
                let selectedTags = []
                tags.forEach(t => {
                    selectedTags.push(t.value)
                })
                job.tags = selectedTags.join(',');
            }

            Object.keys(job).forEach(property => {
                try { 
                    let t = typeof property;
                    if (t === 'string') {
                        if (job[property]) {
                            job[property] = job[property].trim();
                        }
                    }
                } catch {}
            });

            try { 
                delete job.postingCompanyTempName
            } catch {}

            setJobObject(job);

            if (!editItem) {
                try {
                    await setDoc(doc(collection(db, JOBS_COLLECTION_NAME)), Object.assign({}, jobObject));
                }
                catch (e) {
                    alert(e);
                    console.error(e);
                } finally {
                    alert('inserted doc!');
                    clearForm();
                    navigate('/');
                }
            } else {
                try {
                    await updateDoc(doc(db, JOBS_COLLECTION_NAME, jobObject.id), jobObject)
                }
                catch (e) {
                    alert(e);
                    console.error(e);
                } finally {
                    alert('updated doc!');
                    clearForm();
                    navigate('/edit-view-jobs');
                }
            }

        } else {
            console.error(error);
        }
    }

    function handleCheckboxChange(event) {
        setJobObject(prevState => ({
            ...prevState,
            [event.target.id.split('_')[1]]: event.target.checked
        }));
    }

    function handleTagsSelectChange(event) {
        let tags = [];
        if (event.length > 0) {
            event.forEach(i => {
                tags.push(i);
            })
        }

        setTags(tags);
    }

    async function getCompanies() {
        try {
            setCompanies(prev => []);

            const q = query(collection(db, COMPANIES_COLLECTION_NAME)), querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                let companyDoc = doc.data();
                companyDoc.id = doc.id;

                setCompanies(prev => [...prev, companyDoc]);
            });
        } catch (error) {
            console.error(error)
        }
    }

    function handleSelectChanged(event) {
        const selectedVal = event.target.value;

        if (selectedVal !== 0) {
            setJobObject(prevState => ({
                ...prevState,
                ['postingCompanyId']: selectedVal
            }));
        }
    }

    useEffect(() => {
        if (hasFetchedData.current === false) {
            getCompanies();
            hasFetchedData.current = true;
        }

        if (editItem) {
            let editing = editItem.editItem;
            if (editing.isActive === undefined) {
                editing.isActive = true;
            }
            setJobObject(editItem.editItem);
            let loadedTags = editing.tags?.split(',')
            if (loadedTags) { 
                let selectTagsOptions = []
                loadedTags.forEach(t => {
                    let tagOption = multiSelectTagsOps.find(m => m.value == t)
                    selectTagsOptions.push(tagOption)
                })

                setTags(selectTagsOptions)
            }
        }
    }, []);

    return (
        <div className="container" style={{ padding: 10 }}>
            <Link to={editItem ? '/edit-view-jobs' : '/'}>{'<- '}Back</Link>
            <h1 className="title">
                {editItem ? `Update "${editItem.editItem.jobTitle}" at ${editItem.editItem.postingCompanyTempName}` : 'Insert New Job 👔'}
            </h1>

            <div>
                <div className="field">
                    <label className="label">id: {jobObject.id ?? '...'}</label>
                </div>

                <div className="field">
                    <div className="select">
                        <select onChange={handleSelectChanged}>
                            <option value={0}>Posting Company...</option>
                            {companies && (
                                companies.map((comp, i) => (
                                    <option key={i} value={comp.id} selected={jobObject.postingCompanyId == comp.id}>
                                        {comp.title}
                                    </option>
                                )))}
                        </select>
                    </div>
                </div>

                <div className="field">
                    <label className="checkbox">
                        <input type="checkbox"
                            checked={jobObject.isActive == true}
                            onChange={handleCheckboxChange} id={`job_isActive_input`} />
                        isActive
                    </label>
                </div>

                <div className="field">
                    {['isRemote', 'isHybrid', 'isOnsite'].map((jobType, i) => (
                        <label className="checkbox" style={{ marginRight: 10 }} key={i}>
                            <input key={i} type="checkbox"
                                checked={jobObject[jobType] == true}
                                onChange={handleCheckboxChange} id={`job_${jobType}_input`} />
                            &nbsp;{jobType}
                        </label>
                    ))}
                </div>

                <div className="field">
                    {['isContract', 'isSalary'].map((jobType, i) => (
                        <label className="checkbox" style={{ marginRight: 10 }} key={i}>
                            <input type="checkbox"
                                checked={jobObject[jobType] == true}
                                onChange={handleCheckboxChange} id={`job_${jobType}_input`} />
                            &nbsp;{jobType}
                        </label>
                    ))}
                </div>

                <div className="field">
                    <label className="checkbox">
                        <input type="checkbox"
                            checked={jobObject.isInternship == true}
                            onChange={handleCheckboxChange} id={`job_isInternship_input`} />
                        isInternship
                    </label>
                </div>

                {[
                    'jobTitle', 'shortDescription', 'postedDate',
                    'applicationLinks','yearlySalary', 'hourlySalary'
                ].map((p, i) => (
                    <div className="field" key={`job_input_${i}`}>
                        <label className="label">{p}</label>
                        <input id={`cjob_${p}_input`} value={jobObject[p]}
                            className="input job-input" onChange={updateProperty} />
                    </div>
                ))}

                <div className="field">
                    <label className="label">tags</label>
                    <Select isMulti options={multiSelectTagsOps} onChange={handleTagsSelectChange} value={tags} />
                </div>

                <div className="field">
                    <label className="label">postContent</label>
                    <textarea id={`job_postContent_input`} value={jobObject.postContent} rows={25}
                        className="input job-input" onChange={updateProperty} style={{ minHeight: 100 }}>
                    </textarea>
                </div>

                <div>
                    {formError && <p className="has-text-danger">{formError}</p>}

                    <span className="is-pulled-right">
                        <button className="button is-danger" onClick={clearForm}>CLEAR</button>{' '}
                        <button type="submit" className="button is-primary" onClick={submitJob}>{editItem ? 'UPDATE' : 'INSERT'}</button>
                    </span>
                </div>
            </div>

        </div>
    )
}
