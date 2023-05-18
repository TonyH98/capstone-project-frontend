// User profile page that displays user information, interests, events and hosted events
// NEED TO set up correct routes for useNavigate on button click for categories and store category object with id
// NEED TO add post/put requests to update user info on edit
import axios from 'axios'
import profilePic from '../assets/profile-pic-1.png'
import InterestsModal from '../components/InterestsModal'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { ImQuotesLeft } from 'react-icons/im'
import { ImQuotesRight } from 'react-icons/im'


const API = process.env.REACT_APP_API_URL

function UserProfile() {
    const navigate = useNavigate()
    const { username } = useParams()
    const [ openInterestModal, setOpenInterestModal ] = useState(false)
    const [ openEditModal, setOpenEditModal ] = useState((false))
    const [ user, setUser ] = useState({})

    // useState hook to store selected interests
    const [ categories, setCategories ] = useState([])
    const [ isSelected, setIsSelected ] = useState([])

    const sortedList = isSelected.sort() 

    // useEffect makes GET request for all categories and is used in the interests field
    useEffect(() => {
        axios
          .get(`${API}/category`)
          .then((res) => {
            setCategories(res.data);
        })
        .catch((c) => console.warn("catch, c"));
    }, []);

    // useEffect makes GET request for user info based on username parameter
    useEffect(() => {
        axios
          .get(`${API}/users/${username}`)
          .then((res) => {
            setUser(res.data);
        })
        .catch((c) => console.warn("catch, c"));
    }, [username])
    
console.log(categories)

  return (
    <div>
        <div className="mb-10 mt-12 m-auto">
            <div className='flex justify-center gap-x-10 align-items-start'>
                <img src={profilePic} alt='profile-pic' className="w-36 h-36" />
                <div className="text-left w-1/6">
                    <h1>
                        <b>{user?.first_name} {user?.last_name}</b>
                        {
                            user?.pronoun ? (
                                    <p>({user.pronoun})</p>
                                ) : null
                        }
                    </h1>
                    <h2 className='text-emerald-500'>@{user?.username}</h2>
                    <h3><b>Age: </b>{user?.age?.age} years</h3>
                </div>
                <div className='relative w-52'>
                    <div className='align-middle inline'>
                        <p className='text-left font-bold inline'>
                            Bio
                        </p>
                        <BsPencilSquare 
                            onClick={() => setOpenEditModal(true)}
                            className='inline text-cyan-800 cursor-pointer float-right mt-2'
                        />
                    </div>
                    <section className='w-52 h-12 relative flex flex-row'>
                        <ImQuotesLeft className='text-orange-600 '/>
                            <p className='px-4'>
                                {/* Add bio here */}
                            </p>
                        <ImQuotesRight className='text-orange-600 '/>
                        {/* <span className='text-5xl text-orange-600'>"</span>
                            
                        <span>"</span> */}
                    </section>
                    {/* <textarea name='bio' id='bio' col='25' rows='3' placeholder='Insert bio'></textarea> */}
                    {/* <button className='absolute top-0 left-64 bg-blue-300 px-6 rounded'>
                        Edit
                    </button> */}
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
                        onClick={() => setOpenInterestModal(!openInterestModal)}
                        className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
                    >
                        Edit
                    </button>
                </div>
            </fieldset>
                {
                    openInterestModal ? 
                        <InterestsModal
                            categories={categories} 
                            openInterestModal={openInterestModal} 
                            setOpenInterestModal={setOpenInterestModal}
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
