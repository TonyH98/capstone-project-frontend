import styles from "./modal.module.css";

function LocationEditModal({
  updatedEventInfo,
  handleTextChange,
  handleEdit,
  getCoordinates,
  setOpenLocationEdit
}) {
    console.log(`${updatedEventInfo?.date_event.slice(6)}-${updatedEventInfo?.date_event.slice(0,2)}-${updatedEventInfo?.date_event.slice(3,5)}`)
  return (
    <>
      <div className={`${styles.card}`}>
        <div className="block">
            <label htmlFor="date_event">
                Date
            </label>
            <input
            type="date"
            id="date_event"
            value={`${updatedEventInfo?.date_event.slice(6)}-${updatedEventInfo?.date_event.slice(0,2)}-${updatedEventInfo?.date_event.slice(3,5)}`}
            onChange={handleTextChange}
            required
            className="rounded h-8 ml-2"
          />
        </div>
        {/* {
                    dateError && <p style={{color:"red"}}>{dateError}</p>
                } */}
        <div className="my-2">
            <label 
                htmlFor="start_time"
            >
                Start
            </label>
            <input
                type="time"
                id="start_time"
                value={updatedEventInfo.start_time.slice(0,5)}
                onChange={handleTextChange}
                required
                className="rounded h-8 ml-2 pl-3"
            />
            <label htmlFor="end_time" className="ml-3">
                End
            </label>
            <input
                type="time"
                id="end_time"
                value={updatedEventInfo.end_time.slice(0,5)}
                onChange={handleTextChange}
                required
                className="rounded h-8 ml-2 pl-3"
            />
        </div>
        <div className="mb-2">
            <label htmlFor="location" className="inline">
                Location
            </label>
            <input
            type="text"
            id="location"
            value={updatedEventInfo.location}
            onChange={handleTextChange}
            required
            className="rounded h-8 ml-2 inline w-3/4"
          />
        </div>
        <div className="mb-9">
            <label htmlFor="address">Address</label>
            <input
                type="text"
                id="address"
                value={updatedEventInfo.address}
                onChange={handleTextChange}
                required
                className="rounded h-8 ml-2 w-3/4"
            />
            <button
                type="button"
                className="underline ml-20 text-pink-400 text-md"
                onClick={getCoordinates}
            >
                Verify address
            </button>
        </div>
        <button 
            className="border bg-purple-500 text-white py-1 px-6 rounded shadow position absolute right-10 bottom-4 hover:bg-purple-400"
            onClick={handleEdit}
        >
            Save
        </button>
        <button 
            type="button"
            onClick={() => {setOpenLocationEdit(false)}}
            className="absolute right-4 top-2 font-bold"
        >
            X
        </button>
        {/* {
                addressError && <p style={{color:"red"}}>{addressError}</p>
                } */}
        {/* <div className="mt-2">
            <label htmlFor="location_image">
                Image
            </label>
            <input
                type="text"
                id="location_image"
                value={updatedEventInfo.location_image}
                onChange={handleTextChange}
                className="rounded h-8"
            />
        </div> */}
      </div>
      <div 
        className={styles.cardBg}
        onClick={() => setOpenLocationEdit(false)}
      />
    </>
  );
}

export default LocationEditModal;
