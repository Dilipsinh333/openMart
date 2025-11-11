interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

const Button = ({ children, onClick, type = "button" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      {children}
    </button>
  );
};

export default Button;
