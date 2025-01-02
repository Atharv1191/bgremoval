import React from 'react';
import { assets } from '../assets/assets';

const Result = () => {
    return (
        <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]">
            <div className="bg-white rounded-lg px-8 py-6 drop-shadow-sm">
                {/* Image Container */}
                <div className="grid sm:grid-cols-2 gap-8">
                    {/* Left side */}
                    <div>
                        <p className="font-semibold text-gray-600 mb-2">Original</p>
                        <img className="rounded-md" src={assets.image_w_bg} alt="Original" />
                    </div>
                    {/* Right side */}
                    <div>
                        <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
                        <div className="rounded-md border border-gray-300 relative bg-layer overflow-hidden h-64 flex items-center justify-center">
                            <img src={assets.image_wo_bg} alt="" />
                            {/* Spinner Loader */}
                            {/* <div className="border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div> */}
                        </div>
                    </div>
                </div>
                {/* buttons */}
                <div className='flex justify-center sm:justify-end items-center gap-4 flex-wrap mt-6 '>
                    <button className='px-8 py-2.5 text-violet-800 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700'>Try another Image </button>
                    <a className='px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full hover:scale-105' href=''>Download Image</a>
                </div>
            </div>
        </div>
    );
};

export default Result;
