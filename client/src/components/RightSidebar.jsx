import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

    const {selectedUser, messages} = useContext(ChatContext)
    const {logout, onlineUsers} = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    // Get all the images from the messages and set them to state
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg=>msg.image)
        )
    },[messages])

  return selectedUser && (
    <div className={`bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm text-white w-full relative overflow-y-scroll border-l border-white/10 ${selectedUser ? "max-md:hidden" : ""}`}>

        <div className='pt-16 flex flex-col items-center gap-3 text-xs font-light mx-auto'>
            <div className='relative'>
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
                className='w-24 aspect-[1/1] rounded-full ring-4 ring-white/20 shadow-2xl' />
                {onlineUsers.includes(selectedUser._id) && <span className='absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-4 border-gray-900'></span>}
            </div>
            <h1 className='px-10 text-xl font-semibold mx-auto'>
                {selectedUser.fullName}
            </h1>
            <p className='px-10 mx-auto text-center text-gray-300 text-sm leading-relaxed'>{selectedUser.bio}</p>
        </div>

        <hr className="border-white/20 my-6 mx-4"/>

        <div className="px-5 text-sm">
            <p className='font-semibold mb-3'>Shared Media</p>
            <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-3'>
                {msgImages.map((url, index)=>(
                    <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-lg'>
                        <img src={url} alt="" className='h-full w-full object-cover border border-white/10 rounded-xl'/>
                    </div>
                ))}
            </div>
        </div>

        <button onClick={()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none text-sm font-medium py-3 px-16 rounded-full cursor-pointer shadow-lg transition-all hover:scale-105'>
            Logout
        </button>
    </div>
  )
}

export default RightSidebar
