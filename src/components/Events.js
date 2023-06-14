import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import EventCard from './EventCard';
import ReactPaginate from 'react-paginate';
import GoogleMap from "../components/MapMultipleMarkers"
import './events.css';
import Lottie from "lottie-react";
import animationData from "../assets/noEvents.json";
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

  const pageCount = Math.ceil(events.length / pageData);

  // useEffect to re-render map when filters change
  useEffect(() => {

  }, [events, filterEvents])

  console.log(filterEvents)

  return (
    <div className='flex flex-col z-50 bg-gradient-to-r from-cyan-50 via-purple-50 to-pink-50'>
       <section className='w-4/5 flex items-center justify-center m-auto py-5'>
       <div className='m-2'>
          <input
          type='text'
          id='search'
          value={searchFilter}
          placeholder='Search by host or title'
          onChange={(e) => setSearchFilter(e.target.value)}
          className=' w-96 border-transparent focus:border-transparent focus:ring-0 shadow-lg rounded-md'
          />
        </div>
        <div className='m-2'>
          <select onChange={(e) => sortByDate(e.target.value)} className='border-transparent focus:border-transparent focus:ring-0 shadow-lg rounded-md'>
            <option value=''>Sort by date</option>
            <option value='Latest to Earliest'>Latest to Earliest</option>
            <option value='Earliest to Latest'>Earliest to Latest</option>
          </select>
        </div>
        <div className="m-2">
          <Link to={"/events/new"}>
            <button className="bg-white text-cyan-400 px-3 py-2 w-30 shadow-md rounded-md">Create Event</button>
          </Link>
        </div>
      </section>
    <div className='categories-responsive p-1 flex sm:flex-wrap justify-center pb-3'>
      {categories.map((category) => {
        return filterCategories.includes(category.name) ? (
          <button
          type='button'
          onClick={() => {
            removeCategory(category.name);
            applyFilters();
          }}
          className='inline shadow text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          {category.name}
        </button>
        ) : (
          <button
          type='button'
          onClick={() => {
            addCategory(category.name);
            applyFilters();
          }}
          className='inline shadow shadow-white z-50 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
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
    <div className='flex flex-wrap gap-x-10 gap-y-6 my-6 justify-center'>
      {currentEvents.length > 0 ?  
        currentEvents : (
        <div className='flex flex-col justify-center items-center mx-auto'>
          <h1 className='text-2xl text-center font-semibold'>No Events Found!</h1>
          <div className='w-[25%]'>
            <Lottie animationData={animationData} />
          </div>
          <h3 className='text-lg pb-4'>Start creating events and find people with similar interests</h3>
        </div> ) 
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
