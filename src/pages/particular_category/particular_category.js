import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ParticularCategry = () => {

    const [completedJob, setCompletedJob] = useState([]);
    const [lastKey, setLastKey] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isLoadMore, setIsLoadMore] = useState(true);
    const [loadingLoadMore, setLoadingLoadMore] = useState(false);

    /// Fetch Load More Recent Job
    const loadMoreCompletedJob = useCallback(async (lastKeyParam) => {
        setLoadingLoadMore(true);
        try {
            const data = {
                status: 'complete',
                limit: 5,
                lastKey: lastKeyParam
            };
            const response = await axios.post('https://icutw3djvd.execute-api.ap-south-1.amazonaws.com/Prod/midas_installation_job_filter', data);
            console.log('Api Response Load More Completed Job', response);
            const body = response.data['body-json']['body'];

            if (response.data && response.data['body-json'].statusCode === 200) {
                const fetchedJobs = body['detailedJobs'] || [];
                const fetchedLastKey = body['lastKey'] || null;

                setCompletedJob(prev => [...prev, ...fetchedJobs]);
                setLastKey(fetchedLastKey);

                if (fetchedLastKey === null) {
                    setIsLoadMore(false);
                }

                if (fetchedJobs.length === 0 && fetchedLastKey) {
                    // recursively load more if no jobs but lastKey exists
                    loadMoreCompletedJob(fetchedLastKey);
                }
            } else {
                setIsLoadMore(false);
            }
        } catch (err) {
            console.error('Error loading more jobs:', err);
            setError(err.message);
        } finally {
            setLoadingLoadMore(false);
        }
    }, []);

    /// Fetch Recent Job
    const fetchCompletedJob = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = { status: 'complete', limit: 5, lastKey: "" };
            const response = await axios.post('https://icutw3djvd.execute-api.ap-south-1.amazonaws.com/Prod/midas_installation_job_filter', data);
            console.log('Api Response Completed Job', response);
            const body = response.data['body-json']['body'];

            if (response.data && response.data['body-json'].statusCode === 200) {
                const fetchedJobs = body['detailedJobs'] || [];
                const fetchedLastKey = body['lastKey'] || null;

                setCompletedJob(fetchedJobs);
                setLastKey(fetchedLastKey);

                if (fetchedJobs.length === 0 && fetchedLastKey) {
                    await loadMoreCompletedJob(fetchedLastKey);
                }
            } else {
                throw new Error('Failed to fetch recent jobs');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loadMoreCompletedJob]);



    useEffect(() => {

        if (completedJob.length === 0) {
            fetchCompletedJob();
        }

    }, [completedJob.length, fetchCompletedJob]);


    if (loading) return <div className="pt-24"><p className="text-center">Loading...</p></div>;
    if (error) return <div className="pt-24"><p className="text-center text-red-500">Error: {error}</p></div>;

    return (
        <>
            <div className="px-4 pt-20 sm:px-10">

                {/* Title and Back Button */}
                <div className="flex items-center justify-between px-4 py-3 border-b">

                    {/* Back Button */}
                    <Link to={"/"}>
                        <button className="absolute left-4 text-gray-700 hover:text-black">
                            <ArrowBackIcon className="text-xl sm:text-2xl" />
                        </button>
                    </Link>

                    {/* Title */}
                    <h1 className="text-center w-full text-lg sm:text-xl font-semibold text-gray-800">
                        Completed Jobs
                    </h1>

                </div>

                {/* Spacer */}
                <div className="h-3" />

                {/* Completed Job List =============================================================================== */}
                <div className="space-y-2 pb-6">
                    {completedJob.length === 0 ? (<div>
                        <center className=''>No Job Available</center>
                    </div>) : (completedJob.map((job, index) => (
                        <Link to={"/particular_job"} state={{jobId: job['jobId'], backPath: "/particular_category"}}>
                            <div
                                key={job['jobId']}
                                className="rounded-lg border border-cyan-700 p-2 shadow-sm bg-gray-50 mb-2"
                            >
                                <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                                    {job['jobName']}
                                </h3>
                                <p className="text-xs sm:text-sm">
                                    <span className="font-semibold">Received By:</span> {job['receiveByName']}
                                </p>
                                <p className="text-xs sm:text-sm">
                                    <span className="font-semibold">Project:</span> {job['projectName']}
                                </p>
                                <p className="text-xs sm:text-sm">
                                    <span className="font-semibold">Status:</span> {job['status']}
                                </p>
                                <p className="text-xs sm:text-sm">
                                    <span className="font-semibold">Received Date:</span> {job['receiveDate']}
                                </p>
                            </div>
                        </Link>

                    )))}
                </div>

                {/* Load More Button */}
                {isLoadMore && <center><button className='h-10 w-40   bg-blue-700 font-serif py-2 rounded text-white' onClick={() => loadMoreCompletedJob(lastKey)}>{loadingLoadMore ? 'loading...' : 'Load More'}</button></center>}


                {/* Spacer */}
                <div className="h-5" />

            </div>
        </>
    );

}

export default ParticularCategry;