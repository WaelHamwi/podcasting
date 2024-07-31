import { SignIn } from '@clerk/nextjs';
import React from 'react';
const Page = () => {
    return (<div className='relative flex items-center justify-center w-full h-screen'>
      <div className='absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md'></div>
      <div className='relative z-10'>
        <SignIn /> {/* built-in */}
      </div>
    </div>);
};
export default Page;
