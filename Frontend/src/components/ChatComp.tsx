import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from "../lib/AppContext";

const ChatComp = () => {
    const {currentPDF} = useAppContext();
  return (
    <div className='bg-green-600 flex-1 flex flex-col justify-start'>
        <div className='flex-1 bg-blue-300 pt-[12px] pl-[64px] pr-[64px]'>
            <div className='bg-blue-900 ml-[122px] mr-[122px]'>
                
            </div>
        </div>
        <div className='bg-blue-200 h-[70px] flex flex-row justify-center items-start pl-[64px] pr-[64px]'>
            <div className='w-full bg-orange-200 ml-[122px] mr-[122px] h-[56px] flex flex-row justify-start rounded-full pr-[16px] pl-[32px] border-2 border-blacl'>
                <input
                    type="text"
                    className="w-full h-[56px] focus:outline-none focus:ring-0 font-[550] text-[20px]"
                    />
                <div className='flex flex-col justify-center items-center '>
                    <button className='h-[36px] w-[36px] bg-green-200 rounded-full ml-[10px] flex flex-row justify-center items-center'>
                        <FontAwesomeIcon icon={faArrowUp}/>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatComp