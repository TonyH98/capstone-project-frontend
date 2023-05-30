import React from 'react';
import Lottie from "lottie-react";
import animationData from "../assets/friendsGroup.json";
import animation2Data from "../assets/chatting.json";
import animation3Data from "../assets/interested.json";
import animation4Data from "../assets/haveIdeas.json";

export default function AboutApp() {
  return (
    <section>
        <div className="h-[100vh] p-4 bg-cyan-100/[50%]">
            {/* <div className="blob bg-opacity-60 bg-gradient-to-r from-purple-300 via-purple-100 to-cyan-400 z-50 blur-3xl h-96"></div> */}
            <div className="flex flex-col items-center justify-center p-4">
                <h2 className="font-bold text-3xl md:max-w-[800px] text-center" data-aos='fade-up' data-aos-delay='500'>Discover Events Tailored to Your Passions in a vibrant community of like-minded individuals</h2>
                <p className='text-gray-500 md:max-w-[600px] text-center p-4' data-aos='fade-up' data-aos-delay='600'>Our interactive platform fosters meaningful connections. Discover events that align perfectly with your interests, ensuring a truly personalized experience. Enjoy a sleek and intuitive design that enhances your user experience and makes navigating the app a breeze.</p>
            </div>
            <div className='flex gap-4 p-2'>
            <div className=" flex flex-col items-center justify-center p-2">
                <div className='w-[75%]'>
                    <Lottie animationData={animationData} data-aos='fade-up' data-aos-delay='500'/>
                </div>
                <h3 className='text-lg font-semibold text-center text-cyan-400 w-72' data-aos='fade-up' data-aos-delay='600' >Discover people with similar interests</h3>
                <p className='text-gray-500 text-sm text-center w-72' data-aos='fade-up' data-aos-delay='700' >Join our thriving community of passionate individuals and find your tribe. Whether you're into hiking, photography, gaming, or cooking, Our algorithm connects you with people who share your interests.</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
                <div className='w-[65%]'>
                    <Lottie animationData={animation3Data} data-aos='fade-up' data-aos-delay='500'/>
                </div>
                <h3 className='text-lg font-semibold text-center text-cyan-400 w-72' data-aos='fade-up' data-aos-delay='600' >Find Your Perfect Match in Events</h3>
                <p className='text-gray-500 text-sm text-center w-72' data-aos='fade-up' data-aos-delay='700' >Get ready for an adventure-filled calendar! <span className='italic'>Kick.It</span> curates a wide range of events that align with your interests. Discover hidden gems, expand your horizons, and never miss out on exciting opportunities again.</p>
            </div>
            <div className=" flex flex-col items-center justify-center p-2">
                <div className='w-[65%]'>
                    <Lottie animationData={animation4Data} data-aos='fade-up' data-aos-delay='500'/>
                </div>
                <h3 className='text-lg font-semibold text-center text-cyan-400 w-72' data-aos='fade-up' data-aos-delay='600' >Be the host, bring people together</h3>
                <p className='text-gray-500 text-sm text-center w-72' data-aos='fade-up' data-aos-delay='700' >Share your passion and say goodbye to solitary adventures and embrace the power of a supportive and engaging community. Seamlessly manage your event calendar and RSVPs.</p>
            </div>
            <div className=" flex flex-col items-center justify-center p-2">
                <div className='w-[65%] pb-4'>
                    <Lottie animationData={animation2Data} data-aos='fade-up' data-aos-delay='500'/>
                </div>
                <h3 className='text-lg font-semibold text-center text-cyan-400 w-72 p-2' data-aos='fade-up' data-aos-delay='600' >Stay connected with your community</h3>
                <p className='text-gray-500 text-sm text-center w-72' data-aos='fade-up' data-aos-delay='700' >Engagement is the key to personal growth. Build a direct connection with other users. Our chat feature keeps you Connected with fellow enthusiasts, exchange ideas, and learn from each other's experiences.</p>
            </div>
            </div>
        </div>
    </section>
  )
}
