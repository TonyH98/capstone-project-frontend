import Aos from "aos";
import "aos/dist/aos.css";
import Hero from "../Landing/Hero";
import AboutApp from "../Landing/AboutApp";
import FutureFeatures from "../Landing/FutureFeatures";
import Footer from "../components/Footer"

export default function LandingPage({ loggedin }) {
  // aos initialization
  Aos.init({
    duration: 1800,
    offset: 0,
  });
  return (
    <div className="">
     
      <Hero loggedin={loggedin} />
      <AboutApp />
      <FutureFeatures/>
      <Footer/>
    </div>
  );
}
