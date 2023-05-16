// Will add an axios call to fetch the information of a specific event
// If the map ends up being its own component we can just import it here
// Will probably add the comment section and the attendees as their own components
// The edit button will link to a prefilled edit page and the cancel button will have a modal window asking to confirm cancellation
// The rsvp button is a placeholder and will be replaced with a dropdown
// I left off any links incase anyone else is working on routes to avoid merge conflicts

// import eventPhoto from '../assets/picnic-pic.jpg'

export default function EventDetails() {
  return (
    <div>
        <div className='flex flex-row'>
          <img 
              // src={eventPhoto} 
              alt='event image' 
              className='h-96'
          />
          <div>
              <h1>Title</h1>
              <h2>Date</h2>
              <h2>Age Restrictions</h2>
              <h2>Categories</h2>
              <h2>Summary</h2>
          </div>
          <div className='justify-right'>
              <button>RSVP</button>
              <button>Edit</button>
              <button>Cancel</button>
          </div>
        </div>
      <div>
        <h2>Attendees(Number)</h2>
      </div>
      <div>
        <h2>Comments</h2>
        <p>Comment section will go here</p>
      </div>
    </div>
  );
}
