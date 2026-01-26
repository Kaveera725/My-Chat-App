import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext)

    const [input, setInput] = useState(false)

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm h-full p-5 overflow-y-scroll text-white border-r border-white/10 ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="logo" className='max-w-40' />
            <div className="relative py-2 group">
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer hover:opacity-80 transition-opacity' />
                <div className='absolute top-full right-0 z-20 w-40 p-4 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl text-gray-100 hidden group-hover:block'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm hover:text-indigo-400 transition-colors py-2'>Edit Profile</p>
                    <hr className="my-2 border-t border-white/10" />
                    <p onClick={()=> logout()} className='cursor-pointer text-sm hover:text-red-400 transition-colors py-2'>Logout</p>
                </div>
            </div>
        </div>

        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center gap-2 py-3 px-4 mt-5 hover:bg-white/10 transition-all'>
            <img src={assets.search_icon} alt="Search" className='w-3 opacity-60'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-gray-400 flex-1' placeholder='Search User...'/>
        </div>

      </div>

    <div className='flex flex-col gap-1'>
        {filteredUsers.map((user, index)=>(
            <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=> ({...prev, [user._id]:0}))}}
             key={index} className={`relative flex items-center gap-3 p-3 pl-4 rounded-xl cursor-pointer max-sm:text-sm transition-all hover:bg-white/10 ${selectedUser?._id === user._id ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 shadow-lg' : ''}`}>
                <div className='relative'>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[40px] aspect-[1/1] rounded-full ring-2 ring-white/20'/>
                    {onlineUsers.includes(user._id) && <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900'></span>}
                </div>
                <div className='flex flex-col leading-5 flex-1'>
                    <p className='font-medium'>{user.fullName}</p>
                    {
                        onlineUsers.includes(user._id)
                        ? <span className='text-green-400 text-xs font-light'>Online</span>
                        : <span className='text-gray-400 text-xs font-light'>Offline</span>
                    }
                </div>
                {unseenMessages[user._id] > 0 && <p className='text-xs h-6 w-6 flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold shadow-lg'>{unseenMessages[user._id]}</p>}
            </div>
        ) )}
    </div>

    </div>
  )
}

export default Sidebar
