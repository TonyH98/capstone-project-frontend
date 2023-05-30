// Will add an axios call to fetch the information of a specific event
// If the map ends up being its own component we can just import it here
// Will probably add the comment section and the attendees as their own components
// The edit button will link to a prefilled edit page and the cancel button will have a modal window asking to confirm cancellation
// The rsvp button is a placeholder and will be replaced with a dropdown
// I left off any links incase anyone else is working on routes to avoid merge conflicts

// NEED TO add dynamic src for img based on eventInfo object
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GoogleMap from "../components/Map";
import CategoriesModal from "../components/CategoriesModal";
// import EditEventModal from "../components/EditEventModal"
import useLocalStorage from "../hooks/useLocalStorage";

const API = process.env.REACT_APP_API_URL;
export default function EventDetails() {
  // useParams and useNavigate to send/retrieve info from url
  const { id } = useParams();
  const navigate = useNavigate();

  // useState hook to store event info and user interest
  const [eventInfo, setEventInfo] = useState();
  const [category , setCategory] = useState()
  const [interest, setInterest] = useState();
  const [user , setUser] = useState({})
  const [userEvent , setUserEvent] = useState({})
  const [categoryModal, setCategoryModal] = useState(false)
  const [attending, setAttending] = useState([])
  const [openEditModal, setOpenEditModal] = useState(false)


  // useEffect makes an axios call to get event details of an individual event and stores it in eventInfo state
  useEffect(() => {
    axios
      .get(`${API}/events/${id}`)
      .then((res) => {
        setEventInfo(res.data);
      })
      .catch((c) => console.warn("catch, c"));
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/category`)
      .then((res) => {
        setCategory(res.data);
    })
    .catch((c) => console.warn("catch, c"));
}, []);



useEffect(() => {
axios
.get(`${API}/users/klang`)
.then((res) => {
  setUser(res.data)
})
}, [])

useEffect(() => {
if(user?.id){
  axios
  .get(`${API}/users/${user?.id}/events/${id}`)
  .then((res) => {
    setUserEvent(res.data)
  })

}
}, [user?.id])


useEffect(() => {
  if(eventInfo?.id){
    axios
    .get(`${API}/users/${eventInfo?.id}/attending?rsvp=true`)
    .then((res) => {
      setAttending(res.data)
    })
  }
}, [eventInfo?.id])
console.log(eventInfo)


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


  function addToInterest() {
    if (eventInfo && eventInfo?.rsvp === true) {
      axios
        .put(`${API}/users/${user?.id}/events/${id}`, {
          ...userEvent,
          interested: true,
          rsvp: false,
          selected: false
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
              selected: false
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
  
  function addToRsvp() {
    if (eventInfo && eventInfo.interested === true) {
      axios
        .put(`${API}/users/${user?.id}/events/${id}`, {
          ...userEvent,
          rsvp: true,
          interested: false,
          selected: false
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
              selected: false
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
  
console.log(attending)
console.log(eventInfo)


  return (
    <div className="relative">
      <div className="flex flex-row justify-center gap-x-16 mx-20">
        <img
          src={eventInfo?.location_image}
          alt="event photo"
          className="max-h-96 max-w-96 my-12"
        />
        <div className="w-1/2 mt-12">
          <div className="flex flex-col">
            <div className="text-3xl mb-5">
              {eventInfo?.title}&nbsp;&nbsp;|&nbsp;&nbsp;
              {eventInfo?.age_restriction ? (
                <h1 className="inline text-2xl text-gray-500">
                  {`${eventInfo?.age_min} to ${eventInfo?.age_max} Only`}
                </h1>
              ) : (
                <h1 className="inline text-2xl text-gray-500">{"All ages"}</h1>
              )}
            </div>
            {/* <h2>Age Restrictions: { eventInfo?.age_restriction ? `${eventInfo?.age_min} to ${eventInfo?.age_max}` : 'None'}</h2> */}
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
                        className="inline text-white bg-indigo-500 hover:bg-blue-800 text-xs rounded-full text-sm px-2.5 py-1.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-3 mb-1"
                      >
                        {category.name}
                      </button>
                    );
                  })
                : null}
                <button
                type="button"
                onClick={() => setCategoryModal(!categoryModal)}
                >+/-</button>
            </h2>
            {
              categoryModal ? 
                <CategoriesModal
                  category={category}
                  categoryModal={categoryModal}
                  setCategoryModal={setCategoryModal}
                  eventInfo={eventInfo}
                  setEventInfo={setEventInfo}
                /> : null
            }
            <h2>
              Date:
              <span className="text-white bg-pink-400 hover: rounded-full text-xs px-2.5 py-1.5 text-center mr-2 ml-3">
                {eventDate}
              </span>
            </h2>
            <h2 className="mt-1">Location: {eventInfo?.location}</h2>
            <h2 className="mt-1">Address: {eventInfo?.address}</h2>
          </div>

          <div>
            Time: {eventInfo?.start_time} - {eventInfo?.end_time}
          </div>
          <h2 className="mt-10">
            <b>Summary</b>
          </h2>
          <section>{eventInfo?.summary}</section>
          <div>
            <Link to={`/profile/${eventInfo?.creator[0].username}`}>

            Host: {eventInfo?.creator[0].username}
            </Link>
          </div>
				</div>
				<div className="flex flex-col gap-y-12 mt-12">
						<div className="flex flex-row justify-end h-10 gap-x-3">
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
              <button
                className="text-black hover:bg-gray-300 border font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-yellow-300 dark:focus:ring-blue-800"
								onClick={() => setOpenEditModal(true)}
              >
                Edit
              </button>
        		</div>
						<div className="">
							<GoogleMap
									mapWidth="300px"
									mapHeight="300px"
									mapLat={eventInfo?.latitude}
									mapLng={eventInfo?.longitude}
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
        <h2>Attendees: {attending.length}/{eventInfo?.max_people}</h2>
      </div>
      <div>
        <h2>Comments</h2>
        <p>Comment section will go here</p>
      </div>
    </div>
  );
}
