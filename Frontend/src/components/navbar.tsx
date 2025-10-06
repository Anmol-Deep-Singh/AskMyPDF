import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines,faSun,faMoon,faBars,faPlus } from '@fortawesome/free-solid-svg-icons';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { useEffect,useState } from 'react';
import ButtonComp from './ButtonComp'
import { useNavigate } from 'react-router-dom';
type NavbarProps = {
  onToggleSidebar: () => void; 
}
const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [Theme,SetTheme] = useState('theme_purple_light light');
  const navigate = useNavigate();
  useEffect(() => {
    document.body.className = Theme;
    localStorage.setItem("Theme",Theme);
  }, [Theme]);    
  return (
    <div className='min-w-screen h-[64px] sticky-top-0 flex flex-row justify-between'>
        <div className='h-[100%] w-auto bg-transparent flex flex-row justify-start items-center'>
            <ButtonComp
                kind={"A"}
                color={"transparent"}
                height={"h-[32px]"} 
                width={"w-[110px]"}      
                bordercolor={"border-transparent"}       
                text={"AskMyPDF"}
                onClick={()=>{console.log("Button is clicked")}}    
                leftimage={<FontAwesomeIcon icon={faFileLines}/>}    
            />
            <ButtonComp
                kind={"A"}
                color={"transparent"}
                height={"h-[32px]"} 
                width={"w-[32px]"}  
                hovercolor={"hover:bg-[var(--inputbox)]"}    
                bordercolor={" border-transparent"}     
                onClick={()=>{onToggleSidebar()}}  
                leftimage={<FontAwesomeIcon icon={faBars} size='lg'/>}    
            />

        </div>
        <div className='h-[100%] w-auto bg-transparent flex flex-row justify-start items-center'>
            <ButtonComp
                kind={"A"}
                color={"transparent"}
                height={"h-[32px]"} 
                width={"w-[32px]"}
                hovercolor={"hover:bg-[var(--inputbox)]"}       
                bordercolor={"border-transparent"}        
                mainimage={Theme ==="theme_purple_light light"?<WbSunnyOutlinedIcon/>:<FontAwesomeIcon icon={faMoon}/>}
                onClick={() =>SetTheme(Theme === "theme_purple_light light"? "theme_purple_dark dark": "theme_purple_light light")   }
            />
            <ButtonComp
                kind={"A"}
                color={"transparent"}
                height={"h-[32px]"} 
                width={"w-[110px]"}   
                hovercolor={"hover:bg-[var(--inputbox)]"}      
                bordercolor={"border border-transparent"}    
                text={"Logout"}
                onClick={()=>{
                    navigate("/auth");
                    localStorage.token = "";
                }}        
            />
        </div>
    </div>
  )
}

export default Navbar