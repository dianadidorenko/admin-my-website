import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  const newClassName = twMerge("px-8 py-2 my-[100px] ", className);
  return <div className={newClassName}>{children}</div>;
};

export default Container;
