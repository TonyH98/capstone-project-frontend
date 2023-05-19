import axios from 'axios'
import styles from './modal.module.css'

const API = process.env.REACT_APP_API_KEY

function EditProfileModal({ setOpenEditModal, updatedUser, setUpdatedUser, username }) {

    // function to update user info on change
    const handleTextChange = (e) => {
        setUpdatedUser({...updatedUser, [e.target.id]: e.target.value})
    }

    // function that updates the user information in the users table and closes the modal
    // NEED TO test if working
    const handleSubmit = (e) => {    
        axios
            .put(`${API}/users/${username}`, updatedUser)
            .then(() => setOpenEditModal(false))
            .catch((c) => console.warn("catch, c"));
    }
    console.log(updatedUser)
    return (
        <>
            <div 
                className={`${styles.cardBg}`}
                onClick={() => setOpenEditModal(false)} 
            />
            <div className={`${styles.card} w-1/3 flex flex-col`}>
                <div 
                    onClick={() => setOpenEditModal(false)}
                    className="absolute right-4 top-3 cursor-pointer"
                >
                    X
                </div>
                <div>
                    <p className="pb-4 pt-2 text-center">Edit Profile Information</p>
                    <form className='w-3/4 m-auto flex flex-col gap-y-3'>
                        <label htmlFor='first_name'>
                            First Name
                            <input 
                                id='first_name'
                                name='first_name'
                                type='text'
                                value={updatedUser?.first_name}
                                onChange={handleTextChange}
                                className='block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </label>
                        <label htmlFor='last_name'>
                            Last Name
                            <input 
                                id='last_name'
                                name='last_name'
                                type='text'
                                value={updatedUser?.last_name}
                                onChange={handleTextChange}
                                className='block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </label>
                        <label htmlFor='pronouns'>
                            Pronouns
                            <input 
                                id='pronouns'
                                name='pronouns'
                                type='text'
                                value={updatedUser?.pronouns}
                                onChange={handleTextChange}
                                className='block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />                           
                        </label>
                        <label htmlFor='img_url'>
                            Image URL
                            <input 
                                id='img_url'
                                name='img_url'
                                type='text'
                                value={updatedUser?.img_url}
                                onChange={handleTextChange}
                                className='block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            />
                        </label>
                        <label htmlFor='bio'>
                            Bio
                            <textarea 
                                id='bio'
                                name='bio'
                                value={updatedUser?.bio}
                                onChange={handleTextChange}
                                className='block w-[100%]'
                            />
                        </label>
                    </form>
                </div>
                <button
                    type='submit'
                    onClick={handleSubmit}    
                    className="bg-emerald-500 text-white px-8 py-1 mt-8 mb-6 rounded-md border w-3/4     m-auto"
                >
                    Done
                </button>
            </div>
        </>
    );
}

export default EditProfileModal;