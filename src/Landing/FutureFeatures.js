import React from 'react'
import algo from "../assets/icons8-person-64.png"
import check from "../assets/icons8-check-80.png"
import inbox from "../assets/icons8-chat-64.png"
import money from "../assets/icons8-money-80.png"

export default function FutureFeatures() {

  return (
    <div className='flex flex-col justify-center items-center gap-3 p-4 my-10'>
        <h2 className='p-3 text-2xl font-semibold text-cyan-400' data-aos="fade-up" data-aos-delay="500">Future Features</h2>
        <section className='flex gap-8 p-2 justify-center items-center' data-aos="fade-up" data-aos-delay="700">
        <div className="w-[50%] flex flex-col justify-center items-center">
          <img src={inbox} className=''></img>
          <p>Notifications for upcoming events, changes to events, and new messages</p>
        </div>
        <div className="w-[50%] flex flex-col justify-center items-center">
          <img src={check}></img>
          <p>User verification with goverment issued ID for added safety</p>
        </div>
        <div className="w-[50%] flex flex-col justify-center items-center">
          <img src={algo}></img>
          <p>Suggested friends and events algorithm based on common interests/events attented</p>
        </div>
        <div className="w-[50%] flex flex-col justify-center items-center">
          <img src={money}></img>
          <p>Contributions/planning page for added support for event host</p>
        </div>
        </section>
    </div>
  )
}
