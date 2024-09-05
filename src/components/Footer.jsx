import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer relative items-center justify-center flex  bottom-77 w-full h-16 bg-gradient-to-r from-blue-500 via-blue-200 to-blue-600 '>
      <p className='text flex items-center text-xl font-bold justify-center bg-gradient-to-r from-black via-blue-900 to-black text-transparent bg-clip-text'>
        &copy; {new Date().getFullYear()} PassManager. All rights reserved.
      </p>
      <div className=' flex justify-end mr-6 mx-6'>
        <a href="https://mail.google.com/" target='_blank'>
        <lord-icon
          src="https://cdn.lordicon.com/nqisoomz.json"
          trigger="loop"
          delay="2500"
          stroke="bold"
          state="in-assembly"
          colors="primary:#121331,secondary:#b4b4b4,tertiary:#ffffff,quaternary:#3a3347"
          style={{ width: "50px", height: "60px" }}
        >
        </lord-icon></a>
      </div>
    <a href="https://mail.google.com/" target='_blank'>  <p className='mail font-bold'>kimayashimpi777@gmail.com</p></a>
    </div> 
  );
}

export default Footer;
