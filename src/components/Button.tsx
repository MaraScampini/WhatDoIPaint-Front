interface ButtonProps {
    buttonType: 'button' | 'submit' | 'reset',
    text: string,
    onClick?: () => void,
    classNames?: string,
    disabled?: boolean
}

const Button = ({ buttonType, text, onClick, classNames = "", disabled = false}: ButtonProps) => {
    return (
        <button 
        type={buttonType} 
        onClick={!disabled ? onClick : undefined}
        className={`w-60 h-12 bg-darkTeal rounded-md flex items-center justify-center mt-8 ${disabled ? ('bg-gray-500 cursor-default') : ('inner-border cursor-pointer')} transitions-all duration-200 ease-in-out ${classNames}`}>
            <p className="font-display text-xl uppercase text-offWhite font-semibold">
                {text}
            </p>
        </button>
    )
}

export default Button