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
        <div className="lg:mb-10 lg:mt-12 lg:m-auto">
          <div className="lg:flex lg:justify-center lg:gap-x-10 lg:align-items-start">
            <img
              src={profileInfo?.profile_img}
              alt="profile-pic"
              className="lg:w-36 lg:h-36 lg:basis-1/8 lg:object-cover lg:rounded"
            />
            <div className="lg:text-left lg:basis-1/8">
              <h1>
                <b>
                  {profileInfo?.first_name} {profileInfo?.last_name}{" "}
                  {profileInfo?.pronouns ? (
                    <p className="lg:inline">
                      <span>(</span>
                        {profileInfo?.pronouns} 
                      <span>)</span>
                    </p>
                    ) : null}
                </b>
                {profileInfo?.pronoun ? <p>({profileInfo.pronoun})</p> : null}
              </h1>
              <h2 className="lg:text-emerald-500">@{profileInfo?.username}</h2>
              <h3>
                <b>Age: </b>
                {profileInfo?.age?.age} years
              </h3>
            </div>
            <div className="lg:relative lg:w-52 lg:basis-1/4 lg:ml-5">
              <div className="lg:align-middle lg:inline">
                <p className="lg:text-left lg:font-bold lg:inline">Bio</p>
              </div>
              <section className="lg:h-12 lg:relative lg:block">
                <ImQuotesLeft className="lg:text-orange-600 lg:inline lg:text-sm" />
                  <p className="lg:px-4 lg:inline">{profileInfo?.bio}</p>
                <ImQuotesRight className="lg:text-orange-600 lg:inline lg:text-sm" />
              </section>
            </div>
            <div className="lg:absolute lg:right-20">
              <button 
                onClick={() => navigate('/chats')}
                className="lg:mr-3 lg:text-cyan-500 lg:rounded-md lg:px-2 lg:py-2 lg:text-2xl lg:align-middle"
              >
                <MdMail />
              </button>
              {loggedInUser?.id === username?.id ? null : added ? (
                <span>Already Friends</span>
              ) : request ? (
                  <button
                  className="lg:border-2 lg:border-cyan-400 lg:py-0.5 lg:bg-cyan-400 lg:my-4 lg:w-[130px] lg:rounded-md"
                >
                  Request Sent
                </button>              ) : (
                <button
                  className="lg:border-2 lg:border-cyan-400 lg:px-2 lg:my-4 lg:pr-2 lg:px-2 lg:w-[130px] lg:rounded-md"
                  onClick={sendFriendRequest}
                >
                  <span className="lg:text-cyan-500 lg:font-bold lg:text-lg lg:px-1">+</span> Add Friend
                </button>
              )}
          </div>
          </div>
        </div>
      </div>
      <form className="lg:w-3/4 lg:m-auto lg:pb-10">
        <fieldset
          className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8`}
        >
          <legend className="lg:px-3 lg:text-left lg:ml-8">Interests</legend>
          <div>
            <div className="lg:flex lg:flex-wrap lg:ml-6 lg:mt-3 lg:pr-24 lg:mb-3 lg:gap-y-4 lg:mb-6">
            {sortCategory.map((category) => {
                return(
                  <Link to={`/users?categories.category_id=${encodeURIComponent(category?.category_id)}`}>
                  <div key={category?.category_id} className="lg:inline lg:text-white lg:bg-indigo-500 lg:hover:bg-blue-800 lg:text-sm lg:rounded-full lg:text-sm lg:px-4 lg:py-2 lg:text-center lg:ml-2 lg:mb-1">
                  {category.name}
                  </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </fieldset>
        <fieldset className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8 ${userEvents.length ? 'lg:h-52' : 'lg:h-20'}`}>
          <legend className="lg:px-3 lg:text-left lg:ml-8">Events</legend>
          <div className="lg:flex lg:flex-wrap lg:py-2 lg:overflow-x-scroll lg:h-44 lg:gap-y-8">
            {Array.isArray(userEvents) && userEvents.length > 0 ? (
              userEvents.map((event) => (
                <div key={event.event_id}>
                  <UserEvents event={event} />
                </div>
              ))
            ) : (
              <p className="lg:ml-7 lg:text-gray-400">No events found.</p>
            )}
          </div>
        </fieldset>
        
        <fieldset className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto lg:mb-8 ${hostedEvents.length ? 'lg:h-52' : 'lg:h-20' }`}>
          <legend className="lg:px-3 lg:text-left lg:ml-8">Hosted Events</legend>
          <div className="lg:flex lg:flex-wrap lg:px-3 lg:py-2 lg:overflow-y-auto">
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
        
        <fieldset className={`lg:w-3/4 lg:border lg:relative lg:shadow-sm lg:m-auto ${friends.length ? 'lg:h-40' : 'lg:h-20'}`}>
          <legend className="lg:px-3 lg:text-left lg:ml-8">Friends</legend>
          <div className="lg:max-w-full lg:flex lg:flex-row lg:gap-x-10 lg:px-3 lg:py-2 lg:overflow-x-auto lg:h-32">
            {friends.length ? (
              friends.map((friend) => {
                return (
                  <div key={friend.id}>
                    <Link to={`/profile/${friend?.username}`}>
                      <img
                        src={friend?.profile_img}
                        alt="profile-pic"
                        className="lg:w-20 lg:h-20 lg:ml-5 lg:object-cover lg:rounded-full lg:justify-center lg:items-center"
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
        </fieldset>
      </form>
    </>
  );
}

export default OtherProfile;
