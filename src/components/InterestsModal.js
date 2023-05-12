import axios from "axios";
import { useState, useEffect } from "react";

const API = process.env.REACT_APP_BASE_URL

function InterestsModal({setOpenModal}) {
    const [ categories, setCategories ] = useState([])

    useEffect = (() => {
        axios
            .get(`${API}/category`)
            .then(res =>{
                setCategories(res.data)
                console.log(categories)
            })
            .catch(c => console.warn('catch, c'))
    }, [])

    return (
        <div>
            <div className="w-64 border absolute right-0 bg-gray-200 rounded-xl shadow-md">
                <p>Select all that apply</p>
                <input 
                    type='text' 
                    id='search' 
                    name='search'
                    placeholder="search category"
                    className="h-7 rounded-xl w-48"
                />
                <div>
                    {
                        categories.map((category) => {                   
                            return (
                                <button id={category.id} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {category.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default InterestsModal;