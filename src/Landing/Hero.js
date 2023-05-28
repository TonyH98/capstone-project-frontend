import React from 'react'
import { Link } from "react-router-dom"
import Lottie from "lottie-react"
import animationData from "../assets/eventHero.json"

export default function Hero() {
  return (
    <div>
        <div className="flex blob bg-opacity-60 bg-gradient-to-r from-purple-300 via-purple-100 to-cyan-400 z-50 h-[88vh] ">
            <div className="flex flex-col justify-center items-center px-6">
                <h2 className="text-4xl font-bold text-cyan-400 ml-4 mb-8 md:max-w-[800px]" data-aos='fade-down' data-aos-delay='400' >Events Made Personal: Discover a World of Events and Connect with Your Kindred Spirits.</h2>
                <p className="font-semibold" data-aos='fade-down' data-aos-delay='500' >Create or join events of your choice</p>
                <div className="wrap z-50" data-aos='fade-down' data-aos-delay='600' >
                    <button className='signup'>
                    <Link to='/signup'>
                    Sign Up
                    </Link>
                    </button>
                </div>
            </div>
            <div className="w-[75%]" data-aos='fade-up' data-aos-delay='700' >
                <Lottie animationData={animationData}/>
            </div>
            <div className="blob bg-opacity-60 bg-gradient-to-r from-purple-300 via-purple-100 to-cyan-400 z-50 blur-3xl h-96"></div>
        </div>
    </div>
  )
}
