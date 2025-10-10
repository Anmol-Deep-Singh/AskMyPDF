import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from "../lib/AppContext";
import { useEffect,useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import callToast from '../hooks/callToast';
import { fetchdata } from '../hooks/fetchdata';
import Typewriter from 'typewriter-effect';

const URL = "http://localhost:3000/api/pdf/";
const ChatComp = () => {
    const navigate = useNavigate();
    const inputref = useRef<HTMLInputElement>(null);
    const [Resp,SefResp] = useState("How can i help you");
    const {currentPDF} = useAppContext();
      const toAuth=()=>{
        callToast({ kind: "B", text: "Unexpected error during upload", basic: "error" });
        localStorage.setItem("token","");
        navigate("/auth");   
    }
    const send=async()=>{
        console.log(currentPDF)
        const token = localStorage.getItem("token") || "";
        if (!token) {
            toAuth();
        }
        const query = inputref.current?.value;
        if(!query){
            callToast({ kind: "B", text: "Enter a Prompt", basic: "error" });
        }else{
            const promise = fetchdata({
            method: "POST",
            URL: URL + "chatreply",
            headers: { token },
            body: {
                query:query,
                PDFid:currentPDF?._id,
            },
          });
          callToast({ kind: "A", promise });
          const { data, error } = await promise;
          console.log(data)
          SefResp(data);
        }
    }
    const handleEnter=(e: KeyboardEvent)=>{
        if (e.key === "Enter" && inputref.current?.value != '') {
            e.preventDefault();
            send();
        }
    }
    useEffect(()=>{
        inputref.current?.focus();
        window.addEventListener("keydown", handleEnter);
        return () => window.removeEventListener("keydown", handleEnter);
    },[]);
  return (
    <div className='bg-green-600 flex-1 flex flex-col justify-start'>
        <div className='flex-1 bg-blue-300 pt-[12px] pl-[64px] pr-[64px]'>
            <div className='bg-blue-900 ml-[122px] mr-[122px]'>
                <Typewriter
                    onInit={(typewriter) => {
                        typewriter.typeString(`${Resp}`)
                        .callFunction(() => {
                            console.log('String typed out!');
                        })
                        .pauseFor(2500)
                        .callFunction(() => {
                            console.log('All strings were deleted');
                        })
                        .start();
                    }}
                    />
            </div>
        </div>
        <div className='bg-blue-200 h-[70px] flex flex-row justify-center items-start pl-[64px] pr-[64px]'>
            <div className='w-full bg-orange-200 ml-[122px] mr-[122px] h-[56px] flex flex-row justify-start rounded-full pr-[16px] pl-[32px] border-2 border-blacl'>
                <input
                    ref={inputref}
                    type="text"
                    className="w-full h-[56px] focus:outline-none focus:ring-0 font-[550] text-[20px]"
                    />
                <div className='flex flex-col justify-center items-center '>
                    <button className='h-[36px] w-[36px] bg-green-200 rounded-full ml-[10px] flex flex-row justify-center items-center'
                        onClick={()=>{send()}}
                    >
                        <FontAwesomeIcon icon={faArrowUp}/>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatComp