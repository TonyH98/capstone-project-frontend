// event details page where a host can edit their event or users can show interest
/// NEED TO add attendees list
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Geocode from "react-geocode";
import GoogleMap from "../components/Map";
import CategoriesModal from "../components/CategoriesModal";
import { useUser } from "../contexts/UserProvider";
import { BsPencilFill } from "react-icons/bs";
import CustomComponent from "../components/commentSection";
import useLocalStorage from "../hooks/useLocalStorage";
import LocationEditModal from "../components/LocationEditModal";
import "../components/tooltip.css";
import SummaryEditModal from "../components/SummaryEditModal";

const API = process.env.REACT_APP_API_URL;

export default function EventDetails() {
  // useParams and useNavigate to send/retrieve info from url
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  // useState hook to store event info and user interest
  const [eventInfo, setEventInfo] = useState();
  const [updatedEventInfo, setUpdatedEventInfo] = useState();
  const [coordinates, setCoordinates] = useState({});
  const [category, setCategory] = useState();
  const [userEvent, setUserEvent] = useState({});
  const [categoryModal, setCategoryModal] = useState(false);
  const [attending, setAttending] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [openTitleEdit, setOpenTitleEdit] = useState(false);
  const [openLocationEdit, setOpenLocationEdit] = useState(false)
  const [openSummaryEdit, setOpenSummaryEdit] = useState(false)

  const creator = eventInfo?.creator[0].id;
  const [userMain, setUser] = useLocalStorage("user", {});
  
  // const [data, setCommentData] = useLocalStorage('comments',[])
  
  // useEffect makes an axios call to get event details of an individual event and stores it in eventInfo state
  useEffect(() => {
    axios
    .get(`${API}/events/${id}`)
    .then((res) => {
      console.log(res.data);
      setEventInfo(res.data);
      setUpdatedEventInfo(res.data);
      getCoordinates();
    })
    .catch((c) => console.warn("catch, c"));
  }, [eventInfo?.id]);
  
  console.log(eventInfo);
  console.log("update", updatedEventInfo);
  
  useEffect(() => {
    axios
    .get(`${API}/category`)
    .then((res) => {
      setCategory(res.data);
    })
    .catch((c) => console.warn("catch, c"));
  }, [eventInfo]);
  
  useEffect(() => {
    if (user?.id) {
      axios.get(`${API}/users/${user?.username}/events/${id}`).then((res) => {
        setUserEvent(res.data);
      });
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (eventInfo?.id) {
      axios
      .get(`${API}/users/${eventInfo?.id}/attending?rsvp=true`)
      .then((res) => {
        setAttending(res.data);
      });
    }
  }, [eventInfo?.id]);

  useEffect(() => {
  }, [eventInfo]);
  
  useEffect(() => {
    getCoordinates()
  }, [eventInfo?.address])
  
  // declare a hash map for converting number date to text date with number to text conversions in monthObj
  const months = new Map();
  const monthObj = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  // sets entries in hash map where each numerical key value points to a text month
  for (const key in monthObj) {
    months.set(key, monthObj[key]);
  }

  // declare variables to construct text date from numerical date
  const numDate = eventInfo?.date_event;
  const monthName = months.get(numDate?.slice(0, 2));
  let eventDate = `${monthName} ${numDate?.slice(3, 5)}, ${numDate?.slice(6)}`;

  const getCoordinates = () => {
    // using Geocode API to convert address to coordinates on map
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

    // Get latitude & longitude from address.
    Geocode.fromAddress(eventInfo?.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoordinates({
          latitude: lat,
          longitude: lng,
        });
      },
      (error) => {
        console.error(error);
        // setCoordinates({})
      }
    );
    console.log(coordinates);
  };

  // function that adds event to user profile as interested
  function addToInterest() {
    if (eventInfo && eventInfo?.rsvp === true) {
      axios
        .put(`${API}/users/${user?.id}/events/${id}`, {
          ...userEvent,
          interested: true,
          rsvp: false,
          selected: false,
        })
        .then((res) => {
          setUserEvent(res.data);
        })
        .catch((error) => {
          // Handle error
        });
    } else {
      axios
        .post(`${API}/users/${user?.id}/events/${id}`, eventInfo)
        .then((res) => {
          axios
            .put(`${API}/users/${user?.id}/events/${id}`, {
              ...userEvent,
              interested: true,
              rsvp: false,
              selected: false,
            })
            .then((res) => {
              setUserEvent(res.data);
            })
            .catch((error) => {
              // Handle error
            });
        })
        .catch((error) => {
          // Handle error
        });
    }
  }

  // function that adds event to user profile as rsvp
  function addToRsvp() {
    if (eventInfo && eventInfo.interested === true) {
      axios
        .put(`${API}/users/${user?.id}/events/${id}`, {
          ...userEvent,
          rsvp: true,
          interested: false,
          selected: false,
        })
        .then((res) => {
          setUserEvent(res.data);
        })
        .catch((error) => {
          // Handle error
        });
    } else {
      axios
        .post(`${API}/users/${user?.id}/events/${id}`, eventInfo)
        .then((res) => {
          axios
            .put(`${API}/users/${user?.id}/events/${id}`, {
              ...userEvent,
              rsvp: true,
              interested: false,
              selected: false,
            })
            .then((res) => {
              setUserEvent(res.data);
            })
            .catch((error) => {
              // Handle error
            });
        })
        .catch((error) => {
          // Handle error
        });
    }
  }

  // function to update information on text change in edit forms
  const handleTextChange = (e) => {
    setUpdatedEventInfo({ ...updatedEventInfo, [e.target.id]: e.target.value });
    console.log(updatedEventInfo.date_event)
  };

  // function updates a new event object and makes a put request to update informmation
  const handleEdit = () => {
    // handles reset for age min and max if age_restriction is set to false
    if(!updatedEventInfo.age_restriction){
      console.log("age res is falsey")
      setUpdatedEventInfo({...updatedEventInfo, age_min: 0, age_max: 0})
    }
    setEventInfo({ ...updatedEventInfo });
    
    axios
      .put(`${API}/events/${id}`, updatedEventInfo)
      .then((res) => {
        setOpenTitleEdit(false);
        setOpenLocationEdit(false);
        setOpenSummaryEdit(false)
      })
      // .then(() => {window.location.reload(true)})
      .catch((c) => console.warn("catch, c"));
  };

  // function deletes event from database
  const handleDelete = () => {
    if (
      window.confirm("Are you sure you want to permanently delete this event?")
    ) {
      axios
        .delete(`${API}/events/${id}`)
        .then(() => navigate("/events"))
        .catch((c) => console.warn("catch, c"));
    }
  };

  console.log(updatedEventInfo)

  return (
    <div className="relative">
      <div
        className={`${openTitleEdit ? "background" : null}`}
        onClick={() => setOpenTitleEdit(false)}
      />
      <div className="flex flex-row justify-center gap-x-16 mx-20">
        <img
          src={eventInfo?.location_image}
          alt="event photo"
          className="max-h-96 max-w-96 my-12"
        />
        <div className="w-1/2 mt-12">
          <div className="flex flex-col relative">
            <div className={`tooltip`}>
              <div className={`text-3xl mb-5 `}>
                {eventInfo?.title}&nbsp;&nbsp;|&nbsp;&nbsp;
                {eventInfo?.age_restriction ? (
                  <h1 className={`inline text-2xl text-gray-500 `}>
                    {`${eventInfo?.age_min} to ${eventInfo?.age_max} Only`}
                  </h1>
                ) : (
                  <h1 className="inline text-2xl text-gray-500">
                    {"All ages"}
                  </h1>
                )}
                {editMode ? (
                  <div className="inline">
                    <BsPencilFill
                      onClick={() => {
                        setOpenTitleEdit(!openTitleEdit);
                      }}
                      className="inline text-lg text-gray-800 ml-3 hover:cursor-pointer"
                    />
                  </div>
                ) : null}
              </div>
              {openTitleEdit ? (
                <div className="tooltiptext bg-indigo-200 w-full">
                  <div className="ml-10 mt-4">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={updatedEventInfo.title}
                      onChange={handleTextChange}
                      className="ml-3 rounded h-8 w-3/4 bg-gray-100"
                    />
                  </div>
                  <div className="ml-10 mb-14">
                    <label htmlFor="age_restriction">Age Restriction</label>
                    <select
                      id="age_restriction"
                      name="age_restriction"
                      required
                      onChange={handleTextChange}
                      className="ml-1 mr-6 mt-2 rounded h-8 text-sm pb-1 bg-gray-100"
                    >
                      {updatedEventInfo.age_restriction ? 
                        <option value={true} selected> True </option>
                        : <option value={true}> True </option>
                      }
                      {!updatedEventInfo.age_restriction ? 
                        <option value={false} selected> False </option>
                        : <option value={false}> False </option>
                      }
                    </select>
                    {updatedEventInfo?.age_restriction ? (
                      <div className="inline">
                        <label htmlFor="age_min">Min</label>
                        <input
                          type="number"
                          id="age_min"
                          value={updatedEventInfo?.age_min}
                          onChange={handleTextChange}
                          className="w-14 pr-1 mr-2 text-center rounded h-8 bg-gray-100 ml-1"
                        />
                        <label htmlFor="age_max">Max</label>
                        <input
                          type="number"
                          id="age_max"
                          value={updatedEventInfo.age_max}
                          onChange={handleTextChange}
                          className="w-14 pr-1 text-center rounded h-8 bg-gray-100 ml-1"
                        />
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="border bg-gray-100 px-3 rounded shadow position absolute right-10 bottom-3"
                    onClick={handleEdit}
                  >
                    Save
                  </button>
                </div>
              ) : null}
            </div>
            <div className="relative">
              <h2 className="inline">
                Date:
                <span className="text-white bg-pink-400 hover: rounded-full text-xs px-2.5 py-1.5 text-center mr-2 ml-3">
                  {eventDate}
                </span>
                <span className="text-sm text-blue-800">
                  @ {eventInfo?.start_time} - {eventInfo?.end_time}
                </span>
              </h2>
              {
                editMode ? 
                  <BsPencilFill 
                    onClick={() => {setOpenLocationEdit(true)}}
                    className="right-10 top-0 text-md text-gray-800 inline ml-4 align-baseline hover:cursor-pointer"
                  />
                  : null
              }
              <h2 className="mt-1">Location: {eventInfo?.location}</h2>
              <h2 className="mt-1">Address: {eventInfo?.address}</h2>
            </div>
          </div>
          {
            openLocationEdit ?
              <LocationEditModal 
                updatedEventInfo={updatedEventInfo}
                setUpdatedEventInfo={setUpdatedEventInfo}
                handleTextChange={handleTextChange}
                getCoordinates={getCoordinates}
                setOpenLocationEdit={setOpenLocationEdit}
                handleEdit={handleEdit}
              />
              : null
          }
          <h2>
            Categories:
            {eventInfo?.category_names
              ? eventInfo.category_names.map((category) => {
                  return (
                    <button
                      type="button"
                      key={category.id}
                      // update route for events sorted by category
                      onClick={() => navigate(`/events/${category.name}`)}
                      className="inline text-white bg-indigo-500 hover:bg-blue-800 text-xs rounded-full text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 mb-1"
                    >
                      {category.name}
                    </button>
                  );
                })
              : null}
            {
              editMode ? (
              <button
                type="button"
                onClick={() => setCategoryModal(!categoryModal)}
                className="ml-2"
              >
                +/-
              </button>
              ) : null
            }
          </h2>
          {categoryModal ? (
            <CategoriesModal
              category={category}
              categoryModal={categoryModal}
              setCategoryModal={setCategoryModal}
              eventInfo={eventInfo}
              setEventInfo={setEventInfo}
            />
          ) : null}
          <div className="text-gray-600 mt-3 mb-8">
              Hosted by 
            <div className="hover:text-blue-500 hover:border-blue-500 w-20 inline">
              <Link 
                to={`/profile/${eventInfo?.creator[0].username}`}
                className="hover:text-blue-500 hover:border-blue-500 w-12"
                // onMouseOver={setHover(true)}
              >
                <img 
                  src={user.profile_img}
                  alt="profile image"
                  className="h-7 w-7 inline px-1 py-1 mx-2 rounded-full bg-gray-100 border border-gray-300 hover:border-blue-500"
                /> 
                {eventInfo?.creator[0].username}
              </Link>
            </div>
          </div>
          <div>
            <h2 className="inline">
              <b>Summary</b>
            </h2>
            {
              editMode ? 
                <BsPencilFill 
                  onClick={() => {setOpenSummaryEdit(true)}}
                  className="text-md text-gray-800 inline ml-4 align-baseline hover:cursor-pointer"
                />
                : null
            }
            <section>{eventInfo?.summary}</section>
          </div>
          {
            openSummaryEdit ? (
              <SummaryEditModal 
                eventInfo={eventInfo}
                setOpenSummaryEdit={setOpenSummaryEdit}
                handleTextChange={handleTextChange}
                handleEdit={handleEdit}
              />
            ) : null
          }
        </div>
        <div className="flex flex-col gap-y-12 mt-12">
          <div className="flex flex-row justify-end h-10 gap-x-3">
            {user?.id === creator ? (
              editMode ? (
                <>
                  <button
                    className="text-black bg-red-300 hover:bg-red-400 hover:text-white border font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800 focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 focus:shadow-md font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    className="text-black hover:bg-gray-300 border font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                    onClick={() => setEditMode(false)}
                  >
                    Done
                  </button>
                </>
              ) : (
                <button
                  className="text-black hover:bg-gray-300 border font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              )
            ) : (
              <>
                <button
                  className="text-black hover:bg-gray-300 border focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 focus:shadow-md font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800"
                  onClick={addToInterest}
                >
                  Interested
                </button>
                <button
                  className="text-black hover:bg-gray-300 border focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 focus:shadow-md font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800"
                  onClick={addToRsvp}
                >
                  RSVP
                </button>
              </>
            )}
          </div>
          <div className="">
            <GoogleMap
              mapWidth="300px"
              mapHeight="300px"
              mapLat={coordinates?.latitude}
              mapLng={coordinates?.longitude}
              // address={eventInfo?.address}
              // getCoordinates={getCoordinates}
            />
          </div>
        </div>
        {/* {
            openEditModal ? (
              <EditEventModal 
                eventInfo={eventInfo} 
                setOpenEditModal = {setOpenEditModal}
              />
            ) : null
          } */}
      </div>
      <div>
        <h2 className="text-lg ml-20 font-bold">
          Attendees: {attending.length}/{eventInfo?.max_people}
        </h2>
        {
          attending.length ? (
            <div>
              {
                attending.map((attendee) => {

                })
              }
            </div>
          ) : (
            <h1 className="ml-32 my-5 text-gray-400 text-lg">
              Still space in this event. RSVP now to save your place!
            </h1>
          )

        }
      </div>
      <div>
        <CustomComponent
          currentUser={{
            currentUserId: `${user.id}`,
            currentUserProfile: `localhost:3000/profile/` + user.username,
            currentUserFullName:
              `${user.first_name}` + " " + `${user.last_name} `,
            currentUserImg:
              `https://ui-avatars.com/api/name=` +
              user.first_name +
              `&background=random`,
          }}
        />
      </div>
    </div>
  );
}
