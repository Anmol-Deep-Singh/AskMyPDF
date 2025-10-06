import type { ReactNode, MouseEventHandler } from "react";

type ButtonProp = {
  type?: "submit" | "reset" | "button",
  kind: string;
  color: string;
  bordercolor?: string;
  mainimage?: ReactNode;
  leftimage?: ReactNode;
  rightimage?: ReactNode;
  text?: string;
  height?: string;
  width?: string;
  hovercolor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;       
  onDoubleClick?: MouseEventHandler<HTMLButtonElement>; 
};

const ButtonComp: React.FC<ButtonProp> = ({
  type,
  kind,
  color,
  bordercolor,
  mainimage,
  leftimage,
  rightimage,
  text,
  height,
  width,
  hovercolor,
  onClick,
  onDoubleClick,
}) => {
  const BaseStyle = `flex flex-row items-center justify-center ml-[5px] p-2 border-2 border-solid
    hover:scale-[1.01] transition-transform duration-200 rounded-[8px] cursor-pointer`;

  switch (kind) {
    // 
    case "A":
      return (
        <button
          type={type}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={`${BaseStyle} ${height} ${width} ${hovercolor} text-[14px] font-[600] ${color} ${bordercolor}`}
        >
          {leftimage && <div>{leftimage}</div>}
          {mainimage && <div className="mx-[4px]">{mainimage}</div>}
          {text && <div className="">{text}</div>}
          {rightimage && <div>{rightimage}</div>}
        </button>
      );
    case "B":
      return(
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={`${BaseStyle} ${height} ${width} ${hovercolor} text-xs font-[400] ${color} ${bordercolor}`}
          style={{ borderStyle: "solid" }}
        >
          {text && <div className="text-[16px]">{text}</div>}
        </button>
      )
    default:
      return (
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={`${BaseStyle} ${height} ${width} text-xs font-[400] ${color} ${bordercolor}`}
        >
          {leftimage && <div>{leftimage}</div>}
          {mainimage && <div className="mx-[4px]">{mainimage}</div>}
          {text && <div className="ml-[6px]">{text}</div>}
          {rightimage && <div>{rightimage}</div>}
        </button>
      );
  }
};

export default ButtonComp;
