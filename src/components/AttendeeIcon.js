import { Link } from "react-router-dom";

function AttendeeIcon({ attendee }) {
    return (
        <div className="ml-8 mt-2 lg:truncate">
            <div className="lg:hover:text-blue-500 lg:hover:border-blue-500 lg:w-20 lg:inline">
                        <Link 
                          to={`/profile/${attendee.username}`}
                          className="lg:hover:text-blue-500 lg:hover:border-blue-500 lg:w-12"
                        >
                          <img 
                            src={attendee?.profile_img}
                            alt="profile image"
                            className="h-16 w-16 inline px-1 py-1 mx-2 rounded-full block bg-gray-100 border border-gray-300 lg:hover:border-blue-500"
                            /> 
                          <p className="mt-1 font-semibold text-center">
                            {attendee.username}
                          </p>
                      </Link>
                    </div>
        </div>
    );
}

export default AttendeeIcon;