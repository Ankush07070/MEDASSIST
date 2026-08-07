type InputProps = {
    label: string;
    type?: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
};

function Input({
    label,
    type = "text",
    value,
    onChange,
}: InputProps) {
    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full border rounded-lg p-3"
            />
        </div>
    );
}

export default Input;