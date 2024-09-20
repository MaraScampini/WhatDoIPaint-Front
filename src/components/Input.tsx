interface InputProps {
    type: string,
    name: string,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    maxLength?: number,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const Input = ({ type, name, placeholder, value, onChange, maxLength, onBlur } : InputProps) => {
    return (
        <div className="w-full py-3">
            <p className="font-display text-lightTeal uppercase font-light pb-1">{name}</p>
            <input
                className='font-display text-offWhite bg-darkGrey h-10 rounded-md px-3 w-full'
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                onBlur={onBlur}
            />
        </div>
    )
}

export default Input