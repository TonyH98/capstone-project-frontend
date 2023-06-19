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
import { MdMail } from 'react-icons/md'
import { useUser } from "../contexts/UserProvider";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

function OtherProfile() {
  const navigate = useNavigate();
  const { username } = useParams();

  const { loggedInUser } = useUser();

  const [profileInfo, setProfileInfo] = useState({});

  const [request, setRequest] = useState(null);

  const [userEvents, setUserEvent] = useState([]);

  const [categories, setCategories] = useState([]);

  const [hostedEvents, setHostedEvents] = useState([]);

  const [friendsRequest, setFriendRequest] = useState([]);

  const [friends, setFriends] = useState([]);
  const [added, setAdded] = useState(false);

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

  function sendFriendRequest() {
    axios
      .post(`${API}/friends`, {
        users_id: profileInfo?.id,
        senders_id: loggedInUser?.id,
      })
      .then(() => {
        setRequest(true); // Update request state to indicate that the request was sent
      });
  }

  useEffect(() => {
    for (const friend of friends) {
      if (friend.id === loggedInUser.id) {
        setAdded(true);
      }
    }
  }, [friends]);

  console.log(friends);

  return (
    <>
      <div>
        <div className="mb-10 mt-12 m-auto">
          <div className="flex justify-center gap-x-10 align-items-start">
            <img
              src={profileInfo?.profile_img}
              alt="profile-pic"
              className="w-36 h-36 basis-1/8 object-cover rounded"
            />
            <div className="text-left basis-1/8">
              <h1>
                <b>
                  {profileInfo?.first_name} {profileInfo?.last_name}{" "}
                  {profileInfo?.pronouns ? (
                    <p className="inline">
                      <span>(</span>
                        {profileInfo?.pronouns} 
                      <span>)</span>
                    </p>
                    ) : null}
                </b>
                {profileInfo?.pronoun ? <p>({profileInfo.pronoun})</p> : null}
              </h1>
              <h2 className="text-emerald-500">@{profileInfo?.username}</h2>
              <h3>
                <b>Age: </b>
                {profileInfo?.age?.age} years
              </h3>
            </div>
            <div className="relative w-52 basis-1/4 ml-5">
              <div className="align-middle inline">
                <p className="text-left font-bold inline">Bio</p>
              </div>
              <section className="h-12 relative block">
                <ImQuotesLeft className="text-orange-600 inline text-sm" />
                <p className="px-4 inline">{profileInfo?.bio}</p>
                <ImQuotesRight className="text-orange-600 inline text-sm" />
              </section>
            </div>
            <div className="absolute right-20">
              <button 
                onClick={() => navigate('/chats')}
                className="mr-3 text-cyan-500 rounded-md px-2 py-2 text-2xl align-middle"
              >
                <MdMail />
              </button>
              {loggedInUser?.id === username?.id ? null : added ? (
                <span>Already Friends</span>
              ) : request ? (
                <span>Friend Request Sent</span>
              ) : (
                <button
                  className="border-2 border-cyan-400 px-2 my-4 rounded-md"
                  onClick={sendFriendRequest}
                >
                  <span className="text-cyan-500 font-bold text-lg">+</span> Add Friend
                </button>
              )}
          </div>
          </div>
        </div>
      </div>
      <form className="w-3/4 m-auto pb-10">
        <fieldset
          className={`w-3/4 border relative shadow-sm m-auto mb-8 h-30`}
        >
          <legend className="px-3 text-left ml-8">Interests</legend>
          <div>
            <div className="flex flex-wrap ml-10 mt-3 pr-24 mb-3">
            {sortCategory.map((category) => {
                return(
                  <Link to={`/users?categories.category_id=${encodeURIComponent(category?.category_id)}`}>
                  <div key={category?.category_id} className="inline text-white bg-indigo-500 hover:bg-blue-800 text-xs rounded-full text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 mb-1">
                  {category.name}
                  </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </fieldset>
        <fieldset className={`w-3/4 border relative shadow-sm m-auto mb-8 ${userEvents.length ? 'h-52' : 'h-20'}`}>
          <legend className="px-3 text-left ml-8">Events</legend>
          <div className="flex flex-wrap py-2 overflow-x-scroll h-44 gap-y-8">
            {Array.isArray(userEvents) && userEvents.length > 0 ? (
              userEvents.map((event) => (
                <div key={event.event_id}>
                  <UserEvents event={event} />
                </div>
              ))
            ) : (
              <p className="ml-7 text-gray-400">No events found.</p>
            )}
          </div>
        </fieldset>
        <fieldset className={`w-3/4 border relative shadow-sm m-auto ${hostedEvents.length ? 'h-52' : 'h-20' }`}>
          <legend className="px-3 text-left ml-8">Hosted Events</legend>
          <div className="flex flex-wrap px-3 py-2 overflow-y-auto">
            {hostedEvents[0] &&
              hostedEvents.map((hosted) => {
                return (
                  <div key={hosted.id}>
                    <UserHostedEvent hosted={hosted} />
                  </div>
                );
              })}
            </div>
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
                  <Link to={`/profile/${friend?.username}`}>
                    {friend.username}
                  </Link>{" "}
                  {friend.pronouns}
                </div>
              );
            })}
        </fieldset>
      </form>
    </>
  );
}

export default OtherProfile;
