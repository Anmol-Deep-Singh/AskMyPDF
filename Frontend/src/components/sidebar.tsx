import UploadFileIcon from '@mui/icons-material/UploadFile';
import callToast from '../hooks/callToast';
import ButtonComp from './ButtonComp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons';
import {useDropzone} from 'react-dropzone';
import { useCallback } from 'react';

const Sidebar = () => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any) => {
    if (acceptedFiles.length > 0) {
        acceptedFiles.forEach((file: any) => {
            console.log(file);
            callToast({ kind: "B", text: `${file.name} Uploaded`, basic: "loading" });
      });
    }
    if (fileRejections.length > 0) {
      fileRejections.forEach((file: any) => {
        console.log(file);
        callToast({ kind: "B", text: `${file.name} is not a valid PDF format`, basic: "error" });
      });
    }
  }, []);
    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
        noClick: true,
        noKeyboard: true,
        onDrop,
        accept: {
        "application/pdf": [".pdf"],
        },
        multiple: false,  
    }
    );
  return (
    <div className='w-[clamp(240px,20vw,280px)] h-full flex flex-col justify-start p-4  bg-[var(--navbar)] border-r-2 border-[var(--border)]'>
        <div  {...getRootProps({className: 'dropzone'})} className='w-full h-[200px] p-6 bg-transparent border-2 border-dashed border-[var(--borderdrag)] text-center flex flex-col justify-center items-center rounded-2xl' >
            <input {...getInputProps()} />
            <UploadFileIcon sx={{ fontSize: 48}}/>
            <h3 className=' text-[16px] font-[700] w-full'>Drag & Drop or Browze</h3>
            <h2 className=' text-[14px] font-[500]'>PDF only</h2>
            <ButtonComp
                kind={"B"}
                color={"bg-[var(--projectbut)] font-[600] text-[var(--text1)]"}
                height={"h-[32px] mt-[16px]"} 
                width={"w-[118px]"}   
                hovercolor={"hover:bg-blue-500"}      
                bordercolor={"border border-transparent"}    
                text={"Browse files"}
                onClick={()=>{
                    open();
                    console.log(acceptedFiles)
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