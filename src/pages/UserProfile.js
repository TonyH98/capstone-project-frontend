import profilePic from '../assets/profile-pic-1.png'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import InterestsModal from '../components/InterestsModal'

function UserProfile() {
    const navigate = useNavigate()
    const [ openModal, setOpenModal ] = useState(false)

  return (
    <div>
        <div className="w-1/2 mb-10 m-auto">
            <div className='flex'>
                <img src={profilePic} alt='profile-pic' className="w-36 h-36 mr-10" />
                <div className="text-left pr-20">
                    <h1><b>Name (Pronouns)</b></h1>
                    <h2>Username</h2>
                    <h3>Age</h3>
                </div>
                <div className='ml-10'>
                    <p className='text-left'>Bio</p>
                    <textarea></textarea>
                </div>
            </div>
        </div>
        <form className="w-3/4 m-auto pb-10">
            <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto mb-8">
            <legend className="px-3 text-left ml-8">Interests</legend>
                <button 
                    onClick={() => setOpenModal(true)}
                    className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
                >
                    Edit
                </button>
            </fieldset>
            <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto mb-8">
            <legend className="px-3 text-left ml-8">Events</legend>
                <button 
                    onClick={() => navigate('/events')}
                    className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
                >
                    Add
                </button>
            </fieldset>
            <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto">
            <legend className="px-3 text-left ml-8">Hosted Events</legend>
                <button 
                    onClick={() => navigate('/events/new')}
                    className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
                >
                    Create
                </button>
            </fieldset>
        </form>
        {
            openModal ? <InterestsModal setOpenModal={setOpenModal} /> : null
        }
        {/* <div className="w-3/4 m-auto">
            <h2 className="text-left">Events</h2>
            <div className="w-3/4 h-20 border relative shadow-sm">
                <button className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md">
                    Add
                </button>
            </div>
        </div> */}
    </div>
  )
}

export default UserProfile
