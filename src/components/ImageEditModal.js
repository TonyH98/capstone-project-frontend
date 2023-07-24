import "../pages/EventDetails/tooltip.css"

function ImageEditModal({ updatedEventInfo, handleTextChange, handleEdit }) {
    console.log(updatedEventInfo)
    return (
        <div className="tooltiptext-bottom">
            <div className="lg:w-[500px] lg:mx-5 my-5">
                <label htmlFor="location_image" className="lg:block">Image URL:</label>
                <input
                    type="text"
                    id="location_image"
                    name="location_image"
                    value={updatedEventInfo?.location_image}
                    onChange={handleTextChange}
                    className="lg:w-96 lg:rounded lg:h-8 lg:bg-gray-100 lg:inline"
                />
                <button
                    className="lg:bg-emerald-500 lg:text-white lg:px-8 lg:py-1 lg:mt-3 lg:mb-2 lg:ml-3 lg:rounded-md lg:border lg:inline"
                    onClick={handleEdit}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default ImageEditModal;