// User profile page that displays user information, interests, events and hosted events

import axios from "axios";
import InterestsModal from "../components/InterestsModal";
import UserEvents from "./UserEvents";
import UserHostedEvent from "./UserHostedEvents";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImQuotesLeft } from "react-icons/im";
import { ImQuotesRight } from "react-icons/im";
import EditProfileModal from "../components/EditProfileModal";
import useLocalStorage from "../hooks/useLocalStorage";
// import { getUserInfo, setUserInfo } from "../utils/appUtils";
// import Global from "../utils/Global";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

const API = process.env.REACT_APP_API_URL;

function UserProfile() {
  const navigate = useNavigate();
  const [openInterestModal, setOpenInterestModal] = useLocalStorage(
    "openInterestModal",
    false
  );
  const [openEditModal, setOpenEditModal] = useLocalStorage(
    "openEditModal",
    false
  );
  // const [user, setUser] = useLocalStorage("user", {});
  const { loggedInUser, setLoggedInUser } = useUser();
  // Dont have time to test right now but I think we can just use user only and delete updatedUser
  const [updatedUser, setUpdatedUser] = useLocalStorage("updatedUser", {});

  // useLocalStorage hook to store selected interests
  const [categories, setCategories] = useLocalStorage("categories", []);
  const [isSelected, setIsSelected] = useLocalStorage("isSelected", []);

  const [userEvents, setUserEvent] = useState([]);

  const [hostedEvents, setHostedEvents] = useState([]);

  const [friendsRequest, setFriendRequest] = useState([]);

  const [friends, setFriends] = useState([]);

  const [editEvents, setEditEvents] = useState(false)

  let sortCategory = Array.isArray(isSelected) ? isSelected.sort() : [];

  // let sortCategory = [];

  // useEffect makes GET request for all categories and is used in the interests field
  useEffect(() => {
    axios
      .get(`${API}/category`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((c) => console.warn("catch, c"));
  }, []);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios.get(`${API}/users/${loggedInUser?.id}/category`).then((res) => {
        setIsSelected(res.data);
      });
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios.get(`${API}/friends/${loggedInUser?.id}/list`).then((res) => {
        setFriends(res.data);
      });
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios.get(`${API}/users/${loggedInUser?.id}/events`).then((res) => {
        setUserEvent(res.data);
      });
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios.get(`${API}/events?creator.id=${loggedInUser?.id}`).then((res) => {
        setHostedEvents(res.data);
      });
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    if (loggedInUser?.id) {
      axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
        setFriendRequest(res.data);
      });
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    setLoggedInUser(loggedInUser)
  }, [loggedInUser?.id])

  function deleteMultiple() {
    const deleteEvent = userEvents
      .filter((events) => events.selected)
      .map((events) => events.event_id);
      
      
    if (window.confirm("Are you sure you want to remove all selected events?")){
      Promise.all(
        deleteEvent.map((eventId) => {
          axios.delete(`${API}/users/${loggedInUser?.id}/events/${eventId}`);
        })
        );
      }

    setEditEvents(false)
  }

  const acceptRequest = (senderId) => {
    axios
      .post(`${API}/friends/${loggedInUser?.id}/accept/${senderId}`, {
        users_id: loggedInUser?.id,
        friends_id: senderId,
      })
      .then(() => {
        axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
          setFriendRequest(res.data);
        });
      });
  };

  const declineRequest = (senderId) => {
    axios
      .delete(`${API}/friends/${loggedInUser?.id}/denied/${senderId}`)
      .then(() => {
        axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
          setFriendRequest(res.data);
        });
      })
      .catch((error) => {
        console.error("Error declining friend request:", error);
      });
  };

