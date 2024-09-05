
import './Navbar.css';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [logoText, setLogoText] = useState('•••••••••••••');
  const [isText, setIsText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isText) {
        fadeOutText();
      } else {
        fadeInText();
      }
      setIsText(!isText);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [isText]);

  const fadeOutText = () => {
    const text = 'PassManager';
    let updatedText = text;

    for (let i = text.length - 1; i >= 0; i--) {
      setTimeout(() => {
        updatedText = updatedText.substring(0, i) + '•' + updatedText.substring(i + 1);
        setLogoText(updatedText);
      }, (text.length - i) * 150); // Delay each letter fade out by 150ms
    }
  };
  const fadeInText = () => {
    const text = 'PassManager';
    let updatedText = '•••••••••';

    for (let i = 0; i < text.length; i++) {
      setTimeout(() => {
        updatedText = updatedText.substring(0, i) + text[i] + updatedText.substring(i + 1);
        setLogoText(updatedText);
      }, i * 150); // Delay each letter fade in by 150ms
    }
  };
  return (
    <nav  className='items-center flex px-56 justify-between w-43  text-2xl  h-16'>
 <div className='logo w-8 '>   <div className='logo -mx-17 top-0 font-bold text-black  '>
        <span className='text-3xl bg-gradient-to-r from-blue-500 via-blue-300 to-white bg-clip-text text-transparent'>&lt;</span>
        <span className='text-3xl transition-all duration-1000 bg-gradient-to-r from-blue-500 via-blue-300 to-white bg-clip-text text-transparent'>
          {logoText}
        </span>
        <span className='text-3xl bg-gradient-to-r from-blue-200 via-blue-300 to-white bg-clip-text text-transparent'>/&gt;</span>
        </div>   </div><div className='flex -mr-96'>
      <ul className='flex  justify-end  -ml-52 top-14'>

        <li className='items flex gap-10 text-white text-xl  '>
          <a className='hover:text-blue-900' href="/">Home</a>
          <a className='hover:text-blue-900' href="/about">About</a>
          <a className='hover:text-blue-900' href="/contact">Contact</a>
        </li>
      </ul></div>
      <div>
      <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="giticon flex">
        <div className='git'>      <button className='giticon flex mt-11 mx-4'>

  <video width="50" height="50"  loop muted autoPlay>
    <source src="github.mp4" type="video/mp4"  />
    Your browser does not support the video tag.
  </video>
</button>
</div>
</a>
<a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="giticon flex">
<button  className=' btn text-sm flex font-bold font-cursive text-blue-100 mr-7'>Get Connect</button></a>
</div>
    </nav>
  );
};

export default Navbar;