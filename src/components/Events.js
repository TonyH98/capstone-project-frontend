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
