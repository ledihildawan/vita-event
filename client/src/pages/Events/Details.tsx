import * as yup from "yup";

import { Controller, useForm } from 'react-hook-form';

import { toast } from "react-toastify";
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from "react-modal"
import Status from "../../components/Status";
import Select from '../../components/Select';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';


import api from "../../api";
import useAuth from "../../hooks/useAuth";

const breadCrumbItems: any[] = [
  { _id: Math.random().toString(16).slice(2), name: 'Events', path: '/events' },
  { _id: Math.random().toString(16).slice(2), name: 'Details', active: true },
];

const EventDetails = () => {
  const { id } = useParams();

  const [u]: any = useAuth();
  const [event, setEvent] = useState<any>();
  const [proposedDates, setProposedDates] = useState<any>();
  const [visibleModalReject, setVisibleModalReject] = useState<boolean>(false);
  const [visibleModalApprove, setVisibleModalApprove] = useState<boolean>(false);

  const navigate = useNavigate();

  const { isLoading, refetch } = useQuery({
    queryFn: () => api.get(`events/${id}`),
    onSuccess: (res: any): void =>{
      if (res.data.company._id !== u?.company?._id && u?.role === "Company") {
        navigate(-1);

        return;
      }

      setEvent(res.data);
      setProposedDates([
        {
          _id: Math.random().toString(16).slice(2),
          name: new Date(res.data.proposedDate1).toLocaleDateString(),
          value: res.data.proposedDate1
        },
        {
          _id: Math.random().toString(16).slice(2),
          name: new Date(res.data.proposedDate2).toLocaleDateString(),
          value: res.data.proposedDate2
        },
        {
          _id: Math.random().toString(16).slice(2),
          name: new Date(res.data.proposedDate3).toLocaleDateString(),
          value: res.data.proposedDate3
        },
      ]);
    }
  });

  const formDataApprove: any = useForm<any>({
    defaultValues: {
      vendor: u?.vendor?._id,
      confirmedDate: '',
    },
    resolver: yupResolver(yup.object({
      confirmedDate: yup.date().required(),
    })),
  });

  const formDataReject: any = useForm<any>({
    defaultValues: {
      vendor: u?.vendor?._id,
      remarks: '',
    },
    resolver: yupResolver(yup.object({
      remarks: yup.string().required('Remarks is required'),
    })),
  });

  const mutApprove: any = useMutation({
    onSuccess: (): void => {
      setVisibleModalApprove(false);

      toast.success("Event Approved!");

      refetch();
    },
    mutationFn: (): Promise<any> => api.put(`events/${event._id}/approve`, formDataApprove.getValues()),
  });

  const mutReject: any = useMutation({
    onSuccess: (): void => {
      setVisibleModalReject(false);

      toast.success("Event Rejected");

      refetch();
    },
    mutationFn: (): Promise<any> => api.put(`events/${event._id}/reject`, formDataReject.getValues()),
  });

  const handleCancel = (type: string): void => {
    if (type === 'reject') {
      setVisibleModalReject(false);

      formDataReject.reset();
      formDataReject.clearErrors();
    }

    if (type === 'approve') {
      setVisibleModalApprove(false);

      formDataApprove.reset();
      formDataApprove.clearErrors();
    }
  }

  const handleSubmit = (type: string) => {
    if (type === 'reject') {
      formDataReject.handleSubmit(mutReject.mutate)();
    }

    if (type === 'approve') {
      formDataApprove.handleSubmit(mutApprove.mutate)();
    }
  };

  const handleSelectChange = (
    type: string,
    { name, value }: { name: string, value: any}
  ): void => {
    if (type === 'reject') {
      formDataReject.setValue(name, value);
      formDataReject.clearErrors(name);
    }

    if (type === 'approve') {
      formDataApprove.setValue(name, value);
      formDataApprove.clearErrors(name);
    }
  };

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Event Details" items={breadCrumbItems} />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {u?.role === 'Vendor' && !isLoading && event?.status === 'Pending' && (
            <div className={`gap-4 border-b border-stroke py-4 px-7.5 dark:border-strokedark flex items-center justify-end`}>
              <button
                className="inline-flex items-center gap-1 text-white bg-red-700 hover:bg-red-800 focus:ring-4 font-medium rounded text-sm py-2.5 px-5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                onClick={() => setVisibleModalReject(true)}
              >
                Reject
              </button>
              <button
                className="inline-flex items-center gap-1 text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded text-sm py-2.5 px-5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                onClick={() => setVisibleModalApprove(true)}
              >
                Approve
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between py-4 px-5 sm:px-7.5">
            <div className="w-full xl:w-1/2">
              <div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Name</p>
                <p className="text-black dark:text-white font-semibold">{event?.name ?? '-'}</p>
              </div>
              <div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Location</p>
                <p className="block text-black dark:text-white font-semibold">{event?.location ?? '-'}</p>
              </div>
              <div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Proposed Date - 1</p>
                <p className={`block text-black dark:text-white font-semibold ${event?.isConfrimed && event?.confirmedDate !== event?.proposedDate1 && 'line-through'}`}>{event?.proposedDate1 ? new Date(event?.proposedDate1).toLocaleDateString() : '-'}</p>
              </div>
              <div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Proposed Date - 2</p>
                <p className={`block text-black dark:text-white font-semibold ${event?.isConfrimed && event?.confirmedDate !== event?.proposedDate2 && 'line-through'}`}>{event?.proposedDate2 ? new Date(event?.proposedDate2).toLocaleDateString() : '-'}</p>
              </div>
              <div className="sm:mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Proposed Date - 3</p>
                <p className={`block text-black dark:text-white font-semibold ${event?.isConfrimed && event?.confirmedDate !== event?.proposedDate3 && 'line-through'}`}>{event?.proposedDate3 ? new Date(event?.proposedDate3).toLocaleDateString() : '-'}</p>
              </div>
            </div>
            <div className="w-full xl:w-1/2">
              {u?.role === "Vendor" && (<div className="mb-4.5">
              <p className="mb-2.5 block text-black dark:text-white text-sm">Company</p>
                <p className="block text-black dark:text-white font-semibold">{event?.company?.name ?? '-'}</p>
              </div>
            )}
              {u?.role === "Company" && (<div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Vendor</p>
                <p className="block text-black dark:text-white font-semibold">{event?.vendor?.name ?? '-'}</p>
              </div>)}

              <div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Created At</p>
                <p className="block text-black dark:text-white font-semibold">{event?.createdAt ? new Date(event?.createdAt).toLocaleString() : '-'}</p>
              </div>

              {event?.status === 'Approved' && (
                <>
                  <div className="mb-4.5">
                    <p className="mb-2.5 block text-black dark:text-white text-sm">Approved At</p>
                    <p className="block text-black dark:text-white font-semibold">{event?.approvedAt ? new Date(event?.approvedAt).toLocaleString() : '-'}</p>
                  </div>
                  <div className="mb-4.5">
                    <p className="mb-2.5 block text-black dark:text-white text-sm">Confirmed Date</p>
                    <div className="flex items-start gap-1.5">
                      <p className="block text-black dark:text-white font-semibold">{event?.confirmedDate ? new Date(event?.confirmedDate).toLocaleDateString() : '-'}</p>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 stroke-[#C0C0C0]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>
                    </div>
                  </div>
                </>
              )}

              {event?.status === 'Rejected' && (
                <>
                  <div className="mb-4.5">
                    <p className="mb-2.5 block text-black dark:text-white text-sm">Rejected At</p>
                    <p className="block text-black dark:text-white font-semibold">{event?.rejectedAt ? new Date(event?.rejectedAt).toLocaleString() : '-'}</p>
                  </div>
                  <div className="mb-4.5">
                    <p className="mb-2.5 block text-black dark:text-white text-sm">Remarks</p>
                    <p className="block text-black dark:text-white font-semibold">{event?.remarks ?? '-'}</p>
                  </div>
                </>
              )}

              <div className="mb-4.5">
                <p className="mb-2.5 block text-black dark:text-white text-sm">Status</p>
                {event?.status ? <Status value={event?.status} /> : <p className="block text-black dark:text-white font-semibold">-</p>}
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>

      {u?.role === 'Vendor' && (
        <>
          <Modal
            style={{
              overlay: {
                zIndex: 9999,
                position: 'fixed',
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '560px',
                marginRight: '-50%',
              },
            }}
            isOpen={visibleModalApprove}
            ariaHideApp={false}
          >
            <div className="flex gap-4 justify-between border-b pb-[20px] border-stroke">
              <h3 className="text-xl font-semibold dark:text-white text-black">Approve</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => handleCancel('approve')}
              >
                <svg className="size-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                </svg>
              </button>
            </div>

            <form action="#" className="py-6.5">
              <div className="mb-6">
                <Select
                  label="Confirm Date"
                  name="confirmedDate"
                  options={proposedDates}
                  required={true}
                  onChange={(data) => { handleSelectChange('approve', data) }}
                  placeholder="Select confirm date"
                />
                {formDataApprove.formState.errors?.confirmedDate && <div className="text-sm text-red-500">Confirm Date is required</div>}
              </div>
            </form>

            <div className="flex gap-4 justify-end border-t pt-[20px] border-stroke">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                onClick={() => handleCancel('approve')}
              >Cancel</button>
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                onClick={() => handleSubmit('approve')}
              >Submit</button>
            </div>
          </Modal>

          <Modal
            style={{
              overlay: {
                zIndex: 9999,
                position: 'fixed',
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '560px',
                marginRight: '-50%',
              },
            }}
            isOpen={visibleModalReject}
            ariaHideApp={false}
          >
            <div className="flex gap-4 justify-between border-b pb-[20px] border-stroke">
              <h3 className="text-xl font-semibold dark:text-white text-black">Reject</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => handleCancel('reject')}
              >
                <svg className="size-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                </svg>
              </button>
            </div>

            <form className="py-6.5">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Remarks <span className="text-meta-1">*</span>
                </label>
                <Controller
                  name="remarks"
                  control={formDataReject.control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={6}
                      className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none ${formDataReject.formState.errors?.remarks ? 'border-red-500' : 'border-stroke'}`}
                      placeholder="Type your remarks"
                    ></textarea>
                  )}
                />
                {formDataReject.formState.errors?.remarks && <div className="mt-2 text-sm text-red-500">{formDataReject.formState.errors?.remarks.message}</div>}
              </div>
            </form>

            <div className="flex gap-4 justify-end border-t pt-[20px] border-stroke">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                onClick={() => handleCancel('reject')}
              >Cancel</button>
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                onClick={() => handleSubmit('reject')}
              >Submit</button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default EventDetails;
