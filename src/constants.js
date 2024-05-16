import { CompanyDataEditor, CompanyListPage, JobDataEditor, JobListPage } from "./pages";
import PRT from './models/prt'

export const JOBS_COLLECTION_NAME = 'jobs';
export const COMPANIES_COLLECTION_NAME = 'companies';
export const STORAGE_BUCKET_LOGO_DIR = 'logos/';
export const APP_ROUTES_ARRAY = [
    new PRT(<CompanyDataEditor />, 'company-editor', 'Insert New Company'),
    new PRT(<CompanyListPage />, 'edit-view-companies', 'Edit/View Companies'),
    new PRT(<JobDataEditor />, 'job-editor', 'Insert New Job'),
    new PRT(<JobListPage />, 'edit-view-jobs', 'Edit/View Jobs')
];
