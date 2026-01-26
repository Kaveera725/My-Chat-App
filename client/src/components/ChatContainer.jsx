import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, 
        getMessages} = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()

    const [input, setInput] = useState('');

    // Handle sending a message
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(input.trim() === "") return null;
        await sendMessage({text: input.trim()});
        setInput("")
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("select an image file")
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result})
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: "smooth"})
        }
    },[messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative bg-gradient-to-b from-transparent to-black/5'>
      {/* ------- header ------- */}
      <div className='flex items-center gap-3 py-4 px-5 border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-10'>
        <div className='relative'>
            <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-10 h-10 rounded-full ring-2 ring-white/20"/>
            {onlineUsers.includes(selectedUser._id) && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900"></span>}
        </div>
        <div className='flex-1'>
            <p className='text-lg text-white font-medium'>{selectedUser.fullName}</p>
            <p className='text-xs text-gray-400'>{onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}</p>
        </div>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer hover:opacity-70 transition-opacity'/>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5 cursor-pointer hover:opacity-70 transition-opacity'/>
      </div>
      {/* ------- chat area ------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-5 pb-6'>
        {messages.map((msg, index)=>(
            <div key={index} className={`flex items-end gap-3 mb-4 animate-slide-in ${msg.senderId !== authUser._id ? 'justify-start' : 'justify-end'}`}>
                {msg.senderId !== authUser._id && (
                    <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full ring-2 ring-white/10' />
                )}
                <div className={`flex flex-col ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
                    {msg.image ? (
                        <img src={msg.image} alt="" className='max-w-[280px] rounded-2xl shadow-xl border border-white/10 hover:scale-105 transition-transform cursor-pointer'/>
                    ):(
                        <div className={`px-4 py-3 max-w-[280px] rounded-2xl shadow-lg break-words ${msg.senderId === authUser._id ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm' : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-sm border border-white/10'}`}>
                            <p className='text-sm font-light leading-relaxed'>{msg.text}</p>
                        </div>
                    )}
                    <p className='text-xs text-gray-500 mt-1 px-1'>{formatMessageTime(msg.createdAt)}</p>
                </div>
                {msg.senderId === authUser._id && (
                    <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full ring-2 ring-white/10' />
                )}
            </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

{/* ------- bottom area ------- */}
    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-xl border-t border-white/10'>
        <div className='flex-1 flex items-center bg-white/10 backdrop-blur-sm px-4 rounded-full border border-white/20 hover:bg-white/15 transition-all shadow-lg'>
            <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Type a message..." 
            className='flex-1 text-sm py-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'/>
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer hover:opacity-70 transition-opacity"/>
            </label>
        </div>
        <div className='bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg'>
            <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-6" />
        </div>
    </div>


    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt="" />
        <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
