//'use client';
import React, { useState, useEffect, useRef } from 'react';
import gfx1Image from '../../assets/gfx1.webp'
import gfx8Image from '../../assets/gfx8.webp'
import gfx3Image from '../../assets/gfx3.webp'
import gfx4Image from '../../assets/gfx4.webp'
import gfx5Image from '../../assets/gfx5.webp'
import gfx6Image from '../../assets/gfx6.webp'
import gfx7Image from '../../assets/gfx7.png'
import img_100 from '../../assets/img_100.jpeg'
import img_100_1 from '../../assets/img_100_1.jpeg'
import img_100_2 from '../../assets/img_100_2.jpeg'
import upscaleimage from '../../assets/upscaleimage.jpg'
import restoreimage from '../../assets/restoreimage.jpg'

const Home = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);

  //go to top of the page button
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  const videoRef = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Adjust the threshold as needed
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPlay(true);
        } else {
          setPlay(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (

    <>
      <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen">
        <div className="container">


          <div className="relative px-4 mx-auto pt-16 sm:max-w-xl md:px-8 md:max-w-full lg:py-32 lg:pt-[25px] xl:px-20 md:mt-20">
            <div className="max-w-xl mx-auto lg:max-w-screen-xl">
              <div className="mb-16 lg:max-w-lg lg:mb-0">
                <div className="max-w-xl mb-6">
                  <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Effortless Unique Background Generation with AI</h2>
                  <p className="text-base text-gray-700 md:text-lg text-justify">Elevate your visuals with custom AI backgrounds tailored to your images. Simply describe your vision, and our AI background generator will create a unique image backdrop that perfectly complements your photo subject. Stand out from the crowd with captivating designs that leave a lasting impression.</p>
                </div>
                <div className="flex items-center">
                  <a className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/register">Get started for free</a>
                  <a className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800" href="#">❤️ Loved by 300+ customers</a>
                </div>
              </div>
            </div>
            <div className="xl:w-1/2 max-xl:w-1/2 lg:absolute mx-auto sm:max-w-xl lg:bottom-0 lg:right-0 mt-4">
              <img style={{ width: '80%' }} className="img-responsive custom-image" alt="ai background removal" title="ai background removal" src={gfx1Image} />
            </div>
          </div>

          <div className="relative px-4 mx-auto pt-10 sm:max-w-xl md:px-8 md:max-w-full lg:py-32 lg:pt-[25px] xl:px-20 md:mt-20 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 max-w-xl mb-16 lg:mb-0">
              <img style={{ width: '80%' }} className="img-responsive custom-image rounded-md" alt="ai background removal" title="ai background removal" src={upscaleimage} />
            </div>
            <div className="lg:w-1/2 max-w-xl mx-auto">
              <div className="max-w-xl mb-6">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                  Effortless Photo Enhancement with AI Upscaling</h2>
                <p className="text-base text-gray-700 md:text-lg text-justify">Transform your images effortlessly with our AI-powered photo enhancement service. Describe your vision, and our cutting-edge AI algorithms will upscale and refine your photos, providing a unique enhancement that perfectly complements your images. Stand out from the rest with stunning visual improvements that create a lasting impact. Upgrade your photos with ease and let our AI bring your vision to life.</p>
              </div>
              <div className="flex items-center">
                <a className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/register">Get started for free</a>
                <a className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800" href="#">❤️ Loved by 300+ customers</a>
              </div>
            </div>
          </div>

          <div className="relative px-4 mx-auto pt-10 sm:max-w-xl md:px-8 md:max-w-full lg:py-32 lg:pt-[25px] xl:px-20 md:mt-20">
            <div className="max-w-xl mx-auto lg:max-w-screen-xl">
              <div className="mb-16 lg:max-w-lg lg:mb-0">
                <div className="max-w-xl mb-6">
                  <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">Effortless Image Restoration with AI Enhancement</h2>
                  <p className="text-base text-gray-700 md:text-lg text-justify">Revitalize your images seamlessly using our AI-powered image restoration service. Share your vision, and our advanced AI algorithms will enhance and restore your images, delivering a distinctive improvement that harmonizes flawlessly with your subject. Distinguish your visuals with striking enhancements that leave a memorable impression. Enhance your images effortlessly and let our AI infuse new vitality into your creative vision.</p>
                </div>
                <div className="flex items-center">
                  <a className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/register">Get started for free</a>
                  <a className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800" href="#">❤️ Loved by 300+ customers</a>
                </div>
              </div>
            </div>
            <div className="xl:w-1/2 max-xl:w-1/2 lg:absolute mx-auto sm:max-w-xl lg:bottom-0 lg:right-0 mt-4">
              <img style={{ width: '80%' }} className="img-responsive custom-image rounded-md" alt="ai background removal" title="ai background removal" src={restoreimage} />
            </div>
          </div>





          <section className="">
            <div className="container flex flex-col items-start mx-auto px-4 relative py-10 lg:items-center lg:max-w-7xl">
              <h2 className="relative flex items-start justify-start w-full max-w-3xl text-3xl font-bold tracking-tight text-slate-900  sm:text-4xl md:max-w-lg md:mx-auto lg:justify-center lg:text-center">
                Let here what people have to say about us
              </h2>
              <span className="left-[255px] absolute hidden w-12 h-12 text-gray-200 z-40 lg:inline-block lg:-mt-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="absolute right-0 hidden w-12 h-12 -mt-2 -mr-16 text-gray-200 lg:inline-block" viewBox="0 0 975.036 975.036">
                  <path
                    d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"
                    className=""
                    id="tails-selected-element"
                  >
                  </path>
                </svg>
              </span>
              <div className="items-center justify-center w-full mt-12 mb-4 md:grid md:grid-cols-1 md:px-10 lg:flex">
                <div className="flex flex-col items-start justify-start w-full h-auto mb-12 lg:w-1/3 lg:mb-0">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 mr-4 overflow-hidden">
                      <img className="object-cover w-full h-full rounded-full bg-slate-50" alt="ai background generation" title="ai background generation" src={img_100_2} />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="font-bold text-gray-800  lg:font-black">Samantha Rodriguez</h4>
                      <p className="text-primary-500">Lead Graphic Designer</p>
                    </div>
                  </div>
                  <p className="tracking-tight text-base mt-2 text-justify">
                    "Working with AIBgen's AI Background generator has been a game-changer for our design team. The ability to effortlessly generate unique backgrounds tailored to our images has saved us countless hours of manual editing. The results are stunning, and our clients are consistently impressed. Kudos to the AIBgen team!"
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start w-full h-auto px-0 mx-0 mb-12 border-l border-r border-transparent  lg:w-1/3 lg:mb-0 lg:px-8 lg:mx-8 lg:border-gray-200">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 mr-4 overflow-hidden">
                      <img className="object-cover w-full h-full rounded-full bg-slate-50" alt="free ai background removal" title="free ai background removal" src={img_100} />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="font-bold text-gray-800 lg:font-black">Michael Carter</h4>
                      <p className="text-primary-500">Professional Photographer</p>
                    </div>
                  </div>
                  <p className="tracking-tight text-base mt-2 text-justify">
                    "AIBgen's AI Background generator has revolutionized the way I create visuals. As a freelance photographer, I often need to showcase my subjects in different environments. With AIBgen, I can now generate realistic and eye-catching backgrounds that truly enhance my photos."
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start w-full h-auto lg:w-1/3">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 mr-4 overflow-hidden">
                      <img className="object-cover w-full h-full rounded-full bg-slate-50" alt="free ai background generation" title="free ai background removal" src={img_100_1} />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="font-bold text-gray-800 lg:font-black">Emily Patel</h4>
                      <p className="text-primary-500">Small Business Owner</p>
                    </div>
                  </div>
                  <p className="tracking-tight text-base mt-2 text-justify">
                    "Being a non-designer, I always struggled with finding the right backgrounds for my transparent images. AIBgen has been a lifesaver! I can easily describe what I have in mind, and the AI does the rest. The backgrounds it generates are so seamless and professional-looking. AIBgen has made me feel like a design pro, even with limited skills!"
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="text-gray-600 body-font -900 bg-primary-500 md:block">
            <div className="text-center py-10 px-4 bg-primary-500 md:w-10/12 md:mx-auto lg:w-2/3">
              <h1 className="flex-grow text-2xl font-medium title-font text-center text-white">
                Generate unique backgrounds with the AI background generator
              </h1>
              <div className="mt-5 xl:text-center xl:mt-6">
                <a
                  className="bg-white inline-block px-6 py-3 rounded-global xl:p-3 xl:text-lg xl:font-medium xl:text-current"
                  href="/register"
                >
                  Get started for free
                </a>
              </div>
            </div>
          </section>
          <div className="py-6 sm:py-8 lg:py-12">
            <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
              <div className="mb-10 md:mb-16">
                <h2 className="font-bold text-center mb-4 text-3xl text-slate-900md:mb-6 lg:text-4xl">Bring your vision to life with AI</h2>
                <p className="max-w-screen-md md:text-lg mx-auto text-justify">Unleash your creativity with AI-powered photo editing tools. Enhance image quality, create stunning AI art, wallpapers, and personalized avatars, all in one convenient interface. Say goodbye to app-hopping and unlock a world of limitless possibilities.</p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-12 xl:gap-16">
                <div className="flex flex-col items-center">
                  <div className="w-12 md:w-14 h-12 md:h-14 flex justify-center items-center text-indigo-500 mb-6 sm:mb-6">
                    <span className="w-full h-full text-primary" data-aos="fade">
                      <svg xmlns="http://www.w3.org/2000/svg" height="4em" width="4em" viewBox="0 0 512 512">
                        <path d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c-6.25 6.25-14.44 9.37-22.62 9.37-8.19 0-16.38-3.12-22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"></path>
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-center mb-2">Instant AI background generation</h3>
                  <p className="text-center mb-2">Get a new background in seconds with the AI background generator</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 md:w-14 h-12 md:h-14 flex justify-center items-center text-indigo-500 mb-6 sm:mb-6">
                    <span className="w-full h-full text-primary" data-aos="fade">
                      <svg xmlns="http://www.w3.org/2000/svg" height="4em" width="4em" viewBox="0 0 448 512" className="text-red-500">
                        <path d="M0 32v128h128V32H0zm120 120H8V40h112v112zm40-120v128h128V32H160zm120 120H168V40h112v112zm40-120v128h128V32H320zm120 120H328V40h112v112zm40-120v128h128V32H432zm120 120H328V40h112v112zM0 192v128h128V192H0zm120 120H8V200h112v112zm40-120v128h128V192H160zm120 120H168V200h112v112zm40-120v128h128V192H320zm120 120H328V200h112v112zM0 352v128h128V352H0zm120 120H8V360h112v112zm40-120v128h128V352H160zm120 120H168V360h112v112zm40-120v128h128V352H320z"></path>
                      </svg>

                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-center mb-2">Endless Background Style Variety</h3>
                  <p className="mb-2 text-center">Unleash your boundless creativity with an unlimited selection of diverse background styles.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 md:w-14 h-12 md:h-14 flex justify-center items-center text-indigo-500 mb-6 sm:mb-6">
                    <span className="w-full h-full text-primary" data-aos="fade">
                      <svg xmlns="http://www.w3.org/2000/svg" height="4em" width="4em" viewBox="0 0 640 512">
                        <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zm-132.9 88.7L299.3 420.7c-6.2 6.2-16.4 6.2-22.6 0L171.3 315.3c-10.1-10.1-2.9-27.3 11.3-27.3H248V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v112h65.4c14.2 0 21.4 17.2 11.3 27.3z"></path>
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-center mb-2">High-quality downloads</h3>
                  <p className="text-center mb-2">Export your images with AI-generated backgrounds in crystal-clear, high-resolution quality.</p>
                </div>
              </div>
            </div>
          </div>

          <section className="">
            <div className="container px-6 py-16 mx-auto text-center">
              <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight lg:text-5xl">Get a peek at what’s possible with the background generator</h1>
                <p className="mt-6 text-gray-500 ">Create unique promotional campaigns, fast</p>
              </div>
              <div className="flex justify-center mt-10">
                <img className="" alt="ai background remover" title="ai background remover" src={gfx3Image} />
              </div>
            </div>
          </section>

          <section id="features" className="py-16 bg-gray-100">
            <div className="max-w-xl mx-auto mb-10 text-center">
              <h2 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-5xl">
                Add an AI Background in 3 Steps
              </h2>
            </div>

            <div className="md:flex md:flex-wrap justify-center sm:grid sm:grid-cols-1 md:px-10 lg:flex">
              <div className="most-popular md-w-1/4 p-4 border  border-gray-300 rounded-lg mx-2 hover:shadow-lg sm:w-full mb-12 lg:w-1/4 lg:mb-0">
                <div className="flex items-center mb-4">
                  <p className="flex items-center justify-center w-8 h-8 mr-2 text-xl font-bold text-white rounded-full bg-primary-500">
                    1
                  </p>
                  <p className="text-xl font-bold leading-5">Upload your image</p>
                </div>
                <p className="text-sm">Simply upload your image and relax</p>
              </div>

              <div className="most-popular md-w-1/4 p-4 border border-gray-300 rounded-lg mx-2 hover:shadow-lg sm:w-full mb-12 lg:w-1/4 lg:mb-0">
                <div className="flex items-center mb-4">
                  <p className="flex items-center justify-center w-8 h-8 mr-2 text-xl font-bold text-white rounded-full bg-primary-500">
                    2
                  </p>
                  <p className="text-xl font-bold leading-5">Write your prompt</p>
                </div>
                <p className="text-sm">Describe your vision for the background and click generate.</p>
              </div>

              <div className="most-popular md-w-1/4 p-4 border border-gray-300 rounded-lg mx-2 hover:shadow-lg sm:w-full mb-12 lg:w-1/4 lg:mb-0">
                <div className="flex items-center mb-4">
                  <p className="flex items-center justify-center w-8 h-8 mr-2 text-xl font-bold text-white rounded-full bg-primary-500">
                    3
                  </p>
                  <p className="text-xl font-bold leading-5">Download your image</p>
                </div>
                <p className="text-sm">Use the Download button to download your work in high resolution.</p>
              </div>
            </div>
          </section>


          <section className="text-gray-600 body-font -900 bg-primary-500 md:block">
            <div className="text-center py-10 px-4 bg-primary-500 md:w-10/12 md:mx-auto lg:w-2/3">
              <h1 className="flex-grow text-2xl font-medium title-font text-center text-white">
                Generate unique backgrounds with the AI background generator
              </h1>
              <div className="mt-5 xl:text-center xl:mt-6">
                <a className="bg-white inline-block px-6 py-3 rounded-global xl:p-3 xl:text-lg xl:font-medium xl:text-current" href="/register">
                  Get started for free
                </a>
              </div>
            </div>
          </section>

          <div>
            <div className="px-5 py-12">
              <div className="flex max-w-7xl mx-auto items-center gap-6 flex-col lg:flex-row">
                <div className="bg-no-repeat flex justify-center bg-center bg-contain py-2 lg:w-1/2 xl:w-3/5">
                  <img
                    className="py-16 lg:w-5/6 xl:w-3/4 xl:py-0 xl:rounded-md"
                    alt="ai background removal"
                    title="ai background removal"
                    src={gfx4Image}
                  />
                </div>
                <div className="flex flex-col gap-7 sm:text-center lg:w-1/2 lg:text-left">
                  <h1 className="font-extrabold tracking-tight text-slate-900 text-3xl md:text-4xl">
                    Turn text prompts into backgrounds
                  </h1>
                  <p className="text-gray-500 xl:py-6 text-justify">
                    Transform your vision into breathtaking backdrops effortlessly. Simply describe your desired scene, and our
                    text-to-background generator will bring it to life in stunning detail. The more descriptive your prompt, the
                    more precise and tailored the generated background will be. For added convenience, utilize our style
                    selector to quickly enhance your prompt with specific style directions. Experience the ease and speed of
                    creating stunning backgrounds with our intuitive platform.
                  </p>
                  <a
                    className="px-5 py-2 text-white text-center font-bold rounded-global bg-primary-500 hover:transition hover:ease-liner hover:duration-300 hover:scale-105 w-fit sm:mx-auto lg:mx-0"
                    href="/register"
                  >
                    Get started for free
                  </a>
                </div>
              </div>
            </div>
            <div className="px-5 py-12">
              <div className="flex max-w-7xl mx-auto items-center gap-6 flex-col lg:flex-row">
                <div className="flex flex-col gap-7 sm:text-center lg:w-1/2 lg:text-left">
                  <h1 className="font-extrabold tracking-tight text-slate-900 text-3xl md:text-4xl">
                    Generate a background for your profile pictures
                  </h1>
                  <p className="text-gray-500 xl:py-6 text-justify">
                    Stand out online with a distinctive profile picture backdrop. Generate captivating backgrounds using AI for a
                    truly mesmerizing portrait setting. Picture yourself against the backdrop of van Gogh's iconic "Starry
                    Night" or opt for a sleek studio environment to showcase your professionalism and leave a lasting impression
                    on recruiters. Embrace the power of AI to create a unique and memorable visual presence that sets you apart
                    from the crowd.
                  </p>
                  <a
                    className="px-5 py-2 text-white text-center font-bold rounded-global bg-primary-500 hover:transition hover:ease-liner hover:duration-300 hover:scale-105 w-fit sm:mx-auto lg:mx-0"
                    href="/register"
                  >
                    Get started for free
                  </a>
                </div>
                <div className="bg-no-repeat flex justify-center bg-center bg-contain py-2 lg:w-1/2 xl:w-3/5">
                  <img
                    className="py-16 lg:w-5/6 xl:w-3/4 xl:py-0 xl:rounded-md"
                    alt="ai background generator"
                    title="ai background generator"
                    src={gfx5Image}
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-12">
              <div className="flex max-w-7xl mx-auto items-center gap-6 flex-col lg:flex-row">
                <div className="bg-no-repeat flex justify-center bg-center bg-contain py-2 lg:w-1/2 xl:w-3/5">
                  <img
                    className="py-16 lg:w-5/6 xl:w-3/4 xl:py-0 xl:rounded-md"
                    alt="ai background remover"
                    title="ai background remover"
                    src={gfx6Image}
                  />
                </div>
                <div className="flex flex-col gap-7 sm:text-center lg:w-1/2 lg:text-left">
                  <h1 className="font-extrabold tracking-tight text-slate-900 text-3xl md:text-4xl">
                    Showcase your products in unique settings with AI generated background
                  </h1>
                  <p className="text-gray-500 xl:py-6 text-justify">
                    Revitalize your campaign visuals with ai generated backgrounds. Whether you envision an otherworldly
                    atmosphere or a sleek and minimalistic backdrop tailored to showcase your product, our AI can bring your
                    ambitious vision to life within seconds. Say goodbye to stock images and unlock a world of endless
                    possibilities for your creative campaigns.
                  </p>
                  <a
                    className="px-5 py-2 text-white text-center font-bold rounded-global bg-primary-500 hover:transition hover:ease-liner hover:duration-300 hover:scale-105 w-fit sm:mx-auto lg:mx-0"
                    href="/register"
                  >
                    Get started for free
                  </a>
                </div>
              </div>
            </div>
            <section>
              <div className="container px-6 py-16 mx-auto text-center">
                <div className="mx-auto max-w-3xl">
                  <h1 className="text-4xl font-bold text-gray-800 tracking-tight lg:text-5xl">
                    Explore more AI background tools
                  </h1>
                </div>
              </div>
            </section>
          </div>
          <div className="flex flex-col gap-y-5 p-4 max-w-7xl mx-auto py-12 lg:grid lg:grid-cols-2 lg:gap-x-5">
            <div className="p-5 rounded-global bg-pink-50 sm:grid sm:grid-cols-6 lg:relative">
              <div className="sm:col-span-4 sm:flex sm:flex-col sm:justify-center">
                <h1 className="text-slate-900 text-xl font-bold">AI Background Removal</h1>
                <p className="text-sm my-4">No PNG Transparent image? No problem. Simply upload your image and let the AI remove the background!</p>
              </div>
              <img className="mx-auto mt-10 -mb-5 w-48 sm:col-span-2 sm:mt-0 lg:absolute lg:right-0 lg:w-40 lg:bottom-0 lg:mb-0" alt="ai bg remover" src={gfx7Image} />
            </div>
            <div className="p-5 rounded-global relative bg-blue-50 sm:grid sm:grid-cols-6">
              <div className="sm:col-span-4 sm:flex sm:flex-col sm:justify-center">
                <h1 className="text-slate-900 text-xl font-bold">AI Background Generator</h1>
                <p className="text-sm my-4">Describe your vision and generate unique AI backgrounds in a few clicks!</p>
              </div>
              <img className="mx-auto mt-10 -mb-5 w-48 sm:col-span-2 sm:mt-0 lg:absolute lg:right-0 lg:w-40 lg:bottom-0 lg:mb-0" alt="ai bg removal" title="ai bg removal" src={gfx8Image} />
            </div>
          </div>

          {/* <main className="max-w-screen-2xl px-4 md:px-8 mx-auto mt-8">
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h1 className="max-w-lg mb-6 text-3xl font-bold leading-none tracking-tight text-slate-900 md:mx-auto lg:text-4xl" id="Video_demo-section">
                Check Out This Powerful Demo Video & See This Incredible App In Action
              </h1>
            </div>
            <div className="justify-center md:grid md:grid-cols-1 lg:flex">
              <iframe
                ref={videoRef}
                className='w-full h-auto md:h-screen'
                src={`https://www.youtube.com/embed/q1MMo41aHrQ?autoplay=${play ? 1 : 0}&controls=0`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Check Out This Powerful Demo Video"
              ></iframe>
            </div>
          </main> */}

          {/* <main className="max-w-screen-2xl px-4 md:px-8 mx-auto mt-8">
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h1 className="max-w-lg mb-6 text-3xl font-bold leading-none tracking-tight text-slate-900  md:mx-auto lg:text-4xl" id="pricing-section">
                Our Pricing
              </h1>
            </div>

            <div className="justify-center sm:grid sm:grid-cols-1 lg:flex">
              
          <div className="pricing-card flex flex-col border border-gray-300 rounded-lg p-6 text-center hover:shadow-md w-full mb-12 lg:w-1/4 lg:mb-0 lg:ml-2">
            <h2 className="plan-name text-xl text-black font-semibold mb-4">Start Free</h2>
            <ul className="plan-features">
              <li>5 images</li>
              <li>24/5 Support</li>
              <li>AIbgen.com Watermark</li>
              <li>$0/image</li>
            </ul>
            <p className="plan-price text-primary-500 text-lg mt-4">Start for free</p>
            <a className="plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4" href="/register">Start Free</a>
            <p className="plan-note text-gray-600 text-sm mt-4">No Credit card required. Sign up and start using.</p>

          </div>

          
          <div className="pricing-card flex flex-col border border-gray-300 rounded-lg p-6 text-center hover:shadow-md w-full   mb-12 lg:w-1/4 lg:mb-0 lg:ml-2">
            <h2 className="plan-name text-xl text-black font-semibold mb-4">Pro</h2>
            <ul className="plan-features">
              <li>100 images</li>
              <li>24/6 Support</li>
              <li>No Watermark</li>
              <li>$0.19/image only</li>
            </ul>
            <p className="plan-price text-lg text-primary-500 mt-4">$19<span className="plan-price-per-month text-sm text-gray-600">/mo</span></p>
            <a className="plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4" href="/register">Get Started</a>
            <p className="plan-note text-sm text-gray-600 mt-4">You can cancel your subscription anytime.</p>

          </div>

          
          <div className="pricing-card flex flex-col border border-gray-300 rounded-lg p-6 text-center hover:shadow-md w-full   mb-12 lg:w-1/4 lg:mb-0 lg:ml-2">
            <h2 className="plan-name text-xl text-black font-semibold mb-4">Gold</h2>
            <ul className="plan-features">
              <li>Unlimited images</li>
              <li>24/7 Priority Support</li>
              <li>AI Background Removal</li>
              <li>No Watermark</li>
            </ul>
            <p className="plan-price text-lg text-primary-500 mt-4">$49<span className="plan-price-per-month text-sm text-gray-600">/mo</span></p>
            <a className="plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4" href="/register">Get Started</a>
            <p className="plan-note text-sm text-gray-600 mt-4">You can cancel your subscription anytime.</p>


          </div>
        </div>

      </main> */}




          <div className="px-4 py-12 mx-auto sm:max-w-xl md:max-w-full md:px-24 lg:px-8 lg:py-14">
            <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
              <div className="max-w-xl mb-10 text-center md:mx-auto md:mb-12 lg:max-w-2xl">
                <h2 className="max-w-lg mb-6 font-sans font-bold leading-none tracking-tight text-slate-900 text-2xl md:mx-auto lg:text-3xl">AI Tools FAQs</h2>
              </div>
              <div>
                <div className={`border-b  ${open1 ? 'open' : ''}`}>
                  <div className="flex text-lg font-medium py-4 flex-row text-left px-4 w-full items-center justify-between hover:bg-slate-100 " onClick={() => setOpen1(!open1)}>
                    What’s an AI background generator?

                  </div>
                  {open1 && (
                    <div className="px-4 mb-4 mt-2">
                      An AI background generator uses AI and machine learning to replace real backgrounds with virtual ones.
                    </div>
                  )}
                </div>

                <div className={`border-b  ${open4 ? 'open' : ''}`}>
                  <div className="flex text-lg font-medium py-4 flex-row text-left px-4 w-full items-center justify-between hover:bg-slate-100 " onClick={() => setOpen4(!open4)}>
                    What’s an Upscaling for photo enhancement?

                  </div>
                  {open4 && (
                    <div className="px-4 mb-4 mt-2">
                      AI Upscaling is a revolutionary technology that employs artificial intelligence algorithms to enhance and refine images.
                    </div>
                  )}
                </div>

                <div className={`border-b  ${open6 ? 'open' : ''}`}>
                  <div className="flex text-lg font-medium py-4 flex-row text-left px-4 w-full items-center justify-between hover:bg-slate-100 " onClick={() => setOpen6(!open6)}>
                    What’s an AI Image Restoration?

                  </div>
                  {open6 && (
                    <div className="px-4 mb-4 mt-2">
                      AI Image Restoration is a transformative service that uses artificial intelligence to revitalize and enhance images.
                    </div>
                  )}
                </div>


                <div className={`border-b  ${open2 ? 'open' : ''}`}>
                  <div className="flex items-center justify-between text-lg font-medium px-4 py-4 text-left w-full hover:bg-slate-100 " onClick={() => setOpen2(!open2)}>
                    What are the supported formats to download?

                  </div>
                  {open2 && (
                    <div className="px-4 text-base mb-4 mt-2">
                      You can add or download (JPEG) your images to the cloud.
                    </div>
                  )}
                </div>

                <div className={`border-b  ${open3 ? 'open' : ''}`}>
                  <div className="flex items-center justify-between text-lg font-medium px-4 py-4 text-left w-full hover:bg-slate-100 " onClick={() => setOpen3(!open3)}>
                    Is the AI background Removal and Generation free?

                  </div>
                  {open3 && (
                    <div className="px-4 text-base mb-4 mt-2">
                      Yes, you can remove or generate a background with the free version.
                    </div>
                  )}
                </div>



                <div className={`border-b  ${open5 ? 'open' : ''}`}>
                  <div className="flex items-center justify-between text-lg font-medium px-4 py-4 text-left w-full hover:bg-slate-100 " onClick={() => setOpen5(!open5)}>
                    How can I reach for support?
                  </div>
                  {open5 && (
                    <div className="px-4 text-base mb-4 mt-2">
                      You can reach us at majermouATatlaswebDOTsolution. We will be happy to help you.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>



          <section className="text-gray-600 body-font -900 bg-primary-500 md:block">
            <div className="text-center py-10 px-4 bg-primary-500 md:w-10/12 md:mx-auto lg:w-2/3">
              <h1 className="flex-grow text-2xl font-medium title-font text-center text-white">
                Generate unique backgrounds with the AI background generator
              </h1>
              <div className="mt-5 xl:text-center xl:mt-6">
                <a
                  className="bg-white inline-block px-6 py-3 rounded-global xl:p-3 xl:text-lg xl:font-medium xl:text-current"
                  href="/register"
                >
                  Get started for free
                </a>
              </div>
            </div>
          </section>
        </div >
      </main >

      <button
        className={`${isVisible ? 'block' : 'hidden'
          } fixed bottom-4 right-4 p-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full w-10 h-10 text-xl flex items-center justify-center`}
        onClick={scrollToTop}
      >
        <span>^</span>
      </button>



      <style>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        
      `}</style>



    </>
  );

};
export default Home; 