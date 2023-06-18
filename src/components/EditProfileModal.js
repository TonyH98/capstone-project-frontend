import axios from "axios";
import styles from "./modal.module.css";
import { useUser } from "../contexts/UserProvider";
import { useEffect , useState } from "react";

const API = process.env.REACT_APP_API_URL;

function EditProfileModal({ setOpenEditModal, updatedUser, setUpdatedUser }) {
  const { loggedInUser, setLoggedInUser } = useUser();

  // function to update user info on change

  const [imageError, setImageError] = useState("");


  const maxSizeInBytes = 10 * 1024 * 1024





  const handleTextChange = (e) => {
    if (e.target.id === "profile_img") {
      const file = e.target.files[0];

      if (file && file.size > maxSizeInBytes) {
        setImageError("File exceeds 3MB limit.");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        setLoggedInUser({ ...loggedInUser, profile_img: reader.result });
      };

      reader.readAsDataURL(file);
    } 
      else if (e.target.id === "bio"){
        const {value} = e.target

        if(value.length <=200){
          setLoggedInUser((prevEvent) => ({
            ...prevEvent,
            bio: value,
          }));
        }
        else{
          e.target.value = value.substr(0,200)
        }
      }
      else{

      
        setLoggedInUser({ ...loggedInUser, [e.target.id]: e.target.value });

    }
  };

  // function that updates the user information in the users table and closes the modal
  // NEED TO test if working
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
  
  
    if (loggedInUser?.id) {
      if(imageError){
        return 
      }
      const formData = new FormData();
      formData.append("first_name", loggedInUser.first_name);
      formData.append("last_name", loggedInUser.last_name);
      formData.append("pronouns", loggedInUser.pronouns);
      formData.append("bio", loggedInUser.bio);
      formData.append("profile_img", loggedInUser.profile_img); // Append the image file to the form data
  
      axios
        .put(`${API}/users/${loggedInUser?.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setOpenEditModal(false);
          axios.get(`${API}/users/${loggedInUser?.username}`).then((res) => {
            setUpdatedUser(res.data);
            setLoggedInUser(res.data);
          });
        })
        .catch((error) => {
          console.warn("Error:", error);
        });
    }
  };
  



  return (
    <>
      <div
        className={`${styles.cardBg}`}
        onClick={() => setOpenEditModal(false)}
      />
      <div className={`${styles.card} w-1/3 flex flex-col`}>
        <div
          onClick={() => setOpenEditModal(false)}
          className="absolute right-4 top-3 cursor-pointer"
        >
          X
        </div>
        <div>
          <p className="pb-4 pt-2 text-center">Edit Profile Information</p>
          {imageError && <p style={{ color: "red" }}>{imageError}</p>}
          <form className="w-3/4 m-auto flex flex-col gap-y-3">
            <label htmlFor="first_name">
              First Name
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={loggedInUser?.first_name}
                onChange={handleTextChange}
                className="block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
            <label htmlFor="last_name">
              Last Name
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={loggedInUser?.last_name}
                onChange={handleTextChange}
                className="block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
            <label htmlFor="pronouns">
              Pronouns
              <input
                id="pronouns"
                name="pronouns"
                placeholder="optional"
                type="text"
                value={loggedInUser?.pronouns}
                onChange={handleTextChange}
                className="block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
            <label htmlFor="profile_img">
              Profile Image
              <input
                id="profile_img"
                name="profile_img"
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleTextChange}
                className="block w-[100%] pl-3 block m-auto shadow bg-transparent appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
            <label htmlFor="bio">
              Bio
              <textarea
                id="bio"
                name="bio"
                value={loggedInUser?.bio}
                onChange={handleTextChange}
                className="block w-[100%]"
              />
            </label>
            <p className={`${loggedInUser?.bio.length >= 200 ? 'text-red-700' : null}  bottom-5 left-3 text-sm`}>
                        {loggedInUser?.bio.length}/200 characters
                    </p>
          </form>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-emerald-500 text-white px-8 py-1 mt-8 mb-6 rounded-md border w-3/4     m-auto"
        >
          Done
        </button>
      </div>
    </>
  );
}

export default EditProfileModal;
