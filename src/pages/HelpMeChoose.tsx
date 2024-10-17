import useFormValidation from "../hooks/useFormValidation"
import Select from 'react-select'
import { reactSelectStyles } from "../utils/reactSelectStyles";
import { useQueries } from "@tanstack/react-query";
import { getBrandOptions, getLevelOptions, getTechniquesOptions } from "../services/selectorService";
import useErrorStore from "../store/useErrorStore";
import { useState } from "react";
import { getRandomProject } from "../services/projectService";
import RandomProjectPopup from "../components/RandomProjectPopup";
import { useNavigate } from "react-router-dom";

interface Values {
  level?: number,
  technique?: number,
  priority?: boolean,
  brand?: number
}

interface Option {
  label: string,
  id: number,
  value?: number
}

interface RandomProject {
  id: number,
  name: string,
  lastUpdate: Date
}

interface Date {
  date: string,
  timezone_type?: string,
  timezone?: string
}

const HelpMeChoose = () => {

  const initialValues: Values = {};
  const emptyRandomProject = {id: 0,
    name: "",
    lastUpdate: {
      date: ""
    }};
  const setError = useErrorStore((state) => state.setError);
  const [randomProject, setRandomProject] = useState<RandomProject>(emptyRandomProject)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [
    { data: levelOptions, error: levelError },
    { data: techniqueOptions, error: techniqueError },
    { data: brandOptions, error: brandError }
  ] = useQueries({
    queries: [
      {
        queryKey: ['levelOptions'],
        queryFn: () => getLevelOptions()
      },
      {
        queryKey: ['techniqueOptions'],
        queryFn: () => getTechniquesOptions()
      },
      {
        queryKey: ['brandOptions'],
        queryFn: () => getBrandOptions()
      }
    ]
  }) as [
      { data: Option[] | undefined, error: Error },
      { data: Option[] | undefined, error: Error },
      { data: Option[] | undefined, error: Error }
    ];

  [levelError, techniqueError, brandError].map(error => {
    setError(error?.message);
  })

  const { formValues, handleReactSelectChange, handleInputChange } = useFormValidation(initialValues)

  const handleGetRandomProject = async () => {
    let data = await getRandomProject(formValues);
    setRandomProject(data);
    setIsModalOpen(true);
  }

  const handleClosePopup = () => {
    setRandomProject(emptyRandomProject);
    setIsModalOpen(false);
  }

  return (
    <div className='text-offWhite font-display flex justify-center items-center gap-x-10 mt-20'>
      <div className="w-1/3">
        <div className="flex gap-x-3 items-center mb-5">
          <div onClick={() => navigate(`/feed`)} className="hover:text-lightTeal transition-all duration-100 hover:cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
          <div className="text-6xl uppercase text-lightTeal">What Do I Paint?</div>
        </div>
        <div className="mb-5">Choose the parameters to pick your random project</div>
        <div className="mb-5 w-1/2">
          <p className="text-lightTeal uppercase font-light pb-1">Level</p>
          <Select
            options={levelOptions}
            onChange={handleReactSelectChange('level')}
            value={levelOptions?.find(option => option.id === formValues.level)}
            unstyled
            classNames={reactSelectStyles}
            isClearable
          />
        </div>
        <div className="mb-5 w-1/2">
          <p className="text-lightTeal uppercase font-light pb-1">Technique</p>
          <Select
            options={techniqueOptions}
            onChange={handleReactSelectChange('technique')}
            value={techniqueOptions?.find(option => option.id === formValues.technique)}
            unstyled
            classNames={reactSelectStyles}
            isClearable
          />
        </div>
        <div className="mb-5 w-1/2">
          <p className="text-lightTeal uppercase font-light pb-1">Brand</p>
          <Select
            options={brandOptions}
            onChange={handleReactSelectChange('brand')}
            value={brandOptions?.find(option => option.id === formValues.brand)}
            unstyled
            classNames={reactSelectStyles}
            isClearable
          />
        </div>
        <div className="mt-10 flex flex-col justify-center items-center w-1/2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="priority"
              checked={formValues.priority}
              onChange={handleInputChange}
              className="form-checkbox h-5 w-5 text-teal hover:cursor-pointer"
            />
            <span className="font-display text-lightTeal uppercase font-light">Priority</span>
          </label>
        </div>
      </div>
      <div
        onClick={handleGetRandomProject}
        className="w-1/3 flex justify-center text-lightTeal hover:text-offWhite transition-colors ease-in-out duration-200 hover:cursor-pointer relative"
      >
        <div className="rounded-full border border-lightTeal inner-border-offWhite transition-colors ease-in-out duration-200 w-1/2 aspect-square flex items-center justify-center bg-darkGrey">
          <div className="lg:text-9xl sm:text-8xl font-light rounded-full">?</div>
        </div>
      </div>
      <RandomProjectPopup isOpen={isModalOpen} onClose={handleClosePopup} projectData={randomProject} projectParams={formValues} />
    </div>
  )
}

export default HelpMeChoose