console.log(isSelected)

  return (
    <>
      <div>
        <div className="lg:mb-10 lg:mt-12 lg:m-auto">
          <div className="lg:flex lg:justify-center lg:gap-x-10 lg:align-items-start">
            <img
              src={loggedInUser?.profile_img}
              alt="profile-pic"
              className="lg:w-36 lg:h-36 lg:basis-1/8 lg:object-cover lg:rounded"
            />
            <div className="lg:text-left lg:basis-1/8">
              <h1>
                <b>
                  {loggedInUser?.first_name} {loggedInUser?.last_name}{" "}
                  {loggedInUser?.pronouns ? (
                    <p className="lg:inline">
                      <span>(</span>
                        {loggedInUser?.pronouns} 
                      <span>)</span>
                    </p>
                    ) : null}
                </b>
              </h1>
              <h2 className="lg:text-emerald-500">@{loggedInUser?.username}</h2>
              <h3>
                <b>Age: </b>
                {loggedInUser?.age?.age} years
              </h3>
            </div>
            <div className="lg:relative lg:w-52 lg:basis-1/4 lg:ml-5">
              <div className="lg:align-middle lg:inline">
                <p className="lg:text-left lg:font-bold lg:inline">Bio</p>
                <BsPencilSquare
                  onClick={() => setOpenEditModal(true)}
                  className="lg:inline lg:text-cyan-800 lg:cursor-pointer lg:float-right lg:mt-2"
                />
              </div>
              <section className="lg:h-12 lg:relative lg:block">
                <ImQuotesLeft className="lg:text-orange-600 lg:inline lg:text-sm" />
                  <p className="lg:px-4 lg:inline">{loggedInUser?.bio}</p>
                <ImQuotesRight className="lg:text-orange-600 lg:inline text-sm" />
              </section>
            </div>
          </div>
          {openEditModal ? (
            <EditProfileModal
              setUser={setLoggedInUser}
              user={loggedInUser}
              setOpenEditModal={setOpenEditModal}
              updatedUser={updatedUser}
              setUpdatedUser={setUpdatedUser}
            />
          ) : null}
        </div>
      </div>
      <form className="lg:w-3/4 lg:m-auto lg:pb-10">
        <fieldset
          className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8 ${
            !isSelected.length ? "lg:h-20" : null
          }`}
        >
          <legend className="px-3 text-left ml-8">Interests</legend>
          <div>
            <div className="lg:flex lg:flex-wrap lg:ml-6 lg:mt-3 lg:pr-24 lg:mb-3 lg:gap-y-5 lg:mb-6">
              {sortCategory.map((category) => {
                return(
                  <Link to={`/users?categories.category_id=${encodeURIComponent(category?.category_id)}`}>
                    <div key={category?.category_id} 
                    className="lg:inline lg:text-white lg:bg-indigo-500 lg:hover:bg-blue-800 lg:text-sm lg:rounded-full lg:text-sm lg:px-4 lg:py-2 lg:text-center lg:ml-2 lg:mb-1">
                      {category.name}
                    </div>
                  </Link>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setOpenInterestModal(!openInterestModal)}
              className="lg:w-20 lg:bg-blue-300 lg:absolute lg:right-3 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
            >
              Edit
            </button>
          </div>
        </fieldset>
        {openInterestModal ? (
          <InterestsModal
            categories={categories}
            openInterestModal={openInterestModal}
            setOpenInterestModal={setOpenInterestModal}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
            user={loggedInUser}
          />
        ) : null}

        <fieldset className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8 ${userEvents.length ? 'lg:h-52' : 'lg:h-20'}`}>
          <legend className="px-3 text-left ml-8">Events</legend>
          <div>
            <div className="lg:flex lg:flex-wrap lg:py-2 lg:overflow-x-scroll lg:h-44 lg:gap-y-8">
              {Array.isArray(userEvents) && userEvents.length > 0 ? (
                userEvents.map((event) => (
                  <div key={event.event_id}>
                    <UserEvents event={event} editEvents={editEvents} />
                  </div>
                ))
                ) : (
                  <p className="lg:ml-7 lg:text-gray-400">No events found.</p>
                  )}

            </div>
              <button
                onClick={() => navigate("/events")}
                className="lg:w-20 lg:bg-blue-300 lg:absolute lg:right-5 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
                >
                Add
              </button>
              {userEvents.length > 0 ? (
                !editEvents ? (
                  <button
                    onClick={() => setEditEvents(!editEvents)}  
                    className="lg:absolute lg:right-3 lg:bottom-3"
                    type="button"
                  >
                    <BsPencilSquare />
                  </button>
                ): (
                  <button 
                    onClick={deleteMultiple}
                    className="lg:absolute lg:right-3 lg:bottom-3"
                    type='button'
                  >
                    <BsTrash />
                  </button>
                )
              )  : null
              }
          </div>
        </fieldset>

        <fieldset className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto mb-8 ${hostedEvents.length ? 'lg:h-52' : 'lg:h-20' }`}>
          <legend className="lg:px-3 lg:text-left lg:ml-8">Hosted Events</legend>
          <div className="lg:flex lg:flex-wrap lg:px-3 lg:py-2 lg:overflow-y-auto">
            {hostedEvents.length > 0 ? (
              hostedEvents.map((hosted) => (
                <div key={hosted.id}>
                  <UserHostedEvent hosted={hosted} />
                </div>
              ))
              ) : (
                <p className="lg:ml-5 lg:text-gray-400">No hosted events found.</p>
                )}
            </div>
          <button
            onClick={() => navigate("/events/new")}
            className="lg:w-20 lg:bg-blue-300 lg:absolute lg:right-3 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
          >
            Create
          </button>
        </fieldset>

        <fieldset className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto ${friends.length ? 'lg:h-40' : 'lg:h-20'}`}>
          <legend className="lg:px-3 lg:text-left lg:ml-8">Friends</legend>
              <div className="lg:max-w-full lg:flex lg:flex-row lg:gap-x-10 lg:px-3 lg:py-2 lg:overflow-x-auto lg:h-32">
                {friends.length ? (
                  friends.map((friend) => (
                    <Link
                    key={friend.id}
                    to={`/profile/${friend?.username}`}
                    // className="flex items-center mr-4 mb-2"
                    >
                      <img
                        src={friend?.profile_img}
                        alt="profile-pic"
                        className="lg:w-20 lg:h-20 lg:ml-5 lg:object-cover lg:rounded-full lg:justify-center lg:items-center"
                        />
                      <span className="lg:text-center">
                        {friend.username}
                      </span>
                    </Link>
                    )
                  )) : (
                    <p className="lg:ml-5 lg:text-gray-400">No friends added yet.</p>
                  )}
              </div>
          <button
            onClick={() => navigate("/users")}
            className="lg:w-20 lg:bg-blue-300 lg:absolute lg:right-3 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
          >
            Add
          </button>
        </fieldset>
      </form>
    </>
  );
}

export default UserProfile;
