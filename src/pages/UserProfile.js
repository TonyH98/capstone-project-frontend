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
      <form className="w-3/4 m-auto pb-10">
        <fieldset
          className={`w-3/4 border relative shadow-sm m-auto mb-8 ${
            !isSelected.length ? "h-20" : null
          }`}
        >
          <legend className="px-3 text-left ml-8">Interests</legend>
          <div>
            <div className="flex flex-wrap ml-6 mt-3 pr-24 mb-3 gap-y-5 mb-6">
              {sortCategory.map((category) => {
                return(
                  <Link to={`/users?categories.category_id=${encodeURIComponent(category?.category_id)}`}>
                    <div key={category?.category_id} className="inline text-white bg-indigo-500 hover:bg-blue-800 text-sm rounded-full text-sm px-4 py-2 text-center ml-2 mb-1">
                      {category.name}
                    </div>
                  </Link>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setOpenInterestModal(!openInterestModal)}
              className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
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

        <fieldset className={`w-3/4 border relative shadow-sm m-auto mb-8 ${userEvents.length ? 'h-52' : 'h-20'}`}>
          <legend className="px-3 text-left ml-8">Events</legend>
          <div>
            <div className="flex flex-wrap py-2 overflow-x-scroll h-44 gap-y-8">
              {Array.isArray(userEvents) && userEvents.length > 0 ? (
                userEvents.map((event) => (
                  <div key={event.event_id}>
                    <UserEvents event={event} editEvents={editEvents} />
                  </div>
                ))
                ) : (
                  <p className="ml-7 text-gray-400">No events found.</p>
                  )}

            </div>
              <button
                onClick={() => navigate("/events")}
                className="w-20 bg-blue-300 absolute right-5 top-3 rounded hover:bg-blue-200 shadow-md"
                >
                Add
              </button>
              {userEvents.length > 0 ? (
                !editEvents ? (
                  <button
                    onClick={() => setEditEvents(!editEvents)}  
                    className="absolute right-3 bottom-3"
                    type="button"
                  >
                    <BsPencilSquare />
                  </button>
                ): (
                  <button 
                    onClick={deleteMultiple}
                    className="absolute right-3 bottom-3"
                    type='button'
                  >
                    <BsTrash />
                  </button>
                )
              )  : null
              }
          </div>
        </fieldset>

        <fieldset className={`w-3/4 border relative shadow-sm m-auto mb-8 ${hostedEvents.length ? 'h-52' : 'h-20' }`}>
          <legend className="px-3 text-left ml-8">Hosted Events</legend>
          <div className="flex flex-wrap px-3 py-2 overflow-y-auto">
            {hostedEvents.length > 0 ? (
              hostedEvents.map((hosted) => (
                <div key={hosted.id}>
                  <UserHostedEvent hosted={hosted} />
                </div>
              ))
              ) : (
                <p className="ml-5 text-gray-400">No hosted events found.</p>
                )}
            </div>
          <button
            onClick={() => navigate("/events/new")}
            className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
          >
            Create
          </button>
        </fieldset>

        <fieldset className={`w-3/4 border relative shadow-sm m-auto ${friends.length ? 'h-40' : 'h-20'}`}>
          <legend className="px-3 text-left ml-8">Friends</legend>
              <div className="max-w-full flex flex-row gap-x-10 px-3 py-2 overflow-x-auto h-32">
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
                        className="w-20 h-20 ml-5 object-cover rounded-full justify-center items-center"
                        />
                      <span className="text-center">
                        {friend.username}
                      </span>
                    </Link>
                    )
                  )) : (
                    <p className="ml-5 text-gray-400">No friends added yet.</p>
                  )}
              </div>
          <button
            onClick={() => navigate("/users")}
            className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
          >
            Add
          </button>
        </fieldset>
        <fieldset className={`w-3/4 border relative shadow-sm m-auto mt-8 ${friendsRequest[0]} ? 'h-52' : 'h-20'`}>
          <legend className="px-3 text-left ml-8">Friends Requests</legend>
          <div className="flex flex-wrap px-3 py-2 overflow-y-auto">
        {friendsRequest[0] ? (
          friendsRequest.map((request) => {
            return (
              <div key={request.id} className="flex flex-col justify-center items-center">
                <img
                  src={request?.profile_img}
                  alt="profile-pic"
                  className="w-16 h-15 rounded-full"
                />
                <p className="text-sm font-semibold">{request.first_name} {request.last_name}</p>
                <div>
                <button onClick={() => acceptRequest(request.id)} className="text-xs text-white bg-indigo-500 hover:bg-blue-800 hover:font-semibold p-1 rounded-md">
                  Accept
                </button>{" "}
                {""}{" "}
                <button onClick={() => declineRequest(request.id)} className="text-xs text-white bg-red-400 hover:bg-red-500 hover:font-semibold p-1 rounded-md">
                  Decline
                </button>
                </div>
              </div>
            );
          })) : (
            <p className="ml-5 py-3 text-gray-400">No friend requests.</p>
          )}
      </div>
        </fieldset>
      </form>
    </>
  );
}

export default UserProfile;
