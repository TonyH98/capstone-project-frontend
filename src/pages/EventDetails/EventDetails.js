// event details page where a host can edit their event or users can show interest
/// NEED TO add attendees list
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Geocode from "react-geocode";
import GoogleMap from "../../components/Map";
import { BsPencilFill } from "react-icons/bs";
import { AiFillCheckCircle } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import {useUser} from "../../contexts/UserProvider"
// import EditEventModal from "../components/EditEventModal"
import CategoriesModal from "../../components/CategoriesModal";
import CommentSection from "../../components/commentSection";
import useLocalStorage from "../../hooks/useLocalStorage";
import TitleEditModal from "../../components/TitleEditModal";
import LocationEditModal from "../../components/LocationEditModal";
import SummaryEditModal from "../../components/SummaryEditModal";
import ImageEditModal from "../../components/ImageEditModal";
import AttendeesEditModal from "../../components/AttendeesEditModal"
import AttendeeIcon from "../../components/AttendeeIcon";
import "./tooltip.css";
import "./EventDetails.css"

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
      axios.get(`${API}/users`)
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

  console.log(hosts)
  
  function createHost(userId){
  if(eventInfo?.id && !hosts.some(host => host.user_id === userId)){
    axios.post(`${API}/events/${userId}/cohost/${eventInfo?.id}`)
      .then(() => {
        axios.get(`${API}/events/${eventInfo?.id}/hosts`)
        .then((res) => {
          setHosts(res.data)
        })
      })
    }
    setShowSearch(false)
    setSearch('')
    setFilterFriends([])
  }

  function deleteCohost (userId){
    axios
      .delete(`${API}/events/${userId}/deletehost/${eventInfo?.id}`)
      .then(() => {
        axios.get(`${API}/events/${eventInfo?.id}/hosts`)
        .then((res) => {
          setHosts(res.data)
        })
      }
    )
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
    <div className="events-detail-page ">
      <div
        className={`${openTitleEdit || openImageEdit || openAttendeesEdit ? "background" : null}`}
        onClick={closeModal}
      />
      
      {/* Holds all the event info */}
      <div className="event-details-info-container lg:flex lg:flex-row lg:justify-center lg:gap-x-16 lg:mx-20">


        {/* image-section */}
       
          <div className="event-details-image-container lg:relative">
            <img
              src={eventInfo?.location_image}
              alt="event photo"
              className="event-details-page-image lg:max-h-96 lg:w-96 lg:mt-12 lg:object-fit"
            />
            <div className="lg:w-36 tooltip lg:absolute lg:left-0 lg:bottom-3">
            {
              editMode ? 
              <button 
              onClick={() => {setOpenImageEdit(true)}}
              className="lg:text-blue-800 lg:pl-1 lg:mb-7 lg:text-left lg:absolute lg:left-0 lg:top-0 lg:w-56 lg:text-sm lg:hover:text-blue-600"
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
      
{/* ---------------------------------------------------------------------------- */}



        {/* contains title, age, date, location etc */}
        <div className="lg:w-1/2 lg:mt-12">
          <div className="lg:flex lg:flex-col lg:relative">
            
            {/* contains the title, age and location */}
            <div className={`tooltip`}>
              <div className="text-3xl mb-5">
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
                  <div className="lg:inline">
                    <BsPencilFill
                      onClick={() => {
                        setOpenTitleEdit(!openTitleEdit);
                      }}
                      className="lg:inline lg:text-lg lg:text-gray-800 lg:ml-3 lg:hover:cursor-pointer"
                    />
                  </div>
                ) : null}
              <h2 className="text-cyan-600 text-xl">@ {eventInfo?.location}</h2>
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

              {/* Date time and address  */}
            <div className="lg:relative">
              <h2 className="lg:inline">
                Date:
                <span className="text-white bg-pink-400 rounded-full lg:text-xs px-1.5 py-.5 text-center mr-2 ml-3">
                  {eventDate}
                </span>
                <span className="text-sm text-blue-800 font-bold">
                  {eventInfo?.start_time.charAt(0) === '0' ? `${eventInfo?.start_time.slice(1)}` : `${eventInfo?.start_time}`} - {eventInfo?.end_time.charAt(0) === '0' ? `${eventInfo?.end_time.slice(1)}` : `${eventInfo?.end_time}`}
                </span>
              {
                editMode ? 
                  <BsPencilFill 
                    onClick={() => {setOpenLocationEdit(true)}}
                    className="lg:right-10 lg:top-0 lg:text-md lg:text-gray-800 lg:inline lg:ml-4 lg:align-baseline lg:hover:cursor-pointer"
                  />
                  : null
              }
              </h2>

              <div className="address-container">

              <h2 className="lg:mt-2">Address: <span className="text-blue-600">{eventInfo?.address}</span></h2>

              </div>
          
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

          {/* category section */}
          <div className="event-details-category-container">

          <h2 className="mt-2 mb-3">
            Categories:
            {eventInfo?.category_names
              ? 
              eventInfo.category_names.map((category) => {
                  return (
                    
                    <Link to={`/events?category_names.name=${encodeURIComponent(category.name)}`}>
                    <div
                    key={category.id}
                      // update route for events sorted by category
                      className="event-details-category-pills lg:inline text-white bg-indigo-500 lg:hover:bg-blue-800 lg:text-xs rounded-full px-3 py-1.5 text-center ml-2 mb-1"
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
                className="lg:ml-2"
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

          </div>




          <div className="lg:text-gray-600 lg:my-5 lg:text-sm lg:py-3 lg:align-baseline">
              Hosted by 

            <div className="lg:hover:text-blue-500 lg:hover:border-blue-500 lg:w-20 inline">
              <Link 
                to={`/profile/${eventInfo?.creator[0].username}`}
                className="lg:hover:text-blue-500 lg:hover:border-blue-500 lg:w-12"
              >
                <img 
                  src={eventInfo?.creator[0].profile_img}
                  alt="profile image"
                  className="lh-10 w-10 inline lg:px-1 lg:py-1 lg:mx-2 rounded-full bg-gray-100 border border-gray-300 lg:hover:border-blue-500 object-cover"
                /> 
                {eventInfo?.creator[0].username}
              </Link>
            </div>

            {
              hosts.length ? (
                <div className="lg:mt-1">
                  <p className="inline break-keep ">Co-Hosts: </p>

                  <div className="flex inline lg:items-center lg:mt-3 lg:overflow-x-scroll lg:no-scrollbar space-x-10">
                  {hosts.map((host) => {
                    return(
                      <div className="lg:hover:text-blue-500 lg:hover:border-blue-500 flex items-center">
                      <Link 
                        to={`/profile/${host.username}`}
                        className="lg:hover:text-blue-500 lg:hover:border-blue-500 flex items-center"
                      >
                        <img 
                          src={host.profile_img}
                          alt="profile image"
                          className="h-10 w-10 inline px-1 py-1 mx-2 rounded-full bg-gray-100 border border-gray-300 lg:hover:border-blue-500 object-cover"
                        /> 
                        <p>{host.username}</p>
                      </Link>
                      {
                        editMode && users.id === eventInfo.creator[0].id ? (
                          <button 
                            className="pl-1 inline text-red-800"
                            onClick={() => deleteCohost(host?.user_id)}
                          >
                            X
                          </button>
                        ) : null
                      }
                    </div>
                    )
                  })
                }
                </div>



                <div className="mt-2">
                  {users?.id === eventInfo?.creator[0].id ? 
                    <button type="button" onClick={showSearchBar} className="text-[12px] border rounded-xl bg-white px-5 shadow inline mr-3 text-gray-500 lg:hover:text-blue-400 lg:hover:bg-gray-200 bg-gradient-to-b from-gray-100 to-gray-300 lg:hover:bg-gradient-to-b">
                      Add Co-Host
                    </button>
                      : null
                  }
                  {showSearch ? (
                    <div className="inline ">
                      <input
                        type="text"
                        value={search}
                        onChange={handleFilter}
                        className="lg:inline h-7 rounded lg:align-middle border border-black"
                      />
                    {filterFriends?.length !== 0 && (
                      <div className="dataResult shadow-lg lg:absolute bg-white w-40 text-center ml-32 rounded">
    
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
                  </div>
                </div>
              ) : (
                <div className="lg:block lg:my-2">
                  {users?.id === eventInfo?.creator[0].id ? 
                    <button type="button" onClick={showSearchBar} className="text-[12px] border rounded-xl bg-white px-5 shadow inline mr-3 text-gray-500 lg:hover:text-blue-400 lg:hover:bg-gray-200 bg-gradient-to-b gray-100 to-gray-300 lg:hover:bg-gradient-to-b">
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
                        className="inline h-7 rounded align-middle border border-black"
                      />
                    {filterFriends?.length !== 0 && (
                      <div className="dataResult lg:shadow-lg lg:absolute bg-white w-40 text-center ml-32 rounded">
    
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






          <div className="lg:mt-6">
            <h2 className="lg:inline">
              <b>Summary</b>
            </h2>
            {
              editMode ? 
                <BsPencilFill 
                  onClick={() => {setOpenSummaryEdit(true)}}
                  className="lg:text-md lg:text-gray-800 lg:inline lg:ml-4 lg:align-baseline lg:hover:cursor-pointer"
                />
                : null
            }
            <div className="event-details-summary-container">

            <section className="event-details-summary lg:break-words lg:text-ellipsis">{eventInfo?.summary}</section>

            </div>
            
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


{/* ----------------------------------------------------------------------------- */}


          {/* contains the buttons and google maps */}
        <div className="lg:flex lg:flex-col lg:gap-y-12 lg:mt-12">
        <div className="lg:flex lg:flex-row lg:justify-end lg:h-10 gap-x-3">
  {users?.id === creator ? (
    editMode ? (
      <>
        <button
          className="lg:text-black lg:bg-red-300 lg:hover:bg-red-400 lg:hover:text-white lg:border lg:font-medium lg:rounded-lg lg:text-sm lg:px-4 lg:py-2.5 lg:text-center lg:inline-flex lg:items-center"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="lg:text-black lg:hover:bg-gray-300 lg:border lg:font-medium lg:rounded-lg lg:text-sm lg:px-4 lg:py-2.5 lg:text-center lg:inline-flex lg:items-center"
          onClick={() => setEditMode(false)}
        >
          Done
        </button>
      </>
    ) : (
      <button
        className="lg:text-black lg:hover:bg-gray-300 lg:border lg:font-medium lg:rounded-lg lg:text-sm lg:px-4 lg:py-2.5 lg:text-center lg:inline-flex lg:items-center"
        onClick={() => setEditMode(true)}
      >
        Edit
      </button>
    )
  ) : hostId.includes(users?.id) ? (
    editMode ? (
      <button
        className="lg:text-black lg:hover:bg-gray-300 lg:border lg:font-medium lg:rounded-lg lg:text-sm lg:px-4 lg:py-2.5 lg:text-center lg:inline-flex lg:items-center"
        onClick={() => setEditMode(false)}
      >
        Done
      </button>
    ) : (
      <button
        className="lg:text-black lg:hover:bg-gray-300 lg:border lg:font-medium lg:rounded-lg lg:text-sm lg:px-4 lg:py-2.5 lg:text-center lg:inline-flex lg:items-center"
        onClick={() => setEditMode(true)}
      >
        Edit
      </button>
    )
  ) : (
    <>
      <button
        className={`${eventState?.interested ? 'bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200' : null} text-black lg:hover:bg-gray-300 border lg:focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 lg:focus:shadow-md font-medium rounded-lg text-sm lg:px-4 lg:py-2.5 text-center inline-flex items-center`}
        onClick={addToInterest} 
      >
        Interested
          <span className="lg:text-lg h-8">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <AiFillStar className={`${eventState?.interested ? 'text-yellow-400' : 'text-gray-400'} text-xl`}/>
      </button>

      <button
        className={`${eventState?.rsvp ? 'ml-4 bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200' : null} text-black hover:bg-gray-300 border lg:focus:bg-gradient-to-b from-cyan-100 via-purple-100 to-purple-200 focus:shadow-md font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center`}
        onClick={addToRsvp}
      >
        RSVP
          <span className="lg:text-lg lg:h-8">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <AiFillCheckCircle className={`${ eventState?.rsvp ? 'text-green-400' : 'text-gray-400' } lg:text-xl lg:focus:text-green-400`}/>
      </button>

    </>
  )}
</div>

          <div className="google-map-container">
            <GoogleMap
              mapWidth="300px"
              mapHeight="300px"
              mapLat={coordinates?.latitude}
              mapLng={coordinates?.longitude}
            />
          </div>
        </div>





      </div>


{/* ------------------------------------------------------------------------ */}



      {/* contains the attendees */}
      <div>
        <div className="tooltip pt-7">
          <div>
            <h2 className="text-lg lg:ml-20 font-bold inline">
              Attendees: {attending?.length}/{eventInfo?.max_people}
            </h2>
            {
              editMode ?
                <BsPencilFill 
                  onClick={() => {setOpenAttendeesEdit(true)}}
                  className="lg:text-md lg:text-gray-800 lg:inline lg:ml-4 lg:align-baseline lg:hover:cursor-pointer"
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
            <div className="mb-10 lg:ml-16 flex flex-row">
              {
                attending.map((attendee) => {
                  return(
                    <div className="">
                      <AttendeeIcon 
                        attendee={attendee}
                      />
                  </div>
                  )
                })
              }
            </div>
          ) : (
            <h1 className="lg:ml-32 lg:my-5 lg:mb-10 lg:text-gray-400 lg:text-lg">
              Still space in this event. RSVP now to save your spot!
            </h1>
          )
        }
      </div>




{/* ---------------------------------------------------------------------------------- */}


        {/* contains the comment section */}
      <div className="px-10 pt-6 border-t">
        <CommentSection users={users} id={id}/> 
      </div>
    </div>
  );
}