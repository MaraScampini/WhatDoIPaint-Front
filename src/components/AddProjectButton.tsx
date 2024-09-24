import { useNavigate } from "react-router-dom"

const AddProjectButton = () => {
    const navigate = useNavigate();
    const handleAddProject = () => {
        navigate('/create');
    }

    const handleWhatDoIPaint = () => {
        navigate('/help-me-choose');
    }

    return (
        <div className="text-lightTeal fixed bottom-4 right-4 flex flex-col justify-center items-center">
            <button onClick={handleWhatDoIPaint}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-12 hover:stroke-offWhite transition-colors duration-300 hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
            </button>

            <button onClick={handleAddProject}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-20 hover:stroke-offWhite transition-colors duration-300 hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
        </div>
    )
}

export default AddProjectButton

