import UploadFileIcon from '@mui/icons-material/UploadFile';
import callToast from '../hooks/callToast';
import ButtonComp from './ButtonComp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faTrash,faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { fetchdata } from '../hooks/fetchdata';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../lib/AppContext";


const URL = "http://localhost:3000/api/pdf/";

const Sidebar = () => {
  const {mode,setmode} = useAppContext();
  const navigate = useNavigate();
  const [PDFarr, SetPDFarr] = useState<any[]>([]);
  const { currentPDF, setCurrentPDF } = useAppContext();

  const toAuth = () => {
    callToast({ kind: "B", text: "Unexpected error during upload", basic: "error" });
    localStorage.setItem("token", "");
    navigate("/auth");
  };

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any) => {
    try {
      if (acceptedFiles.length > 0) {
        for (const file of acceptedFiles) {
          const token = localStorage.getItem("token") || "";
          if (!token) toAuth();

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

          if (error) {
            console.error("Upload failed:", error);
            callToast({ kind: "B", text: "Upload failed", basic: "error" });
          } else {
            console.log("Upload success:", data);
            await fill(); // refresh list
          }
        }
      }

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
      callToast({ kind: "B", text: "Unexpected error during upload", basic: "error" });
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const fill = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const promise = fetchdata({
          method: "GET",
          URL: URL + "pdfarr",
          headers: { token },
        });

        const { data, error } = await promise;
        if (!error) {
          // invert order (latest first)
          const invertedList = [...data.pdflist].reverse();
          SetPDFarr(invertedList);

          // auto-select latest if available
          if (invertedList.length > 0) {
            setCurrentPDF(invertedList[0]);
          }
        } else {
          console.log(error);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toAuth();
    }
  };

  const deletepdf = async ({ id }: { id: string }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const promise = fetchdata({
          method: "POST",
          URL: URL + "deletepdf",
          body: { PDFid: id },
          headers: { token },
        });
        callToast({ kind: "A", promise });
        await fill(); // refresh list after delete
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fill();
  }, []);

  return (
    <div className="min-w-[280px] max-w-[280px] h-full flex flex-col justify-start pt-4 pr-4 pl-4 bg-[var(--navbar)] border-r-2 border-[var(--border)]">
      <div className="flex-1">
        {/* Upload Box */}
        <div
          {...getRootProps({ className: "dropzone" })}
          className="w-full h-[200px] p-6 bg-transparent border-2 border-dashed border-[var(--borderdrag)] text-center flex flex-col justify-center items-center rounded-2xl"
        >
          <input {...getInputProps()} type="file" />
          <UploadFileIcon sx={{ fontSize: 48 }} />
          <h3 className="text-[16px] font-[700] w-full">Drag & Drop or Browse</h3>
          <h2 className="text-[14px] font-[500]">PDF only</h2>
          <ButtonComp
            type="button"
            kind="B"
            color="bg-[var(--projectbut)] font-[600] text-[var(--text1)]"
            height="h-[32px] mt-[16px]"
            width="w-[118px]"
            hovercolor="hover:bg-blue-500"
            bordercolor="border border-transparent"
            text="Browse files"
            onClick={() => open()}
          />
        </div>

        {/* PDF List */}
        <h2 className="text-[18px] font-[800] w-full mt-[20px] mb-[10px]">Uploaded PDFs</h2>
        <div className="w-full flex flex-col justify-start overflow-y-scroll hide-scrollbar max-h-[320px]">
          {PDFarr.map((file: any, index) => (
            <div
              key={index}
              className={`group w-full h-[40px] flex flex-row justify-between items-center rounded-2xl mb-[10px] 
              ${currentPDF?._id === file._id ? "bg-blue-100" : "hover:bg-orange-500"}`}
            >
              <div className="h-full flex-1 flex flex-row justify-start items-center">
                <button
                  onClick={() => setCurrentPDF(file)}
                  className="w-full h-full flex flex-row justify-start items-center"
                >
                  <FontAwesomeIcon icon={faFile} className="text-[20px] h-full flex flex-row justify-center items-center" />
                  <p className="ml-[2px] text-[16px] font-[500] max-w-[180px] min-w-[180px] h-[40px] flex items-center truncate">
                    {file.filename.replace(/\.pdf$/i, "").length > 25
                      ? file.filename.replace(/\.pdf$/i, "").slice(0, 25) + "..."
                      : file.filename.replace(/\.pdf$/i, "")}
                  </p>
                </button>

                <div className="hidden group-hover:block">
                  <ButtonComp
                    kind="A"
                    type="button"
                    mainimage={<FontAwesomeIcon icon={faTrash} className="hover:text-red-500 p-1" />}
                    color="bg-transparent"
                    height="h-[32px]"
                    width="w-[32px]"
                    bordercolor="border-transparent"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent selecting row when deleting
                      deletepdf({ id: file._id });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-200 h-[70px] flex flex-row justify-center items-center">
          <ButtonComp
              kind={"A"}
              color={"transparent"}
              height={"h-[46px]"} 
              width={"w-[134px]"}   
              hovercolor={"hover:bg-[var(--inputbox)]"}      
              bordercolor={"border border-transparent"}
              leftimage={mode ==="Chat"?<FontAwesomeIcon icon={faClockRotateLeft} className='mr-[4px]'/>:""}    
              text={mode === "Chat"?"Show History":"Chat with PDF"}
              onClick={()=>{
                if(mode === "Chat"){
                  setmode("History");
                }else{
                  setmode("Chat");
                }
              }}        
            />
      </div>
    </div>
  );
};

export default Sidebar;
