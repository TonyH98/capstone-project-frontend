import { Link } from "react-router-dom";

function AttendeeIcon({ attendee }) {
    return (
        <div className="lg:ml-8 lg:mt-2 lg:truncate">
            <div className="lg:hover:text-blue-500 lg:hover:border-blue-500 lg:w-20 lg:inline">
                        <Link 
                          to={`/profile/${attendee.username}`}
                          className="lg:hover:text-blue-500 lg:hover:border-blue-500 lg:w-12"
                        >
                          <img 
                            src={attendee?.profile_img}
                            alt="profile image"
                            className="lg:h-16 lg:w-16 lg:inline lg:px-1 lg:py-1 lg:mx-2 lg:rounded-full lg:block lg:bg-gray-100 lg:border lg:border-gray-300 lg:hover:border-blue-500"
                            /> 
                          <p className="lg:mt-1 lg:font-semibold lg:text-center">
                            {attendee.username}
                          </p>
                      </Link>
                    </div>
        </div>
    );
}

export default AttendeeIcon;