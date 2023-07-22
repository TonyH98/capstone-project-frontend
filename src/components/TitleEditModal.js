import "./tooltip.css"

function TitleEditModal({ eventInfo, updatedEventInfo, handleTextChange, handleEdit }) {
    return (
        <div className="tooltiptext-bottom lg:bg-white lg:w-full">
        <div className="lg:ml-10 lg:mt-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedEventInfo.title}
            onChange={handleTextChange}
            className="lg:ml-3 lg:rounded lg:h-8 lg:w-3/4 lg:bg-gray-100"
          />
        </div>
        <div className="lg:ml-10 lg:mb-14">
          <label htmlFor="age_restriction">Age Restriction</label>
          <select
            id="age_restriction"
            name="age_restriction"
            required
            onChange={handleTextChange}
            className="lg:ml-1 lg:mr-6 lg:mt-2 lg:rounded lg:h-8 lg:text-sm lg:pb-1 lg:bg-gray-100"
          >
            {updatedEventInfo.age_restriction ? 
              <option value={true} selected> True </option>
              : <option value={true}> True </option>
            }
            {!updatedEventInfo.age_restriction ? 
              <option value={false} selected> False </option>
              : <option value={false}> False </option>
            }
          </select>
          {updatedEventInfo.age_restriction ? (
  <div className="lg:inline">
    <label htmlFor="age_min">Min</label>
    <input
      type="number"
      id="age_min"
      value={updatedEventInfo.age_min}
      onChange={handleTextChange}
      className="lg:w-14 lg:pr-1 lg:mr-2 lg:text-center lg:rounded lg:h-8 lg:bg-gray-100 lg:ml-1"
    />
    <label htmlFor="age_max">Max</label>
    <input
      type="number"
      id="age_max"
      value={updatedEventInfo.age_max}
      onChange={handleTextChange}
      className="lg:w-14 lg:pr-1 lg:mr-2 lg:text-center lg:rounded lg:h-8 lg:bg-gray-100 lg:ml-1"
    />
  </div>
) : null}
        </div>
        <button
          type="button"
          className="lg:border lg:bg-emerald-500 lg:text-white lg:rounded lg:shadow lg:px-8 lg:py-1 lg:position lg:absolute lg:right-10 lg:bottom-3"
          onClick={handleEdit}
        >
          Save
        </button>
      </div>
    );
}

export default TitleEditModal;