// User profile page that displays user information, interests, events and hosted events
// NEED TO set up correct routes for useNavigate on button click for categories and store category object with id
// NEED TO add put requests to update user info on edit
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import profilePic from '../assets/profile-pic-1.png'
import InterestsModal from '../components/InterestsModal'
import axios from 'axios'

const API = process.env.REACT_APP_API_URL

function UserProfile() {
    const navigate = useNavigate()
    const [ openModal, setOpenModal ] = useState(false)

    // useState hook to store selected interests
    const [ categories, setCategories ] = useState([])
    const [ isSelected, setIsSelected ] = useState([])

    const sortedList = isSelected.sort() 

    // useEffect makes get request for all categories and is used in the interests field
    useEffect(() => {
        axios
          .get(`${API}/category`)
          .then((res) => {
            setCategories(res.data);
        })
        .catch((c) => console.warn("catch, c"));
    }, []);
    
console.log(categories)

  return (
    <div>
        <div className="mb-10 m-auto">
            <div className='flex justify-center gap-x-10'>
                <img src={profilePic} alt='profile-pic' className="w-36 h-36" />
                <div className="text-left">
                    <h1><b>Firstname Lastname</b></h1>
                    <h2>(Pronouns)</h2>
                    <h2>Username</h2>
                    <h3>Age</h3>
                </div>
                <div className=''>
                    <p className='text-left'>Bio</p>
                    <textarea name='bio' id='bio' col='25' rows='3' placeholder='Insert bio'></textarea>
                </div>
            </div>
        </div>
        <form className="w-3/4 m-auto pb-10">
            <fieldset className={`w-3/4 border relative shadow-sm m-auto mb-8 ${!isSelected.length ? 'h-20' : null}`}>
                <legend className="px-3 text-left ml-8">Interests</legend>
                <div>
                    <div className='flex flex-wrap ml-10 mt-3 pr-24 mb-3'>
                        {
                            sortedList.map((item, index) => {
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        // onClick={() => navigate(`\events\:${item}`)}
                                        className="inline text-white bg-blue-500 hover:bg-blue-800 text-xs rounded-full text-sm px-5 py-1.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        {item}
                                    </button>
                                )
                            })
                        }
                    </div>
                    <button 
                        type='button'
                        onClick={() => setOpenModal(!openModal)}
                        className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
                    >
                        Edit
                    </button>
                </div>
            </fieldset>
                {
                    openModal ? 
                        <InterestsModal
                            categories={categories} 
                            openModal={openModal} 
                            setOpenModal={setOpenModal}
                            isSelected={isSelected}
                            setIsSelected={setIsSelected}
                        /> 
                        : null
                }
            <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto mb-8">
                <legend className="px-3 text-left ml-8">Events</legend>
                <div>
                    <button 
                        onClick={() => navigate('/events')}
                        className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
                    >
                        Add
                    </button>
                </div>
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
    </div>
  )
}

export default UserProfile
