import * as yup from "yup";

import { Controller, useForm } from 'react-hook-form';

import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePicker from '../../components/DatePicker';
import DefaultLayout from '../../layout/DefaultLayout';

import api from "../../api";
import useAuth from "../../hooks/useAuth";

const breadCrumbItems: any[] = [
  { _id: Math.random().toString(16).slice(2), name: 'Events', path: '/events' },
  { _id: Math.random().toString(16).slice(2), name: 'Create', active: true },
];

const CreateEvent = () => {
  const [u]: any = useAuth();

  const navigate = useNavigate();

  const {
    control,
    setValue,
    formState: {
      errors
    },
    getValues,
    clearErrors,
    handleSubmit,
  }: any = useForm<any>({
    defaultValues: {
      name: '',
      company: u?.company?._id,
      location: '',
      proposedDate1: '',
      proposedDate2: '',
      proposedDate3: '',
    },
    resolver: yupResolver(yup.object({
      name: yup.string().required('Name is required'),
      location: yup.string().required('Location is required'),
      proposedDate1: yup.date().required(),
      proposedDate2: yup.date().required(),
      proposedDate3: yup.date().required(),
    })),
  });

  const { mutate, isLoading }: any = useMutation({
    onSuccess: (): void => {
      toast.success("Event Created Successfully!");

      navigate('/events');
    },
    onError: () => {
      toast.error('Request Failed');
    },
    mutationFn: (): Promise<any> => api.post('events', getValues()),
  });

  const handleDatePickerChange = ({ name, value }: any) => {
    setValue(name, value);

    clearErrors(name);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create an Event" items={breadCrumbItems} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form action="#" onSubmit={handleSubmit(mutate)}>
          <div className="p-6.5">
            <div className="flex flex-col gap-2.5 mb-4.5">
              <label className="block text-black dark:text-white">
                Name <span className="text-meta-1">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
                    autoComplete="off"
                    placeholder="Enter event name"
                  />
                )}
              />
              {errors.name && <div className="text-sm text-red-500">{errors.name?.message}</div>}
            </div>

            <div className="flex flex-col gap-4.5 sm:flex-row sm:justify-between">
              <div className="w-full md:w-1/3">
                <div className="flex flex-col gap-2.5 mb-4.5">
                  <DatePicker
                    id="proposedDate1"
                    name="proposedDate1"
                    error={errors.proposedDate1}
                    label="Proposed Date - 1"
                    required={true}
                    onChange={handleDatePickerChange}
                  />
                  {errors.proposedDate1 && <div className="text-sm text-red-500">Purpose Date - 1 is required</div>}
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="flex flex-col gap-2.5 mb-4.5">
                  <DatePicker
                    id="proposedDate2"
                    name="proposedDate2"
                    error={errors.proposedDate2}
                    label="Proposed Date - 2"
                    required={true}
                    onChange={handleDatePickerChange}
                  />
                  {errors.proposedDate2 && <div className="text-sm text-red-500">Purpose Date - 2 is required</div>}
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="flex flex-col gap-2.5 mb-4.5">
                  <DatePicker
                    id="proposedDate3"
                    name="proposedDate3"
                    error={errors.proposedDate3}
                    label="Proposed Date - 3"
                    required={true}
                    onChange={handleDatePickerChange}
                  />
                  {errors.proposedDate3 && <div className="text-sm text-red-500">Purpose Date - 3 is required</div>}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mb-6">
              <label className="block text-black dark:text-white">
                Location <span className="text-meta-1">*</span>
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={6}
                    className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.location ? 'border-red-500' : 'border-stroke'}`}
                    placeholder="Type your location"
                  ></textarea>
                )}
              />
              {errors.location && <div className="mt-2 text-sm text-red-500">{errors.location?.message}</div>}
            </div>

            <button
              disabled={isLoading}
              className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${isLoading && 'opacity-50 cursor-not-allowed'}`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CreateEvent;
