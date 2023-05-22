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

const [currentPage, setCurrentPage] = useState(0)

const [searchFilter , setSearchFilter] = useState("")

useEffect(() => {
  axios
  .get(`${API}/events`)
  .then((res) => {
    setEvents(res.data)
  })
  .catch((error) => {
    console.error(error)
  })
}, [])

function handlePageChange ({selected: selectedPage }){
  setCurrentPage(selectedPage)
}



useEffect(() => {

  const filteredEvents = events.filter((event) => {
    const {title, creator, category_names} = event

    const {username} = creator[0]

    const titleMatch = title.toLowerCase().includes(searchFilter.toLocaleLowerCase())

    const usernameMatch = username.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())

    const categoryMatch = category_names.some(
      (category) => category.name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    return titleMatch || usernameMatch || categoryMatch

  })

  if(searchFilter === ""){
    setEvents(events)
  }
  else{
    setEvents(filteredEvents)
  }

}, [searchFilter])


const offSet = currentPage * pageData


const currentEvents = events
.slice(offSet, offSet + pageData)
.map((event) => 
<div className='event-card'>
<EventCard key={event.id} event={event}/>
</div>
)


const pageCount = Math.ceil(events.length/pageData)

  return (
    <div>
      <div className='search-bar'>
        <label htmlFor='search'>Search By:</label>
        <input
        type="text"
        id='search'
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      <div className='events-section'>
      {currentEvents}
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
