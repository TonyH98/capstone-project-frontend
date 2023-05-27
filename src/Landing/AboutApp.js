import React from 'react';
import Lottie from "lottie-react"
import animationData from "../assets/friendsGroup.json"

export default function AboutApp() {
  return (
    <section>
        <div className="h-[100vh] p-4 bg-cyan-100/[50%]">
            {/* <div className="blob bg-opacity-60 bg-gradient-to-r from-purple-300 via-purple-100 to-cyan-400 z-50 blur-3xl h-96"></div> */}
            <div className="flex justify-center ">
                <h2 className="font-bold text-2xl md:max-w-[800px] text-center">Discover Events Tailored to Your Passions in a vibrant community of like-minded individuals</h2>
            </div>
            <div className="w-[25%] flex flex-col items-center justify-center p-2">
                <Lottie animationData={animationData} data-aos='fade-up' data-aos-delay='500'/>
                <h3 className='text-lg font-semibold text-center' data-aos='fade-up' data-aos-delay='600' >Discover people with similar interests</h3>
                <p className='text-gray-500 text-sm p-1 text-center' data-aos='fade-up' data-aos-delay='700' >Join our thriving community of passionate individuals and find your tribe. Whether you're into hiking, photography, gaming, or cooking, <span className='italic'>Kick.It</span> connects you with people who share your interests. Say goodbye to solitary adventures and embrace the power of a supportive and engaging community.</p>
            </div>
        </div>
    </section>
  )
}
