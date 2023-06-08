import { Link } from "react-router-dom";

function AttendeeIcon({ attendee }) {
    return (
        <div className="ml-24 mt-2 truncate">
            <div className="hover:text-blue-500 hover:border-blue-500 w-20 inline">
                        <Link 
                          to={`/profile/${attendee.username}`}
                          className="hover:text-blue-500 hover:border-blue-500 w-12"
                        >
                          <img 
                            src={attendee?.profile_img}
                            alt="profile image"
                            className="h-16 w-16 inline px-1 py-1 mx-2 rounded-full block bg-gray-100 border border-gray-300 hover:border-blue-500"
                            /> 
                          <p className="mt-1 font-semibold">
                            {attendee.username}
                          </p>
                      </Link>
                    </div>
        </div>
    );
}

export default AttendeeIcon;