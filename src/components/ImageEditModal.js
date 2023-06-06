import "./tooltip.css"

function ImageEditModal({ updatedEventInfo, handleTextChange, handleEdit }) {
    console.log(updatedEventInfo)
    return (
        <div className="tooltiptext-bottom">
            <div className="w-[500px] mx-5 my-5">
                <label htmlFor="location_image" className="block">Image URL:</label>
                <input
                    type="text"
                    id="location_image"
                    name="location_image"
                    value={updatedEventInfo?.location_image}
                    onChange={handleTextChange}
                    className="w-96 rounded h-8 bg-gray-100 inline"
                />
                <button
                    className="bg-emerald-500 text-white px-8 py-1 mt-3 mb-2 ml-3 rounded-md border inline"
                    onClick={handleEdit}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default ImageEditModal;