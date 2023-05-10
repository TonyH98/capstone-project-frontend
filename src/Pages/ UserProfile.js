import profilePic from '../assets/profile-pic-1.png'

function UserProfile() {

  return (
    <div>
        <div className="flex flex-row ml-48 my-10" >
            <img src={profilePic} alt='profile-pic' className="w-72 h-72 mr-10" />
            <div className="text-left">
                <h1><b>Name (Pronouns)</b></h1>
                <h2>Username</h2>
                <h3>Age</h3>
                <p>Bio</p>
                <textarea></textarea>
            </div>
        </div>
        <div className="w-3/4 m-auto pb-10">
            <h2 className="text-left">Interests</h2>
            <div className="w-3/4 h-20 border relative shadow-sm">
                <button className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md">
                    Edit
                </button>
            </div>
        </div>
        <div className="w-3/4 m-auto">
            <h2 className="text-left">Events</h2>
            <div className="w-3/4 h-20 border relative shadow-sm">
                <button className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md">
                    Add
                </button>
            </div>
        </div>
    </div>
  )
}

export default UserProfile