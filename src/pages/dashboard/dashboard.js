import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Dashboard = () => {

  // const notify = (message) => toast(message);

  // const notifyError = (message) => toast.error(message);

  const [statusCount, setStatusCount] = useState({ complete: 0 });

  const [recentJob, setRecentJob] = useState([]);
  const [lastKey, setLastKey] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isLoadMore, setIsLoadMore] = useState(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  /// Fetch Status Count
  const fetchData = async () => {
    try {
      const response = await axios.get('https://icutw3djvd.execute-api.ap-south-1.amazonaws.com/Prod/midas_installation_statusWise_count');
      const data = response.data['body-json']['body'];
      console.log(data);

      setStatusCount({ complete: data['complete'] });


    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };


  /// Fetch Load More Recent Job
  const loadMoreRecentJob = useCallback(async (lastKeyParam) => {
    setLoadingLoadMore(true);
    try {
      const data = {
        limit: 5,
        lastKey: lastKeyParam
      };
      const response = await axios.post('https://icutw3djvd.execute-api.ap-south-1.amazonaws.com/Prod/midas_installation_all_job_all_data', data);
      const body = response.data['body-json']['body'];

      if (response.data && response.data['body-json'].statusCode === 200) {
        const fetchedJobs = body['detailedJobs'] || [];
        const fetchedLastKey = body['lastKey'] || null;

        setRecentJob(prev => [...prev, ...fetchedJobs]);
        setLastKey(fetchedLastKey);

        if (fetchedLastKey === null) {
          setIsLoadMore(false);
        }

        if (fetchedJobs.length === 0 && fetchedLastKey) {
          // recursively load more if no jobs but lastKey exists
          loadMoreRecentJob(fetchedLastKey);
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
  const fetchRecentJob = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = { limit: 5, lastKey: "" };
      const response = await axios.post('https://icutw3djvd.execute-api.ap-south-1.amazonaws.com/Prod/midas_installation_all_job_all_data', data);
      const body = response.data['body-json']['body'];

      if (response.data && response.data['body-json'].statusCode === 200) {
        const fetchedJobs = body['detailedJobs'] || [];
        const fetchedLastKey = body['lastKey'] || null;

        setRecentJob(fetchedJobs);
        setLastKey(fetchedLastKey);

        if (fetchedJobs.length === 0 && fetchedLastKey) {
          await loadMoreRecentJob(fetchedLastKey);
        }
      } else {
        throw new Error('Failed to fetch recent jobs');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadMoreRecentJob]);



  useEffect(() => {

    if (statusCount.complete === 0) {
      fetchData();
    }

    if (recentJob.length === 0) {
      fetchRecentJob();
    }

  }, [statusCount.complete, recentJob.length, fetchRecentJob]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="px-4 pt-20 sm:px-10">
        {/* Spacer */}
        <div className="h-5" />

        {/* Task Completed Card ---> Outer green box ====================================================== */}
        <Link to={"/particular_category"}>
          <div className="h-20 sm:h-24 w-full bg-green-500 rounded-lg shadow-lg flex items-center">
            {/* Inner white card */}
            <div className="flex justify-between items-center w-full bg-white rounded-lg h-20 sm:h-24 ml-2 px-4 sm:px-6 md:px-10 border-2 shadow-sm">

              {/* Correct Icon */}
              <DoneAllIcon className="text-green-600 text-xl sm:text-2xl" />

              {/* Task Completed */}
              <p className="text-sm sm:text-base md:text-lg font-serif text-center">
                Task <br className="block sm:hidden" /> Completed
              </p>

              {/* Task Count  */}
              <p className="text-sm sm:text-base md:text-lg font-serif text-blue-700">{statusCount.complete}</p>
            </div>
          </div>
        </Link>

        {/* Spacer */}
        <div className="h-5" />

        {/* Recent Job ---> Text ======================================================================== */}
        <p className='text-md sm:text-lg font-serif'>Recent Job</p>

        {/* Spacer */}
        <div className="h-5" />

        {/* Recent Job List =============================================================================== */}
        {/* Task List */}
        <div className="space-y-2 pb-6">
          {recentJob.length === 0 ? (<div>
            <center className=''>No Job Available</center>
          </div>) : (recentJob.map((job, index) => (
            <Link to={"/particular_job"} state={{ jobId: job['jobId'], backPath: "/" }}>
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
        {isLoadMore && <center><button className='h-10 w-40   bg-blue-700 font-serif py-2 rounded text-white' onClick={() => loadMoreRecentJob(lastKey)}>{loadingLoadMore ? 'loading...' : 'Load More'}</button></center>}


        {/* Spacer */}
        <div className="h-5" />

      </div>
    </>
  );
};

export default Dashboard;
