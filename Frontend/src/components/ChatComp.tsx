import React from 'react'
import ButtonComp from './ButtonComp'

const ChatComp = () => {
  return (
    <div className='bg-green-600 flex-1 flex flex-col justify-start'>
        <div className='flex-1 bg-blue-300 pt-[12px] pl-[64px] pr-[64px]'>chatting</div>
        <div className='bg-blue-800 h-[54px]'>
            <div>
                <input/>
                <ButtonComp
                kind={"A"}
                color={"transparent"}
                height={"h-[32px]"} 
                width={"w-[32px]"}
                hovercolor={"hover:bg-[var(--inputbox)]"}       
                bordercolor={"border-transparent"} 
            />
            </div>
        </div>
    </div>
  )
}

export default ChatComp