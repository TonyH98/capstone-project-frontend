import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import EventCard from './EventCard';
import ReactPaginate from 'react-paginate';
import GoogleMap from "../MapMultipleMarkers"
import './events.css';
import Lottie from "lottie-react";
import animationData from "../../assets/noEvents.json";
import { ImSearch } from "react-icons/im"
import { AiOutlineClose } from "react-icons/ai"

const pageData = 10;

const API = process.env.REACT_APP_API_URL;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filterEvents, setFilterEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState([]);
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category_names.name')


  // search input modal for mobile view
  const [modal, setModal] = useState(false);
  function openModal() {
    setModal(!modal);
  }

  // for map media query
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 450px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 450px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/events`, {
        params: { 'category_names.name': categoryFilter }
      })
      .then((res) => {
        setEvents(res.data);
        setFilterEvents(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [categoryFilter]);
  

  useEffect(() => {
    axios
      .get(`${API}/category`)
      .then((res) => {
        setCategories(res.data);
      });
  }, []);

  const addCategory = (categoryName) => {
    setFilterCategories([...filterCategories, categoryName]);
  };

  const removeCategory = (categoryName) => {
    const filter = filterCategories.filter((category) => {
      return category !== categoryName;
    });

    setFilterCategories(filter);
  };
  
  const applyFilters = () => {
    let filteredEvents = events;
  
    if (filterCategories.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        event.category_names && event.category_names.some((category) =>
        filterCategories.includes(category.name)
        )
      );
    }
  
    if (searchFilter) {
      const filterText = searchFilter.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(filterText) ||
          (event.creator[0]?.username || '').toLowerCase().includes(filterText) ||
          event.location.toLowerCase().includes(filterText)
      );
    }
  
    setFilterEvents(filteredEvents);
    setCurrentPage(0);
  };
  
  useEffect(() => {
    applyFilters();
  }, [searchFilter, filterCategories]);

  const sortByDate = (date) => {
    if (date === '') {
      setFilterEvents([...events]);
    } else if (date === 'Latest to Earliest') {
      const sort = [...filterEvents].sort(
        (a, b) => new Date(b.date_event) - new Date(a.date_event)
      );
      setFilterEvents(sort);
    } else if (date === 'Earliest to Latest') {
      const sort = [...filterEvents].sort(
        (a, b) => new Date(a.date_event) - new Date(b.date_event)
      );
      setFilterEvents(sort);
    }
    setCurrentPage(0);
  };

  function handlePageChange({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const offSet = currentPage * pageData;

  const currentEvents = filterEvents
    .slice(offSet, offSet + pageData)
    .map((event) => (
      <div className='event-card' key={event.id}>
        <EventCard event={event} />
      </div>
    ));

  const pageCount = Math.ceil(filterEvents.length / pageData);

  // useEffect to re-render map when filters change
  useEffect(() => {
  
  }, [events, filterEvents])

  console.log(events)

  return (
   

    <div className='lg:flex lg:flex-col lg:z-10 lg:bg-gradient-to-r lg:from-cyan-50 lg:via-purple-50 lg:to-pink-50 lg:mx-3'>
       <section className='lg:flex lg:items-center lg:justify-between py-4'>
       <div className='w-30 lg:w-auto'></div>
       <div className='flex justify-center items-center lg:ml-[10%]'>
       <div className='m-2 lg:m-0'>
          <select onChange={(e) => sortByDate(e.target.value)} className='lg:border-transparent lg:focus:border-transparent lg:focus:ring-0 lg:shadow-lg lg:rounded-md lg:py-2 lg:px-1'>
            <option value=''>Sort date</option>
            <option value='Earliest to Latest'>Earliest to Latest</option>
            <option value='Latest to Earliest'>Latest to Earliest</option>
          </select>
        </div>
       <div className='lg:m-2'>
          <input
          type='text'
          id='search'
          value={searchFilter}
          placeholder='Search by host or title or location'
          onChange={(e) => setSearchFilter(e.target.value)}
          className=' lg:w-96 lg:border-transparent lg:py-2 lg:px-1 lg:focus:border-transparent lg:focus:ring-0 lg:shadow-lg lg:rounded-md'
          />
        </div>
       </div>
        <div className="lg:m-2 ">
          <Link to={"/events/new"}>
            <button className="lg:bg-white lg:text-cyan-400 lg:px-3 lg:py-2 lg:w-30 lg:shadow-md lg:rounded-md">Create Event</button>
          </Link>
        </div>
      </section>
    <div className='lg:p-1 lg:flex lg:justify-center lg:pb-3'>
      {categories.map((category) => {
        return filterCategories.includes(category.name) ? (
          <button
          type='button'
          onClick={() => {
            removeCategory(category.name);
            applyFilters();
          }}
        className='lg:inline lg:shadow lg:text-white lg:bg-blue-700 lg:hover:bg-blue-800 lg:focus:outline-none lg:focus:ring-4 lg:focus:ring-blue-300 lg:font-medium lg:rounded-full lg:text-sm lg:px-5 lg:py-2.5 lg:text-center lg:mr-2 lg:mb-2'>
        
          {category.name}
        </button>
        ) : (
          <button
          type='button'
          onClick={() => {
            addCategory(category.name);
            applyFilters();
          }}
          className='lg:inline lg:shadow lg:shadow-white lg:z-20 lg:py-2.5 lg:px-5 lg:mr-2 lg:mb-2 lg:text-sm lg:font-medium lg:text-gray-900 lg:focus:outline-none lg:bg-gray-200 lg:rounded-full lg:border lg:border-gray-200 lg:hover:bg-gray-100 lg:hover:text-blue-700 lg:focus:z-10 lg:focus:ring-4 lg:focus:ring-gray-200'
        >
          {category.name}
        </button>
        );
      })}
    </div>
    <div class="map-responsive">
      <GoogleMap
        events={events}
        filterEvents={filterEvents}
        filterCategories={filterCategories}
    />
    </div>
    <div className='lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 lg:my-6 lg:m-auto'>
      {currentEvents.length > 0 ?  
        currentEvents : (
        <div className='lg:w-screen lg:flex lg:flex-col lg:justify-center lg:items-center'>
          <h1 className='lg:text-2xl lg:text-center lg:font-semibold'>No Events Found!</h1>
          <div className='lg:w-[25%]'>
            <Lottie animationData={animationData} />
          </div>
          <h3 className='lg:text-lg pb-4'>Start creating events and find people with similar interests</h3>
        </div> ) 
      }
      </div>
      <div className="lg:inline lg:mb-10 lg:font-bold lg:w-20 lg:m-auto">
        {filterEvents.length < pageData ? null :
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