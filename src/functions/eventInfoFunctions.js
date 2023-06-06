// // function validates that the the max age is greater than or equal to the min age
// function checkAge(){
//     if(events.age_restriction){
//       if(events.age_max >= events.age_min){
//           return true
//         } else {
//           return false
//         }
//     } else {
//       return true
//     }
//   }
  
//   // function validates that the min age is greater than or equal to 18
// function checkMinAge(){
//     if(events.age_restriction){
//       if(events.age_min >= 18){
//         return true
//       } else {
//         return false
//       }
//     } else {
//       return true
//     }
//   }
  
//   // function validates that a max number of people is input
// function checkMax(){
//     if(events.max_people > 0){
//       return true
//     } else {
//       return false
//     }
//   }
  
//   // function validates that the event date is not a date in the past
// function checkDate() {
//     const eventDate = new Date(events.date_event);
//     const currentDate = new Date();
  
//     // Set the time component of both dates to midnight
//     eventDate.setHours(0, 0, 0, 0);
//     currentDate.setHours(0, 0, 0, 0);
  
//     if (eventDate >= currentDate) {
//       return true;
//     } else {
//       return false;
//     }
//   }
  
//   // function that uses geocode API to verify and convert address to latitude and longitude for Google Maps rendering
// function verifyAddress () {
//     // resets useState hooks to re-verify on click or on submit
//     setAddressError('')   
//     setAddressIsVerified(false)
  
//     // set Google Maps Geocoding API for purposes of quota management
//     Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    
//     // Get latitude & longitude from address.
//     Geocode.fromAddress(events.address).then(
//       (response) => {
//         const { lat, lng } = response.results[0].geometry.location;
//         setCoordinates({
//           latitude: lat,
//           longitude: lng
//         })
//         setEvents({...events, latitude:lat, longitude:lng})
//         setAddressIsVerified(true)
//       },
//       (error) => {
//         console.error(error);
//         setAddressError("Invalid address")
//         setAddressIsVerified(false)
//         setCoordinates({})
//       }
//     );
//       console.log('addressIsVerified', addressIsVerified)
//   }

//   export { checkAge, checkMinAge, checkMax, checkDate, verifyAddress }