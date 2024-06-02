import { ChangeEvent, useEffect, useState } from 'react';

import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useQuery } from 'react-query';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';

import Status from '../../components/Status';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ResultRange from '../../components/ResultRange';
import Illustration from './Illustration';
import DefaultLayout from '../../layout/DefaultLayout';

import api from '../../api';
import useAuth from '../../hooks/useAuth';
import queryString from 'query-string';
import undrawEmptyReOpql from '../../images/illustration/undraw_empty_re_opql.svg';
import undrawBugFixingOc7A from '../../images/illustration/undraw_bug_fixing_oc-7-a.svg';
import undrawSkateboardReWe2N from '../../images/illustration/undraw_skateboard_re_we2n.svg';

const breadCrumbItems: any[] = [
  { _id: Math.random().toString(16).slice(2), name: 'Dashboard', path: '/' },
  { _id: Math.random().toString(16).slice(2), name: 'Events', active: true },
];

const ListEvent = () => {
  const [u]: any = useAuth();
  const [term, setTerm] = useState<string>('');
  const [events, setEvents] = useState<any[] | null>(null);
  const [params, setParams] = useState<any>({
    page: 1,
    limit: 10,
  });
  const [pageData, setPageData] = useState<any>({});
  const [hasFirstData, setHasFirstData] = useState<boolean>(true);

  const parsedQs = queryString.parse(location.search);
  const navigate = useNavigate();
  const isFirstRender = useIsFirstRender();
  const debouncedSearchTerm = useDebounce(term, 300);

  const {
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['events', params],
    queryFn: () => api.get('events', { params: { ...params, ...parsedQs }, }),
    onSuccess: (res: any): void  => {
      const { docs, ...dataPage } = res.data;

      if (!term && !docs.length) {
        setHasFirstData(false);
      }

      setEvents(docs.length ? docs : null);
      setPageData(dataPage);
    },
  });

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newLimit: number = +(event.target as HTMLSelectElement).value;

    setParams((): any => ({
      page: Math.ceil(pageData.pagingCounter / newLimit) || 1,
      limit: newLimit,
    }));
  };

  const handlePageChange = (action: string): void => {
    setParams((values: any): any => ({ ...values, page: action === 'next' ? values.page + 1 : values.page - 1 }));
  }

  const handleSearchChange = (event: any): void => {
    setTerm(event.target.value.trim());
  }

  useEffect((): void => {
    if (isFirstRender) {
      return;
    }

    navigate({ pathname: '/events', search: `?page=${params.page}` });
  }, [params]);

  useEffect((): void => {
    if (isFirstRender) {
      return;
    }

    setParams((values: any): any => ({
      ...values, term: term,
      page: 1
    }));
  }, [debouncedSearchTerm]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Events" items={breadCrumbItems} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {u?.role === 'Company' && (
          <div className="border-b border-stroke py-4 px-7.5 dark:border-strokedark flex items-center justify-end">
            <NavLink to="/events/create" className="inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Create an Event</span>
            </NavLink>
          </div>
        )}

        {hasFirstData && (
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between py-6 px-5 sm:px-7.5">
            <div className="inline-flex items-center gap-2 text-sm">
              <select
                id="limit"
                value={params.limit}
                className="py-2.5"
                onChange={handleLimitChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label className="inline-block pb-0.5" htmlFor="limit">entries per page</label>
            </div>
            <input
              type="text"
              value={term}
              onChange={handleSearchChange}
              className="w-full sm:w-64 rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              placeholder="Search"
            />
          </div>
        )}

        <div className={`px-5 sm:px-7.5 ${!(isSuccess && events) && 'py-6'}`}>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[72px] py-4 px-4 font-medium text-black dark:text-white">
                    No.
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    {u?.role === 'Vendor' ? 'Company' : 'Vendor'}
                  </th>
                  <th className="min-w-[148px] py-4 px-4 font-medium text-black dark:text-white">
                    {u?.role === 'Vendor' ? 'Proposed Date' : 'Confirmed Date'}
                  </th>
                  <th className="min-w-[96px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Date Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {events?.map((event, idx) => (
                  <tr key={event._id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {pageData.pagingCounter + idx}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <Link to={`/events/${event._id}`} className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">
                        {event.name}
                      </Link>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{u?.role === "Company" ? event.vendor?.name ?? '-' : event.company?.name ?? '-'}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{
                        u?.role === 'Vendor' ?
                          event.proposedDate1 ? new Date(event.proposedDate1).toLocaleDateString() : '-' :
                          event.confirmedDate ? new Date(event.confirmedDate).toLocaleDateString() : '-'
                      }</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <Status value={event.status} />
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {isError && (
          <div className="mx-auto flex flex-col items-center justify-center w-full py-10 max-w-96">
            <Illustration
              src={undrawBugFixingOc7A}
              title="Oops! Something Went Wrong..."
              message="We encountered a problem while retrieving the data. Our team is already on it, working to resolve the issue. We apologize for any inconvenience caused and appreciate your understanding"
            />
          </div>
        )}

        {isLoading && (
          <div className="mx-auto flex flex-col items-center justify-center w-full py-10 max-w-96">
            <Illustration
              src={undrawSkateboardReWe2N}
              title="Loading Data..."
              message="We're in the process of gathering the requested information. Your patience is appreciated as we work diligently to provide you with the data you need. Thanks for waiting!"
            />
          </div>
        )}

        {isSuccess && !events && (
          <div className="mx-auto flex flex-col items-center justify-center w-full py-10 max-w-96">
            <Illustration
              src={undrawEmptyReOpql}
              title="No Data Available..."
              message="It seems there's no information to display at the moment. Don't worry, we're actively working to gather the relevant data. Stay tuned, and we'll have updates for you soon!"
            />
          </div>
        )}

        {isSuccess && events && (
          <div className="py-8 px-7.5">
            <nav className="flex flex-col gap-4 items-center md:flex-row md:justify-between">
              <ResultRange data={pageData} />

              <ul className="inline-flex gap-3 text-sm">
                <li>
                  <button
                    onClick={() => handlePageChange('previous')}
                    disabled={!pageData?.hasPrevPage}
                    className={`flex items-center justify-center px-5 py-2.5 ms-0 leading-tight text-gray-500 bg-white border rounded hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white font-medium ${!pageData?.hasPrevPage ? 'border-stroke text-[#e2e8f0]' : 'border-gray-300 cursor-not-allowed'}`}
                  >
                    Previous
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={!pageData?.hasNextPage}
                    className={`flex items-center justify-center px-5 py-2.5 leading-tight text-gray-500 bg-white border rounded hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white font-medium ${!pageData?.hasNextPage ? 'border-stroke text-[#e2e8f0]' : 'border-gray-300 cursor-not-allowed'}`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ListEvent;
