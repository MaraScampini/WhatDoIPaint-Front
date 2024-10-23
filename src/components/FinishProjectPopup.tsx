import { markProjectAsFinished } from '../services/projectService';
import useErrorStore from '../store/useErrorStore';
import Button from './Button';

interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    projectId: number
}


const FinishProjectPopup: React.FC<ModalProps> = ({ isOpen, onClose, projectId }) => {
    if (!isOpen) return null;

    const setError = useErrorStore((state) => state.setError);

    const handleSubmitInfo = async () => {
        try {
            await markProjectAsFinished(projectId);
            onClose();
        } catch (error) {
            if(error instanceof Error) {
                setError(error.message)
            } else {
                setError('The project could not be finished')
            }
        }
    }

    return (
        <div className="bg-darkBg bg-opacity-75 fixed inset-0 flex items-center justify-center z-40">

            <div className="w-1/3 h-2/5 bg-darkGrey rounded-md
                                flex flex-col items-center justify-center 
                                 text-offWhite font-display 
                                relative
                ">
                <div className="absolute top-5 right-5 text-lightTeal hover:text-offWhite hover:cursor-pointer"
                    onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div className="w-full flex flex-col justify-center items-center px-12 text-center">
                    <p className='text-3xl text-lightTeal uppercase mb-2'> Finish the project?</p>
                    <p>All elements in the project must be finished before doing this action</p>
                    <p className='uppercase text-red-400 text-xl pt-4'>This action is irreversible</p>
                    <div>
                        <Button text='Finish project' buttonType='button' onClick={handleSubmitInfo} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinishProjectPopup