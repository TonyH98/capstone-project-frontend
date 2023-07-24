// User profile page that displays user information, interests, events and hosted events

import axios from "axios";
import InterestsModal from "../../components/InterestModal/InterestsModal";
import UserEvents from "../UserEvents";
import UserHostedEvent from "../UserHostedEvents";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import useLocalStorage from "../../hooks/useLocalStorage"
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserProvider";
import "./UserProfileFirstHalf.css"
import "./UserProfileSecondHalf.css"

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

 



  return (
    <>

        <div className="user-profile-container lg:mb-10 lg:mt-12 lg:m-auto">
          <div className="user-profile-container-two lg:flex lg:justify-center lg:gap-x-10 lg:align-items-start">
            <div className="other-image-small-detail-container lg:flex">
            <img
              src={loggedInUser?.profile_img}
              alt="profile-pic"
              className="user-profile-image lg:w-36 lg:h-36 lg:basis-1/8 lg:object-cover lg:rounded"
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

            </div>


            <div className="user-profile-bio-container lg:relative lg:w-52 lg:basis-1/4 ">
  <div className="user-profile-bio-icon-container lg:flex lg:items-center lg:justify-between">
    <p className="user-bio-header lg:text-left lg:font-bold">Bio</p>
    <BsPencilSquare
      onClick={() => setOpenEditModal(true)}
      className="profile-edit-icon lg:text-cyan-800 lg:cursor-pointer"
    />
  </div>

    <div className="user-profile-bio-content-container lg:w-full lg:mt-2 lg:max-w-md lg:overflow-hidden">
      <p className="user-profile-bio-content lg:whitespace-normal lg:break-words">{loggedInUser?.bio}</p>
    </div>

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
 



      <form className="user-profile-second-half lg:w-3/4 lg:m-auto lg:pb-10">
      <fieldset
          className={`other-profile-interest-container lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8`}
        >
          <legend className="other-profile-interest-legend lg:px-3 lg:text-left lg:ml-8">Interests</legend>
       
            <div className="other-profile-interests-container lg:flex lg:flex-wrap lg:ml-6 lg:mt-3 lg:pr-24 lg:mb-3 lg:gap-y-4 lg:mb-6">
            {sortCategory.map((category) => {
                return(
                  <Link to={`/users?categories.category_id=${encodeURIComponent(category?.category_id)}`}>
                  <div key={category?.category_id} className="other-profile-interest-pills lg:inline lg:text-white lg:bg-indigo-500 lg:hover:bg-blue-800 lg:text-sm lg:rounded-full lg:text-sm lg:px-4 lg:py-2 lg:text-center lg:ml-2 lg:mb-1">
                  {category.name}
                  </div>
                  </Link>
                )
              })}
            </div>
          <button
            type="button"
            onClick={() => setOpenInterestModal(!openInterestModal)}
            className="user-profile-add-interest-button lg:w-20 lg:bg-blue-300 lg:absolute lg:right-3 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
          >
            Edit
          </button>

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

          <fieldset className={`other-profile-events-container lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8 
          ${userEvents.length ? 'lg:h-52' : 'lg:h-20'}`}>
          <legend className="other-profile-events-legend lg:px-3 lg:text-left lg:ml-8">Events</legend>
          <div className="profile-event-container lg:flex lg:flex-wrap lg:py-2 lg:overflow-x-scroll lg:h-44 lg:gap-y-8">
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
              
              <div className="users-event-button-container">
                
              <button
                onClick={() => navigate("/events")}
                className="user-add-event-user lg:w-20 lg:bg-blue-300 lg:absolute lg:right-5 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
                >
                Add
              </button>
              {userEvents.length > 0 ? (
                !editEvents ? (
                  <button
                    onClick={() => setEditEvents(!editEvents)}  
                    className="user-profile-edit-event-button lg:absolute lg:right-3 lg:bottom-3"
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

  
        <fieldset className={`other-profile-hosted-container lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8 ${hostedEvents.length ? 'lg:h-52' : 'lg:h-20' }`}>
          <legend className="other-profile-host-legend lg:px-3 lg:text-left lg:ml-8">Hosted Events</legend>
          <div className="other-profile-host-container lg:flex lg:flex-wrap lg:px-3 lg:py-2 lg:overflow-y-auto">
            {hostedEvents[0] &&
              hostedEvents.map((hosted) => {
                return (
                  <div key={hosted.id}>
                    <UserHostedEvent hosted={hosted} />
                  </div>
                );
              })}
            </div>

          <button
            onClick={() => navigate("/events/new")}
            className="users-create-event-button lg:w-20 lg:bg-blue-300 lg:absolute lg:right-3 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
          >
            Create
          </button>

        </fieldset>

        <fieldset className={`other-profile-friends-container lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto ${friends.length ? 'lg:h-40' : 'lg:h-20'}`}>
          <legend className="other-profile-friends-legend lg:px-3 lg:text-left lg:ml-8">Friends</legend>
          <div className="other-profile-friends-container lg:max-w-full lg:flex lg:flex-row lg:gap-x-10 lg:px-3 lg:py-2 lg:overflow-x-auto lg:h-32">
            {friends.length ? (
              friends.map((friend) => {
                return (
                  <div key={friend.id}>
                    <Link to={`/profile/${friend?.username}`}>
                      <img
                        src={friend?.profile_img}
                        alt="profile-pic"
                        className="friends-profile-image lg:w-20 lg:h-20 lg:ml-5 lg:object-cover lg:rounded-full lg:justify-center lg:items-center"
                      />
                      <p className="text-center">
                        {friend.username}
                      </p>
                    </Link>{" "}
                  </div>
                );
              }
            )) : (
              <p className="lg:ml-5 lg:text-gray-400">No friends added yet.</p>
            )}
          </div>
          <button
            onClick={() => navigate("/users")}
            className="users-add-friends-button lg:w-20 lg:bg-blue-300 lg:absolute lg:right-3 lg:top-3 lg:rounded lg:hover:bg-blue-200 lg:shadow-md"
          >
            Add
          </button>
        </fieldset>
      </form>
    </>
  );
}

export default UserProfile;
