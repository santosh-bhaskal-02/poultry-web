


const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      px-4 py-2 font-semibold rounded-lg transition-colors 
      ${className}
      ${
        variant === "outline"
          ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}>
    {children}
  </button>
);

export default Button;
