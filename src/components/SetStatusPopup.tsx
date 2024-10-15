
interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    elements: Elements,

}

interface Elements {
    elements: Array<number> | undefined,
    squads: Array<number> | undefined
}



const SetStatusPopup: React.FC<ModalProps> = ({ isOpen, onClose, elements }) => {
    if (!isOpen) return null;

    console.log(elements)

    return (
        <div className="bg-darkBg bg-opacity-75 fixed inset-0 flex items-center justify-center z-40">
            <div className="w-1/2 h-2/5 bg-darkGrey rounded-md
                                flex flex-col items-center justify-center 
                                 text-offWhite font-display uppercase text-3xl 
                                relative
                ">
                <div className="absolute top-5 right-5 text-lightTeal hover:text-offWhite hover:cursor-pointer"
                    onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default SetStatusPopup