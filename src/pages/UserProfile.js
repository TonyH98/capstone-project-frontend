// User profile page that displays user information, interests, events and hosted events
// NEED TO set up correct routes for useNavigate on button click for categories and store category object with id
// NEED TO add post/put requests to update user info on edit
import axios from "axios";
import InterestsModal from "../components/InterestsModal";
import UserEvents from "./UserEvents";
import UserHostedEvent from "./UserHostedEvents";
import { BsTrash } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { ImQuotesLeft } from "react-icons/im";
import { ImQuotesRight } from "react-icons/im";
import EditProfileModal from "../components/EditProfileModal";
import useLocalStorage from "../hooks/useLocalStorage";
import { getUserInfo, setUserInfo } from "../utils/appUtils";
import Global from "../utils/Global";
import { useUser } from "../contexts/UserProvider";

const API = process.env.REACT_APP_API_URL;

function UserProfile() {
  const navigate = useNavigate();
  // const { profileName } = useParams();
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

  // useEffect(() => {
  //   if (loggedInUser?.id) {
  //     axios.get(`${API}/friends/${loggedInUser?.id}/list`).then((res) => {
  //       setFriends(res.data);
  //     });
  //   }
  // }, [loggedInUser?.id]);

  // useEffect(() => {
  //   if (loggedInUser?.id) {
  //     axios.get(`${API}/users/${loggedInUser?.id}/events`).then((res) => {
  //       setUserEvent(res.data);
  //     });
  //   }
  // }, [loggedInUser?.id]);

  // useEffect(() => {
  //   if (loggedInUser?.id) {
  //     axios
  //       .get(`${API}/events?creator.id=${loggedInUser?.id}`)
  //       .then((res) => {
  //         setHostedEvents(res.data);
  //       })
  //       .catch((err) => {
  //         setHostedEvents(["Fake Event"]);
  //       });
  //   }
  // }, [loggedInUser?.id]);

  // useEffect(() => {
  //   if (loggedInUser?.id) {
  //     axios.get(`${API}/friends/${loggedInUser?.id}/request`).then((res) => {
  //       setFriendRequest(res.data);
  //     });
  //   }
  // }, [loggedInUser?.id]);

  function deleteMultiple() {
    const deleteEvent = userEvents
      .filter((events) => events.selected)
      .map((events) => events.event_id);

    Promise.all(
      deleteEvent.map((eventId) => {
        axios.delete(`${API}/users/${loggedInUser?.id}/events/${eventId}`);
      })
    );
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

  console.log(friends);

  return (
    <>
      <div>
        <div className="mb-10 mt-12 m-auto">
          <div className="flex justify-center gap-x-10 align-items-start">
            <img
              src={loggedInUser?.profile_img}
              alt="profile-pic"
              className="w-36 h-36"
            />
            <div className="text-left w-1/6">
              <h1>
                <b>
                  {loggedInUser?.first_name} {loggedInUser?.last_name}{" "}
                  {loggedInUser?.pronouns ? loggedInUser?.pronouns : null}
                </b>
                {loggedInUser?.pronoun ? <p>({loggedInUser.pronoun})</p> : null}
              </h1>
              <h2 className="text-emerald-500">@{loggedInUser?.username}</h2>
              <h3>
                <b>Age: </b>
                {loggedInUser?.age?.age} years
              </h3>
            </div>
            <div className="relative w-52">
              <div className="align-middle inline">
                <p className="text-left font-bold inline">Bio</p>
                <BsPencilSquare
                  onClick={() => setOpenEditModal(true)}
                  className="inline text-cyan-800 cursor-pointer float-right mt-2"
                />
              </div>
              <section className="w-52 h-12 relative flex flex-row">
                <ImQuotesLeft className="text-orange-600 " />
                <p className="px-4">{loggedInUser?.bio}</p>
                <ImQuotesRight className="text-orange-600 " />
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

      <div>
        {friendsRequest[0] &&
          friendsRequest.map((request) => {
            return (
              <div key={request.id}>
                <img
                  src={request?.profile_img}
                  alt="profile-pic"
                  className="w-20 h-30"
                />{" "}
                {request.first_name} {request.last_name}{" "}
                <button onClick={() => acceptRequest(request.id)}>
                  Accept
                </button>{" "}
                {""}{" "}
                <button onClick={() => declineRequest(request.id)}>
                  Decline
                </button>
              </div>
            );
          })}
      </div>
      <form className="w-3/4 m-auto pb-10">
        <fieldset
          className={`w-3/4 border relative shadow-sm m-auto mb-8 ${
            !isSelected.length ? "h-20" : null
          }`}
        >
          <legend className="px-3 text-left ml-8">Interests</legend>
          <div>
            <div className="flex flex-wrap ml-10 mt-3 pr-24 mb-3">
              {sortCategory.map((item, index) => (
                <button
                  type="button"
                  key={index}
                  // onClick={() => navigate(`\events\:${item}`)}
                  className="inline text-white bg-blue-500 hover:bg-blue-800 text-xs rounded-full text-sm px-5 py-1.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {item.name}
                </button>
              ))}
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
        <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto mb-8">
          <legend className="px-3 text-left ml-8">Events</legend>
          <div>
            {Array.isArray(userEvents) && userEvents.length > 0 ? (
              userEvents.map((event) => (
                <div key={event.event_id}>
                  <UserEvents event={event} />
                </div>
              ))
            ) : (
              <p>No events found.</p>
            )}

            <button onClick={deleteMultiple}>
              {" "}
              <BsTrash />
            </button>

            <button
              onClick={() => navigate("/events")}
              className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
            >
              Add
            </button>
          </div>
        </fieldset>
        <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto">
          <legend className="px-3 text-left ml-8">Hosted Events</legend>
          {hostedEvents[0] &&
            hostedEvents.map((hosted) => {
              return (
                <div key={hosted.id}>
                  <UserHostedEvent hosted={hosted} />
                </div>
              );
            })}

          <button
            onClick={() => navigate("/events/new")}
            className="w-20 bg-blue-300 absolute right-3 top-3 rounded hover:bg-blue-200 shadow-md"
          >
            Create
          </button>
        </fieldset>
        <br />
        <fieldset className="w-3/4 h-20 border relative shadow-sm m-auto">
          <legend className="px-3 text-left ml-8">Friends</legend>
          {friends[0] &&
            friends.map((friend) => {
              return (
                <div key={friend.id}>
                  <img
                    src={friend?.profile_img}
                    alt="profile-pic"
                    className="w-10 h-15"
                  />
                  {friend.username} {friend.pronouns}
                </div>
              );
            })}
        </fieldset>
      </form>
    </>
  );
}

export default UserProfile;
