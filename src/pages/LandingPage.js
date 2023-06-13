import Aos from "aos";
import "aos/dist/aos.css";
import Hero from "../Landing/Hero";
import AboutApp from "../Landing/AboutApp";

export default function LandingPage({ loggedin }) {
  // aos initialization
  Aos.init({
    duration: 1800,
    offset: 0,
  });
  return (
    <div className="">
      <div className="blob w-[800px] h-[800px] rounded-[999px] absolute top-0 right-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"></div>
      <div className="blob w-[1000px] h-[1000px] rounded-[999px] absolute bottom-0 left-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-red-200 via-gray-100 to-blue-100"></div>
      <div className="blob w-[600px] h-[600px] rounded-[999px] absolute bottom-0 left-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-slate-100 via-teal-100 to-blue-100"></div>
      <div className="blob w-[300px] h-[300px] rounded-[999px] absolute bottom-[-10px] left-0 -z-10 blur-3xl bg-opacity-60 bg-gradient-to-r from-green-200 via-cyan-200 to-Fuchsia-300"></div>
      <Hero loggedin={loggedin} />
      <AboutApp />
    </div>
  );
}
