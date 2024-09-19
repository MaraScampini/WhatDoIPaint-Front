interface InputProps {
    type: string,
    name: string,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ type, name, placeholder, value, onChange } : InputProps) => {
    return (
        <div className="w-full py-3">
            <p className="font-display text-lightTeal uppercase font-light pb-1">{name}</p>
            <input
                className='font-display text-offWhite lowercase bg-darkGrey h-10 rounded-md px-3 w-full'
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default Input