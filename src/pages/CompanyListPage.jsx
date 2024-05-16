import { useEffect, useState, useRef } from "react"
import { collection, query, getDocs } from "firebase/firestore";
import { APP_ROUTES_ARRAY, COMPANIES_COLLECTION_NAME, STORAGE_BUCKET_LOGO_DIR } from '../constants';
import { Link } from "react-router-dom";
import { db } from '../firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function CompanyListPage() {
    const [companies, setCompanies] = useState([]), hasFetchedData = useRef(false);

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

    const Image = ({ filename }) => {
        const storage = getStorage(), [url, setUrl] = useState('');

        useEffect(() => {
            if (filename) { 
                getDownloadURL(ref(storage, `${STORAGE_BUCKET_LOGO_DIR}${filename}`))
                    .then((url) => {
                        setUrl(url);
                    });
            }
        }, [url]);

        return filename ? <img src={url} /> : <img />;
    };

    useEffect(() => {
        if (hasFetchedData.current === false) {
            getCompanies();
            hasFetchedData.current = true;
        }
    }, []);

    const CompanyCard = ({ company }) => (
        <div className="card">
            <div className="card-content">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-48x48">
                            <Image filename={company.companyLogoId} />
                        </figure>
                    </div>
                    <div className="media-content">
                        <p className="title is-4">{company.title}</p>
                        <p className="subtitle is-6">{company.subtitle}</p>
                    </div>
                </div>

                <div className="content">
                    {company.companyContent}
                </div>
            </div>

            <footer className="card-footer">
                <Link to={`/${APP_ROUTES_ARRAY[0].route}`} state={{ editItem: company }} className="card-footer-item has-text-primary">Edit</Link>
            </footer>
        </div>
    );

    return (
        <div className="container" style={{ padding: 10 }}>
            <Link to='/'>{'<- Back'}</Link>
            <h1 className="title">View/Edit Companies</h1>

            <div>
                {companies && companies.map((comp, i) => <CompanyCard key={i} company={comp} />)}
            </div>
        </div>
    )
}
