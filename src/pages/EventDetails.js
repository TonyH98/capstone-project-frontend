// event details page where a host can edit their event or users can show interest
/// NEED TO add attendees list
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Geocode from "react-geocode";
import GoogleMap from "../components/Map";
import { BsPencilFill } from "react-icons/bs";
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import {useUser} from "../contexts/UserProvider"
// import EditEventModal from "../components/EditEventModal"
import CategoriesModal from "../components/CategoriesModal";
import CommentSection from "../components/commentSection";
import useLocalStorage from "../hooks/useLocalStorage";
import TitleEditModal from "../components/TitleEditModal";
import LocationEditModal from "../components/LocationEditModal";
import SummaryEditModal from "../components/SummaryEditModal";
import ImageEditModal from "../components/ImageEditModal";
import AttendeesEditModal from "../components/AttendeesEditModal"
import AttendeeIcon from "../components/AttendeeIcon";
import "../components/tooltip.css";

const API = process.env.REACT_APP_API_URL;

export default function EventDetails({users, categoryQuery}) {
  // useParams and useNavigate to send/retrieve info from url
  const { id } = useParams();
  const navigate = useNavigate();

  // useState hook to store event info and user interest

  const [ eventInfo, setEventInfo ] = useState();
  const [ updatedEventInfo, setUpdatedEventInfo ] = useState()
  const [ coordinates, setCoordinates ] = useState({})
  const [ category , setCategory ] = useState()
  const [ userEvent , setUserEvent ] = useState({})
  const [ attending, setAttending ] = useState()
  const [ interest, setInterest ] = useState()
  
  const [ categoryModal, setCategoryModal ] = useState(false)
  const [ editMode, setEditMode ] = useState(false)
  const [ openTitleEdit, setOpenTitleEdit ] = useState(false)
  const [ openLocationEdit, setOpenLocationEdit ] = useState(false)
  const [ openSummaryEdit, setOpenSummaryEdit ] = useState(false)
  const [ openImageEdit, setOpenImageEdit ] = useState(false)
  const [ openAttendeesEdit, setOpenAttendeesEdit ] = useState(false)
  const [ showSearch, setShowSearch ] = useState(false)

  const [eventState , setEventState] = useState({})

  const creator = eventInfo?.creator[0].id;
  const [ userMain, setUser ] = useLocalStorage("user", {});

  //Filtering users friends list states
  let [search , setSearch] = useState("")
  let [friends , setFriends] = useState([])
  let [filterFriends, setFilterFriends] = useState([])

  //States for creating and getting co-host for events
  let [hosts , setHosts] = useState([])
  
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
  
  useEffect(() => {
    if(users?.id){
      axios
      .get(`${API}/users/${users?.id}/events/${id}`)
      .then((res) => {
        setEventState(res.data)
      })
    }
  }, [users?.id])

  console.log(eventState)

  useEffect(() => {
    if (users?.id) {	    
      axios.get(`${API}/friends/${users?.id}/list`)
      .then((res) => {	      
        setFriends(res.data);	        
      });
    }
  }, [users?.id]);
  
  useEffect(() => {
    axios
    .get(`${API}/category`)
    .then((res) => {
      setCategory(res.data);
    })
    .catch((c) => console.warn("catch, c"));
  }, [eventInfo]);
  
  useEffect(() => {
    if (users?.id) {
      axios.get(`${API}/users/${users?.username}/events/${id}`)
      .then((res) => {
        setUserEvent(res.data);
      });
    }
  }, [users?.id]);
  
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
    if(eventInfo?.id){
      axios.get(`${API}/events/${eventInfo?.id}/hosts`)
        .then((res) => {
          setHosts(res.data)
        })
    }
  }, [eventInfo?.id])
  
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
  const monthName = months.get(numDate?.slice(5, 7));
  let eventDate = `${monthName} ${numDate?.slice(8)}, ${numDate?.slice(0, 4)}`;

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
      }
    );
  };


  // useEffect(() => {
  //   if(users?.id){
  //     axios
  //     .get(`${API}/users/${users?.id}/events/${id}`)
  //     .then((res) => {
  //       setEventState(res.data)
  //     })
  //   }
  // }, [users?.id])

  console.log('rvsp', eventInfo?.rsvp)
  // function that adds event to user profile as interested
  function addToInterest() {
    if (eventInfo && eventInfo?.rsvp === true) {
      axios
        .put(`${API}/users/${users?.id}/events/${id}`, {
          ...userEvent,
          interested: true,
          rsvp: false,
          selected: false,
        })
        .then(() => {
          axios
          .get(`${API}/users/${users?.id}/events/${id}`)
          .then((res) => {
            setEventState(res.data)
          })
        })
        .then(() => {
          axios
          .get(`${API}/users/${eventInfo?.id}/attending?rsvp=true`)
          .then((res) => {
            setAttending(res.data);
          });
        })
        .then (() => {
          if(interest === 'interest'){
            setInterest(null)
          } else {
            setInterest('interest')
          }
        })
        .catch((error) => {
          // Handle error
        });
    } else {
      axios
        .post(`${API}/users/${users?.id}/events/${id}`, eventInfo)
        .then((res) => {
          axios
            .put(`${API}/users/${users?.id}/events/${id}`, {
              ...userEvent,
              interested: true,
              rsvp: false,
              selected: false,
            })
            .then((res) => {
              axios
              .get(`${API}/users/${users?.id}/events/${id}`)
              .then((res) => {
                setEventState(res.data)
              })
            })
            .then(() => {
              axios
              .get(`${API}/users/${eventInfo?.id}/attending?rsvp=true`)
              .then((res) => {
                setAttending(res.data);
              });
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

  const showSearchBar = () => {
    setShowSearch(!showSearch)
  }

  function handleFilter(event){
    let searchResult = event.target.value
    setSearch(searchResult)
    const filter = friends.filter((friend) => {
      const {first_name, username} = friend
  
      const matchFirstName = first_name.toLowerCase().includes(searchResult.toLowerCase())
  
      const matchUsername = username.toLowerCase().includes(searchResult.toLowerCase())
  
      return matchFirstName || matchUsername
    })
  
    if(searchResult === ""){
      setFilterFriends([])
    }
    else{
      setFilterFriends(filter)
    }
  }
  
  function createHost(userId){
  if(eventInfo?.id && hosts?.length < 3 && !hosts.some(host => host.user_id === userId)){
    axios.post(`${API}/events/${userId}/cohost/${eventInfo?.id}`)
      .then(() => {
        axios.get(`${API}/events/${eventInfo?.id}/hosts`)
        .then((res) => {
          setHosts(res.data)
        })
      })
    }
  }

  // function that adds event to user profile as rsvp
  function addToRsvp() {
    if (eventInfo && eventInfo.interested === true) {
      axios
        .put(`${API}/users/${users?.id}/events/${id}`, {
          ...userEvent,
          rsvp: true,
          interested: false,
          selected: false,
        })
        .then((res) => {
          axios
          .get(`${API}/users/${users?.id}/events/${id}`)
          .then((res) => {
            setEventState(res.data)
          })
        })
        .then(() => {
              axios
              .get(`${API}/users/${eventInfo?.id}/attending?rsvp=true`)
              .then((res) => {
                setAttending(res.data);
              });
        })
        .catch((error) => {
          // Handle error
        });
    } else {
      axios
        .post(`${API}/users/${users?.id}/events/${id}`, eventInfo)
        .then((res) => {
          axios
            .put(`${API}/users/${users?.id}/events/${id}`, {
              ...userEvent,
              rsvp: true,
              interested: false,
              selected: false,
            })
            .then((res) => {
              axios
          .get(`${API}/users/${users?.id}/events/${id}`)
          .then((res) => {
            setEventState(res.data)
          })
            })
            .then(() => {
              axios
              .get(`${API}/users/${eventInfo?.id}/attending?rsvp=true`)
              .then((res) => {
                setAttending(res.data);
              });
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
    if (e.target.id === "summary") {
      const { value } = e.target;
      if (value.length <= 250) {
        setUpdatedEventInfo((prevEvent) => ({
          ...prevEvent,
          summary: value,
        }));
      } else {
        e.target.value = value.substr(0, 250); // Truncate the new input to 250 characters
      }
    } 
     else if (e.target.id === "age_restriction"){
      const {value} = e.target
      const ageRestriction = value === "true"

      if(!ageRestriction){
        setUpdatedEventInfo((prevEvent) => ({
          ...prevEvent,
          age_restriction: ageRestriction,
          age_min: 0,
        age_max: 0,
        }))
      }
      else{
        setUpdatedEventInfo((prevEvent) => ({
          ...prevEvent,
          age_restriction: ageRestriction,
        }));
      }
    }
    else {
      setUpdatedEventInfo({ ...updatedEventInfo, [e.target.id]: e.target.value });
      console.log(updatedEventInfo.date_event);
    }
  };
  
 
  useEffect(() => {
    if(!updatedEventInfo?.age_restriction){
      console.log("age res is falsey")
      setUpdatedEventInfo({ age_min: 0, age_max: 0, ...updatedEventInfo})
    } else {
      console.log("age res is truthy")
    }
  }, [updatedEventInfo?.age_restriction])

  // function updates a new event object and makes a put request to update informmation
  const handleEdit = async () => {
    // handles reset for age min and max if age_restriction is set to false
    if(!updatedEventInfo?.age_restriction){
      console.log("age res is falsey")
      setUpdatedEventInfo({...updatedEventInfo, age_min: 0, age_max: 0})
    }
    await setEventInfo({ ...updatedEventInfo });
    
    axios
      .put(`${API}/events/${id}`, updatedEventInfo)
      .then(() => {
        setOpenTitleEdit(false);
        setOpenLocationEdit(false);
        setOpenSummaryEdit(false)
        setOpenImageEdit(false)
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

  const closeModal = () => {
    setOpenImageEdit(false)
    setOpenTitleEdit(false)
    setOpenAttendeesEdit(false)
    setUpdatedEventInfo(eventInfo)
  }
  
const hostId = hosts.map((host) => {
  return host.user_id

})


  return (
    <div className="relative">
      <div
        className={`${openTitleEdit || openImageEdit || openAttendeesEdit ? "background" : null}`}
        onClick={closeModal}
      />
      <div className="flex flex-row justify-center gap-x-16 mx-20">
        <div className="w-96">
          <div className="relative">
            <img
              src={eventInfo?.location_image}
              alt="event photo"
              className="max-h-96 w-96 mt-12 object-fit"
            />
            <div className="w-36 tooltip absolute left-0 bottom-3">
            {
              editMode ? 
              <button 
              onClick={() => {setOpenImageEdit(true)}}
              className="text-blue-800 pl-1 mb-7 text-left absolute left-0 top-0 w-56 text-sm hover:text-blue-600"
              >
                  Change Event Photo
                </button>
                  : null
                }
                {
                  openImageEdit ? 
                  <ImageEditModal 
                    updatedEventInfo={updatedEventInfo}
                    setOpenImageEdit={setOpenImageEdit}
                    handleTextChange={handleTextChange}
                    handleEdit={handleEdit}
                  />
                  : null
                }
            </div>
          </div>
        </div>
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
                    All ages
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
              <h2 className=" text-cyan-600 text-xl">@ {eventInfo?.location}</h2>
              </div>
              {openTitleEdit ? 
                <TitleEditModal 
                  eventInfo={eventInfo}
                  updatedEventInfo={updatedEventInfo}
                  handleTextChange={handleTextChange}
                  handleEdit={handleEdit}
                />
              : null}
            </div>
            <div className="relative">
              <h2 className="inline">
                Date:
                <span className="text-white bg-pink-400 hover: rounded-full text-xs px-2.5 py-1.5 text-center mr-2 ml-3">
                  {eventDate}
                </span>
                <span className="text-sm text-blue-800 font-bold">
                  {eventInfo?.start_time.charAt(0) === '0' ? `${eventInfo?.start_time.slice(1)}` : `${eventInfo?.start_time}`} - {eventInfo?.end_time.charAt(0) === '0' ? `${eventInfo?.end_time.slice(1)}` : `${eventInfo?.end_time}`}
                </span>
              {
                editMode ? 
                  <BsPencilFill 
                    onClick={() => {setOpenLocationEdit(true)}}
                    className="right-10 top-0 text-md text-gray-800 inline ml-4 align-baseline hover:cursor-pointer"
                  />
                  : null
              }
              </h2>
              <h2 className="">Address: {eventInfo?.address}</h2>
          
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
          <h2 className="mt-1">
            Categories:
            {eventInfo?.category_names
              ? eventInfo.category_names.map((category) => {
                  return (
                    
                    <Link to={`/events?category_names.name=${encodeURIComponent(category.name)}`}>
                    <div
                    key={category.id}
                      // update route for events sorted by category
                      className="inline text-white bg-indigo-500 hover:bg-blue-800 text-xs rounded-full text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 mb-1"
                    >
                      {category.name}
                    </div>
                    </Link>
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
          <div className="text-gray-600 my-5 text-sm py-3 align-baseline">
              Hosted by 
            <div className="hover:text-blue-500 hover:border-blue-500 w-20 inline">
              <Link 
                to={`/profile/${eventInfo?.creator[0].username}`}
                className="hover:text-blue-500 hover:border-blue-500 w-12"
              >
                <img 
                  src={eventInfo?.creator[0].profile_img}
                  alt="profile image"
                  className="h-12 w-12 inline px-1 py-1 mx-2 rounded-full bg-gray-100 border border-gray-300 hover:border-blue-500 object-cover"
                /> 
                {eventInfo?.creator[0].username}
              </Link>
            </div>
            {
              hosts.length ? (
                <div className="inline">
                  Co-Hosts: 
                  {hosts.map((host) => {
                    return(
                      <div className="hover:text-blue-500 hover:border-blue-500 w-20 inline">
                        <Link 
                          to={`/profile/${host.username}`}
                          className="hover:text-blue-500 hover:border-blue-500 w-12"
                        >
                          <img 
                            src={host.profile_img}
                            alt="profile image"
                            className="h-7 w-7 inline px-1 py-1 mx-2 rounded-full bg-gray-100 border border-gray-300 hover:border-blue-500"
                          /> 
                          {host.username}
                        </Link>
                      </div>
                    )
                  })
                }
                </div>
              ) : (
                <div className="inline ml-4">
                  {users?.id === eventInfo?.creator[0].id ? 
                    <button onClick={showSearchBar} className="text-[12px] border rounded-xl px-5 shadow inline mr-3 text-gray-500 hover:text-blue-400 hover:bg-gray-200 bg-gradient-to-b gray-100 to-gray-300 hover:bg-gradient-to-b">
                      Add Co-Host
                    </button>
                      : null
                  }
                  {showSearch ? (
                    <div className="inline">
                      <input
                        type="text"
                        value={search}
                        onChange={handleFilter}
                        className="inline h-7 rounded align-middle"
                      />
                    {filterFriends?.length !== 0 && (
                      <div className="dataResult">
    
                        {filterFriends.slice(0,5).map((friend) => {
                          return(
                            <div className="search-link">
                              <br></br>
                              <button className="dropdown-link" onClick={() => createHost(friend?.id)}>
                              {friend.username}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ): null}
                </div >
              )
            }
          </div>
          <div className="mt-6">
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
            <section className="break-words text-ellipsis">{eventInfo?.summary}</section>
          </div>
          {
            openSummaryEdit ? (
              <SummaryEditModal 
                eventInfo={eventInfo}
                updatedEventInfo={updatedEventInfo}
                setOpenSummaryEdit={setOpenSummaryEdit}
                handleTextChange={handleTextChange}
                handleEdit={handleEdit}
              />
            ) : null
          }
        </div>
        <div className="flex flex-col gap-y-12 mt-12">
        <div className="flex flex-row justify-end h-10 gap-x-3">
  {users?.id === creator ? (
    editMode ? (
      <>
        <button
          className="text-black bg-red-300 hover:bg-red-400 hover:text-white border font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
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
  ) : hostId.includes(users?.id) ? (
    editMode ? (
      <button
        className="text-black hover:bg-gray-300 border font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
        onClick={() => setEditMode(false)}
      >
        Done
      </button>
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
        className={`${eventState?.interested ? 'bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200' : null} text-black hover:bg-gray-300 border focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 focus:shadow-md font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800`}
        onClick={addToInterest} 
      >
        Interested
          <span className="text-lg h-8">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <AiFillStar className={`${eventState?.interested ? 'text-yellow-400' : 'text-gray-400'} text-xl`}/>
      </button>
      <button
        className={`${eventState?.rsvp ? 'bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200' : null} text-black hover:bg-gray-300 border focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 focus:shadow-md font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800`}
        onClick={addToRsvp}
      >
        RSVP
          <span className="text-lg h-8">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <AiFillCheckCircle className={`${ eventState?.rsvp ? 'text-green-400' : 'text-gray-400' } text-xl focus:text-green-400`}/>
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
            />
          </div>
        </div>
      </div>
      <div>
        <div className="tooltip pt-7">
          <div>
            <h2 className="text-lg ml-20 font-bold inline">
              Attendees: {attending?.length}/{eventInfo?.max_people}
            </h2>
            {
              editMode ?
                <BsPencilFill 
                  onClick={() => {setOpenAttendeesEdit(true)}}
                  className="text-md text-gray-800 inline ml-4 align-baseline hover:cursor-pointer"
                />
                  : null
            }
            {
              openAttendeesEdit ? (
                <AttendeesEditModal
                  updatedEventInfo={updatedEventInfo}
                  setOpenAttendeesEdit={setOpenAttendeesEdit}
                  handleTextChange={handleTextChange}
                  handleEdit={handleEdit}
                />
              ) : null
            }
          </div>
        </div>
        {
          attending?.length ? (
            <div>
              {
                attending.map((attendee) => {
                  return(
                    <div className="flex flex-row">
                      <AttendeeIcon 
                        attendee={attendee}
                      />
                  </div>
                  )
                })
              }
            </div>
          ) : (
            <h1 className="ml-32 my-5 text-gray-400 text-lg">
              Still space in this event. RSVP now to save your spot!
            </h1>
          )
        }
      </div>
      <div>

        
        <h2 className="pl-4 text-lg">Comments</h2>
        <CommentSection users={users} id={id}/> 
      </div>
    </div>
  );
}