import UploadFileIcon from '@mui/icons-material/UploadFile';
import callToast from '../hooks/callToast';
import ButtonComp from './ButtonComp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile,faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { fetchdata } from '../hooks/fetchdata';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../lib/AppContext";


const URL = "http://localhost:3000/api/pdf/";

const Sidebar = () => {
  const navigate = useNavigate();
  const [PDFarr,SetPDFarr] = useState([]); 
  const { setCurrentPDF} = useAppContext();
  const toAuth=()=>{
      callToast({ kind: "B", text: "Unexpected error during upload", basic: "error" });
      localStorage.setItem("token","");
      navigate("/auth");   
  }
  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any) => {
    try {
      // Handle valid files
      if (acceptedFiles.length > 0) {
        for (const file of acceptedFiles) {
          const token = localStorage.getItem("token") || "";
          if (!token) {
            toAuth();
          }
          const formData = new FormData();
          formData.append("pdf", file);
          const promise = fetchdata({
            method: "POST",
            URL: URL + "uploadpdf",
            headers: { token },
            body: formData,
          });
          callToast({ kind: "A", promise });
          const { data, error } = await promise;
          console.log(data);
          if (error) {
            console.error("Upload failed:", error);
            callToast({ kind: "B", text: "Upload failed", basic: "error" });
          } else {
            console.log("Upload success:", data);
            fill();
          }
        }
      }

      // Handle rejections
      if (fileRejections.length > 0) {
        fileRejections.forEach((file: any) => {
          callToast({
            kind: "B",
            text: `${file.name} is not a valid PDF format`,
            basic: "error",
          });
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      callToast({
        kind: "B",
        text: "Unexpected error during upload",
        basic: "error",
      });
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });
  const fill=async()=>{
    try {
      const token = localStorage.getItem("token");
      if(token){
          const promise = fetchdata({
          method: "GET",
          URL: URL + "pdfarr",
          headers: {
            token: token, 
          }
        });
        const { data, error } = await promise;  
        if(!error){
          SetPDFarr(data.pdflist);
        }else{
          console.log(error);
        }
      }else{
        throw new Error();
      }  
    } catch (err) {
        console.error("Unexpected error:", err);
        toAuth();
    }
  }
  const deletepdf = async({ id }: { id: string })=>{
    try {
      const token = localStorage.getItem("token");
      if(token){
          const promise = fetchdata({
          method: "POST",
          URL: URL + "deletepdf",
          body:{
            PDFid:id,
          },
          headers: {
            token: token, 
          }
        });
        callToast({ kind: "A", promise });
      }
      console.log("end")
      fill();
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    fill();
  },[])

  return (
    <div className='w-[clamp(240px,20vw,280px)] h-full flex flex-col justify-start p-4 bg-[var(--navbar)] border-r-2 border-[var(--border)]'>
      <div
        {...getRootProps({ className: 'dropzone' })}
        className='w-full h-[200px] p-6 bg-transparent border-2 border-dashed border-[var(--borderdrag)] text-center flex flex-col justify-center items-center rounded-2xl'
      >
        <input {...getInputProps()} type='file' />
        <UploadFileIcon sx={{ fontSize: 48 }} />
        <h3 className='text-[16px] font-[700] w-full'>Drag & Drop or Browse</h3>
        <h2 className='text-[14px] font-[500]'>PDF only</h2>
        <ButtonComp
          type={"button"}
          kind={"B"}
          color={"bg-[var(--projectbut)] font-[600] text-[var(--text1)]"}
          height={"h-[32px] mt-[16px]"}
          width={"w-[118px]"}
          hovercolor={"hover:bg-blue-500"}
          bordercolor={"border border-transparent"}
          text={"Browse files"}
          onClick={() => {
              open();
          }}
        />
      </div>

      <h2 className='text-[18px] font-[800] w-full mt-[20px] mb-[10px]'>Uploaded pdf are</h2>
      <div>
        {PDFarr.map((file: any,index) => (
          <div key={index} className='w-full h-[40px] flex flex-row justify-between items-center p-[8px]'>
            <div className='flex-1 flex flex-row justify-start items-center p-[8px]'>
                <button onClick={()=>{
                  setCurrentPDF(file);
                }} 
                  className='w-full h-[40px] flex flex-row justify-start items-center p-[8px]'>
                  <FontAwesomeIcon icon={faFile} className="text-[24px]" />
                  <h4 className='ml-[12px] text-[16px] font-[500]'>{file.filename.replace(/\.pdf$/i, "")}</h4>
                </button>
                <ButtonComp
                  kind={"A"}
                  type={"button"}
                  mainimage={<FontAwesomeIcon icon={faTrash} />}
                  color={"bg-transparent"}
                  height={"h-[32px]"} 
                  width={"w-[32px]"}
                  hovercolor={"hover:bg-[var(--inputbox)]"}       
                  bordercolor={"border-transparent"}  
                  onClick={()=>{
                    deletepdf({id:file._id});
                  }}
                />             
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar;
