import UploadFileIcon from '@mui/icons-material/UploadFile';
import ButtonComp from './ButtonComp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className='w-[clamp(240px,20vw,280px)] h-full flex flex-col justify-start p-4 bg-blue-800'>
        <div className='w-full h-[200px] p-6 bg-transparent border-2 border-dashed border-orange-500 rounded-lg text-center flex flex-col justify-center items-center' >
            <UploadFileIcon sx={{ fontSize: 48}}/>
            <h3 className=' text-[16px] font-[700] w-full'>Drag & Drop or Browze</h3>
            <h2 className=' text-[14px] font-[500]'>PDF only</h2>
            <ButtonComp
                kind={"B"}
                color={"transparent"}
                height={"h-[32px] mt-[16px]"} 
                width={"w-[110px]"}   
                hovercolor={"hover:bg-[var(--inputbox)]"}      
                bordercolor={"border border-transparent"}    
                text={"Browse files"}
                onClick={()=>{
                    console.log("first")
                }}        
            />
        </div>
        <h2 className='text-[18px] font-[800] w-full mt-[20px] mb-[10px]'>Uploaded pdf are</h2>
        <div className=''>
            <button className='w-full h-[40px] flex flex-row justify-start items-center p-[8px]'>
                <FontAwesomeIcon icon={faFile} className="text-[24px]"/>
                <h4 className='ml-[12px] text-[16px] font-[500]'>File number 1</h4>
            </button>
        </div>
    </div>
  )
}

export default Sidebar