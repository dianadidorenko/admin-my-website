interface InputFieldProps {
  value: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const InputTextField: React.FC<InputFieldProps> = ({
  value,
  name,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
      placeholder={placeholder}
      required={required}
    />
  );
};

export default InputTextField;
