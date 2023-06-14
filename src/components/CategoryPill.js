// Component for category pills in interest modal of user profile page
import axios from "axios";
import { useUser } from "../contexts/UserProvider";

const API = process.env.REACT_APP_API_URL;
function CategoryPill({ category, setIsSelected, isSelected }) {
  const { loggedInUser, setLoggedInUser } = useUser();

  const select = () => {
    axios
      .post(`${API}/users/${loggedInUser?.id}/category/${category.id}`)
      .then(() => {
        axios.get(`${API}/users/${loggedInUser?.id}/category`).then((res) => {
          setIsSelected(res.data);
        });
      });
  };

  // function to unselect an interest
  const unselect = () => {
    axios
      .delete(`${API}/users/${loggedInUser?.id}/category/${category.id}`)
      .then(() => {
        axios.get(`${API}/users/${loggedInUser?.id}/category`).then((res) => {
          setIsSelected(res.data);
        });
      });
  };

  let userCategory = [];
  if (isSelected[0]) {
    userCategory = isSelected.map((ele) => {
      return ele.name;
    });
  }

  // returns category pills with different styling based on if the category is selected with toggle function on click
  return (
    <div>
      {userCategory.includes(category.name) ? (
        <button
          type="button"
          className="inline text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={unselect}
        >
          {category.name}
        </button>
      ) : (
        <button
          type="button"
          className="inline py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={select}
        >
          {category.name}
        </button>
      )}
    </div>
  );
}

export default CategoryPill;
