type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
};

function Button({
    children,
    type = "button",
    onClick,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
            {children}
        </button>
    );
}

export default Button;