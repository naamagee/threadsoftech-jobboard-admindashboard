import { useEffect, useState, useRef } from "react"
import { collection, query, getDocs } from "firebase/firestore";
import { COMPANIES_COLLECTION_NAME, JOBS_COLLECTION_NAME } from '../constants';
import { Link } from "react-router-dom";
import { db } from '../firebase';

export default function JobListPage()  {
    const [companies, setCompanies] = useState([]), 
        [jobs, setJobs] = useState([]), 
        hasFetchedData = useRef(false);

    async function getCompanies() {
        try { 
            
        } catch (error) {
            console.error(error)
        }
    }

    async function getJobs() {
        await getCompanies();
        try {
            const qCo = query(collection(db, COMPANIES_COLLECTION_NAME)), querySnapshotCo = await getDocs(qCo),
                q = query(collection(db, JOBS_COLLECTION_NAME)), querySnapshot = await getDocs(q);

            let comps = [];

            setCompanies(prev => []);
            setJobs(prev => []);
        
            querySnapshotCo.forEach((doc) => {
                let companyDoc = doc.data();
                if (!companyDoc.id) { 
                    companyDoc.id = doc.id;
                }

                setCompanies(prev => [...prev, companyDoc]);
                comps.push(companyDoc);
            });

            querySnapshot.forEach((doc) => {
                let jobDoc = doc.data();
                if (!jobDoc.id) { 
                    jobDoc.id = doc.id;
                }
                jobDoc.postingCompanyTempName = comps.find(c => c.id == jobDoc.postingCompanyId)?.title;
                setJobs(prev => [...prev, jobDoc]);
            });
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (hasFetchedData.current === false) {
            getJobs();
            hasFetchedData.current = true;
        }
    }, []);

    return (
        <div className="container" style={{ padding: 10 }}>
            <Link to='/'>{'<- Back'}</Link>
            <h1 className="title">View/Edit Jobs</h1>

            <table className="table">
                <thead>
                    <tr>
                        {['job id', 'job title', 'posting company', 'posted date'].map((h, i) => (
                            <th key={i}>{h}</th>
                        ))}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        companies && (
                            jobs && (
                                jobs.map((job, i) => (
                                    <tr key={i}>
                                        <td>{job.id}</td>
                                        <td>{job.jobTitle}</td>
                                        <td>{job.postingCompanyTempName}</td>
                                        <td>{job.postedDate}</td>
                                        <td>Link to edit item .. </td>
                                    </tr>
                                ))
                            )
                        )
                    }
                </tbody>
                {/* {companies && companies.map((comp, i) => <CompanyCard key={i} company={comp} />)} */}
            </table>
        </div>
    )
}
