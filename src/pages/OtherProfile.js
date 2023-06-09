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
import { useUser } from "../contexts/UserProvider";

const API = process.env.REACT_APP_API_URL;

function OtherProfile() {
  const navigate = useNavigate();
  const { username } = useParams();

  const { loggedInUser } = useUser();

  const [profileInfo, setProfileInfo] = useState({});

  const [userEvents, setUserEvent] = useState([]);

  const [categories, setCategories] = useState([]);

  const [hostedEvents, setHostedEvents] = useState([]);

  const [friendsRequest, setFriendRequest] = useState([]);

  const [friends, setFriends] = useState([]);

  let sortCategory = Array.isArray(categories) ? categories.sort() : [];

  // let sortCategory = [];

  useEffect(() => {
    axios
      .get(`${API}/users/${username}`)
      .then((res) => {
        setProfileInfo(res.data);
        console.log(res.data);
      })
      .catch((c) => console.warn("catch, c"));
  }, [username]);

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
    if (profileInfo?.id) {
      axios.get(`${API}/users/${profileInfo?.id}/category`).then((res) => {
        setCategories(res.data);
      });
    }
  }, [profileInfo?.id]);

  useEffect(() => {
    if (profileInfo?.id) {
      axios.get(`${API}/friends/${profileInfo?.id}/list`).then((res) => {
        setFriends(res.data);
      });
    }
  }, [profileInfo?.id]);

  useEffect(() => {
    if (profileInfo?.id) {
      axios.get(`${API}/users/${profileInfo?.id}/events`).then((res) => {
        setUserEvent(res.data);
      });
    }
  }, [profileInfo?.id]);

  useEffect(() => {
    if (profileInfo?.id) {
      axios
        .get(`${API}/events?creator.id=${profileInfo?.id}`)
        .then((res) => {
          setHostedEvents(res.data);
        })
        .catch((err) => {
          setHostedEvents(["Fake Event"]);
        });
    }
  }, [profileInfo?.id]);

  useEffect(() => {
    if (profileInfo?.id) {
      axios.get(`${API}/friends/${profileInfo?.id}/request`).then((res) => {
        setFriendRequest(res.data);
      });
    }
  }, [profileInfo?.id]);

  function deleteMultiple() {
    const deleteEvent = userEvents
      .filter((events) => events.selected)
      .map((events) => events.event_id);

    Promise.all(
      deleteEvent.map((eventId) => {
        axios.delete(`${API}/users/${profileInfo?.id}/events/${eventId}`);
      })
    );
  }

  const acceptRequest = (senderId) => {
    axios
      .post(`${API}/friends/${profileInfo?.id}/accept/${senderId}`, {
        users_id: profileInfo?.id,
        friends_id: senderId,
      })
      .then(() => {
        axios.get(`${API}/friends/${profileInfo?.id}/request`).then((res) => {
          setFriendRequest(res.data);
        });
      });
  };

  const declineRequest = (senderId) => {
    axios
      .delete(`${API}/friends/${profileInfo?.id}/denied/${senderId}`)
      .then(() => {
        axios.get(`${API}/friends/${profileInfo?.id}/request`).then((res) => {
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
              src={profileInfo?.profile_img}
              alt="profile-pic"
              className="w-36 h-36"
            />
            <div className="text-left w-1/6">
              <h1>
                <b>
                  {profileInfo?.first_name} {profileInfo?.last_name}{" "}
                  {profileInfo?.pronouns ? profileInfo?.pronouns : null}
                </b>
                {profileInfo?.pronoun ? <p>({profileInfo.pronoun})</p> : null}
              </h1>
              <h2 className="text-emerald-500">@{profileInfo?.username}</h2>
              <h3>
                <b>Age: </b>
                {profileInfo?.age?.age} years
              </h3>
            </div>
            <div className="relative w-52">
              <div className="align-middle inline">
                <p className="text-left font-bold inline">Bio</p>
              </div>
              <section className="w-52 h-12 relative flex flex-row">
                <ImQuotesLeft className="text-orange-600 " />
                <p className="px-4">{profileInfo?.bio}</p>
                <ImQuotesRight className="text-orange-600 " />
              </section>
            </div>
          </div>
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
          className={`w-3/4 border relative shadow-sm m-auto mb-8 h-20`}
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
          </div>
        </fieldset>
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

export default OtherProfile;
