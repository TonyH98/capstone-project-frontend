import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import EventCard from './EventCard'
import ReactPaginate from 'react-paginate'
import "./events.css";


const pageData = 10

const API = process.env.REACT_APP_API_URL

export default function Events() {

const [events , setEvents] = useState([])

const [filterEvents, setFilterEvents] = useState([])

const [currentPage, setCurrentPage] = useState(0)

const [searchFilter , setSearchFilter] = useState("")

useEffect(() => {
  axios
  .get(`${API}/events`)
  .then((res) => {
    setEvents(res.data)
    setFilterEvents(res.data)
  })
  .catch((error) => {
    console.error(error)
  })
}, [])


const sortByDate = (date) => {
  if(date === ""){
    setFilterEvents([...events])
  }
  else if(date === "Latest to Earliest"){
    const sort = [...filterEvents].sort((a , b) => {
      return new Date(b.date_event) - new Date(a.date_event)
    })
    setFilterEvents(sort)
  }
  else if (date === "Earliest to Latest"){
    const sort = [...filterEvents].sort((a , b) => {
      return new Date(a.date_event
        ) - new Date(b.date_event)
    })
    setFilterEvents(sort)
  }
  setCurrentPage(0)
}


function handlePageChange ({selected: selectedPage }){
  setCurrentPage(selectedPage)
}



useEffect(() => {
  if(searchFilter === ""){
    axios
      .get(`${API}/events`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
      setCurrentPage(0)
  }
  else{

    const filteredEvents = events.filter((event) => {
      const {title, creator, category_names, location} = event
  
      const {username} = creator[0]
  
      const titleMatch = title.toLowerCase().includes(searchFilter.toLocaleLowerCase())
  
      const usernameMatch = username.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
      
      const locationMatch = location.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())

      const categoryMatch = category_names.some(
        (category) => category.name.toLowerCase().includes(searchFilter.toLowerCase())
      );
  
      return titleMatch || usernameMatch || categoryMatch || locationMatch
  
    })
  
    
      setFilterEvents(filteredEvents)
      setCurrentPage(0)
  }
  

}, [searchFilter])


const offSet = currentPage * pageData;

const currentEvents = filterEvents
  .slice(offSet, offSet + pageData)
  .map((event) => (
    <div className='event-card'>
      <EventCard key={event.id} event={event} />
    </div>
  ));

const pageCount = Math.ceil(events.length/pageData)

console.log(events)


  return (
    <div>
      <div className='search-bar'>
        <label htmlFor='search'>Search By:</label>
        <input
        type="text"
        placeholder='Title, Category, or by Creator'
        id='search'
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      <div className='sort-by-event-date'>
        <label htmlFor='sort-by-event-date'>Sort by date:</label>
        <select onChange={(e) => sortByDate(e.target.value)}>
        <option value="">Select</option>
            <option value="Latest to Earliest">Latest to Earliest</option>
            <option value="Earliest to Latest">Earliest to Latest</option>
        </select>
      </div>
      <div className='events-section'>
      {currentEvents.length > 0 ?  currentEvents :
      <div>
        <h1>No Events Found!</h1>
      </div>  
    }
      </div>
      <div>
        {events.length < pageData ? null :
        <ReactPaginate
        previousLabel={"<"}
         nextLabel={">"}
         pageCount={pageCount}
         onPageChange={handlePageChange}
         containerClassName={"pagination"}
         previousLinkClassName={"pagination-link"}
         nextLinkClassName={"pagination-link"}
         pageClassName={"pageCount"}
        />
        }
      </div>
    </div>
  )
}
