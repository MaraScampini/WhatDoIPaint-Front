interface ButtonProps {
    buttonType: 'button' | 'submit' | 'reset',
    text: string,
    onClick?: () => void 
}

const Button = ({ buttonType, text, onClick }: ButtonProps) => {
    return (
        <button 
        type={buttonType} 
        onClick={onClick}
        className="w-60 h-12 bg-darkTeal rounded-md flex items-center justify-center mt-8 cursor-pointer">
            <p className="font-display text-xl uppercase text-offWhite font-semibold">
                {text}
            </p>
        </button>
    )
}

export default Button