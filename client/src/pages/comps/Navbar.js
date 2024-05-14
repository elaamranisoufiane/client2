import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

const getUsername = async () => {
    try {
        const response = await axios.get('/getUser', {
            withCredentials: true,
        });
        const isAuthenticated = JSON.stringify(response.data);

        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
};

const username = await getUsername().then((result) => {
    return result.username;
});
const role = await getUsername().then((result) => {
    return result.role;
});
// const credits = await getUsername().then((result) => {
//     return result.credits;
// });

const showAddCreditsButton = await getUsername().then((result) => {
    return (result.currentPeriodEnd && moment(result.currentPeriodEnd) > Date.now());
});

const setCheckSubscribe = async () => {
    try {
        const response = await axios.get('/checkSubscribe', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
};

const checkSubscribe = await setCheckSubscribe().then((result) => {
    return result;
});
// Call logout 
const handleLogout = () => {
    axios.get('/logout', { withCredentials: true })
        .then(res => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
};


//get Plans for Month subscription
// const getPlans = async () => {
//     try {
//         const response = await axios.get('/api/getAllProductss', {
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Login failed:", error);
//         return false;
//     }
// };

// const plans = await getPlans().then((result) => {
//     return result;
// });

// //get Plans for Month subscription
// const getPlansPayment = async () => {
//     try {
//         const response = await axios.get('/api/getAllProductsspayment', {
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Login failed:", error);
//         return false;
//     }
// };

// const plansPayment = await getPlansPayment().then((result) => {
//     return result;
// });

let credits = null;

export default function NavBar() {
    const [plans, setPlans] = useState([]);
    const [plansPayment, setPlansPayment] = useState([]);

    useEffect(() => {
        const getPlans = async () => {
            try {
                const response = await axios.get('/api/getAllProductss', {
                    withCredentials: true,
                });
                setPlans(response.data);
            } catch (error) {
                console.error("Login failed:", error);
            }
        };

        getPlans();
    }, []);

    useEffect(() => {
        const getPlansPayment = async () => {
            try {
                const response = await axios.get('/api/getAllProductsspayment', {
                    withCredentials: true,
                });
                setPlansPayment(response.data);
            } catch (error) {
                console.error("Login failed:", error);
            }
        };

        getPlansPayment();
    }, []);


    //dispaly the user name
    const [showProfile, setShowProfile] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showUpgradeAddOnPlan, setShowUpgradeAddOnPlan] = useState(false);
    const [open, setOpen] = useState(false);
    const [showTools, setShowTools] = useState(false);

    useEffect(() => {
        getUsername().then(result => {
            if (result) {
                credits = result.credits;
            }
        });
    }, []);



    const toolsButtonRef = useRef(null);
    const profileButtonRef = useRef(null);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (toolsButtonRef.current && !toolsButtonRef.current.contains(event.target)) {
                setShowTools(false);
            }
        };

        const handleOutsideClickProfile = (event) => {
            if (profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        const handleOutsideClickMenu = (event) => {
            if (menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClickProfile);
        document.addEventListener('click', handleOutsideClickMenu);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('click', handleOutsideClickProfile);
            document.removeEventListener('click', handleOutsideClickMenu);
        };
    });




    return (
        <>
            <nav className="p-4 m-4 md:pl-20 mr-0">
                <div className="container mx-auto flex justify-between items-center">

                    <a className="inline-flex items-center text-black-800 font-bold gap-2.5 text-xl md:text-2xl" href="/">
                        <span className="">RePixer</span>
                    </a>
                    <nav className="hidden lg:flex gap-12">
                        <a className="hover:text-indigo-500 active:text-red-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" label="Home" href="/">Home</a>
                        {!username ? (
                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/pricing">Pricing</a>
                        ) : null}
                        
                        {role == 'admin' ? (
                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/admin/index">Users Management</a>
                        ) : null}
                        {false ? (
                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/admin/add">Add Users</a>
                        ) : null}
                        {username ? (
                            <div className='relative'>
                                <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal cursor-pointer" ref={toolsButtonRef} onClick={() => setShowTools(!showTools)}>Tools</a>
                                {showTools ? (
                                    <ul className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-300 mt-1 py-2 px-3 rounded shadow-md z-50 w-52">
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/remove-background-pro">Remove Background</a>
                                        </li>
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/generate-background-pro">Generate Background</a>
                                        </li>
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/restore-photos-pro">Restore Photos</a>
                                        </li>
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/upscale-photos-pro">Upscale Photos</a>
                                        </li>
                                        {/* <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/photo-editor">Photo Editor</a>
                                        </li> */}
                                    </ul>
                                ) : null}
                            </div>

                        ) :
                            <div className='relative'>
                                <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal cursor-pointer" ref={toolsButtonRef} onClick={() => setShowTools(!showTools)}>Tools</a>
                                {showTools ? (
                                    <ul className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-300 mt-1 py-2 px-3 rounded shadow-md z-50 w-52">
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/remove-background">Remove Background</a>
                                        </li>
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/generate-background">Generate Background</a>
                                        </li>
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/restore-photos">Restore Photos</a>
                                        </li>
                                        <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/upscale-photos">Upscale Photos</a>
                                        </li>
                                        {/* <li>
                                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/photo-editor">Photo Editor</a>
                                        </li> */}
                                    </ul>
                                ) : null}
                            </div>
                        }
                        {!username ? (
                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/register">Register</a>
                        ) : null}
                        {username ? (
                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/gallery">Gallery</a>
                        ) : null}
                        {!username ? (
                            <a className="hover:text-indigo-500 active:text-indigo-700 text-lg font-semibold transition duration-100 lg:text-base lg:font-normal" href="/login">Login</a>
                        ) : null}

                    </nav>
                    {username && !showAddCreditsButton && role != 'admin' ? (
                        <a className="items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded cursor-pointer hidden lg:inline-flex " id="upgradeButton" onClick={() => setShowUpgrade(true)}>Upgrade</a>
                    ) : null}

                    {username && showAddCreditsButton && role != 'admin' ? (
                        <a className="items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded cursor-pointer hidden lg:inline-flex " id="upgradeButton" onClick={() => setShowUpgradeAddOnPlan(true)}>Add-on Plans</a>
                    ) : null}

                    {!username ? (
                        <a className="inline-flex items-center justify-center h-12 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/register">Get started for free</a>
                    ) :
                        <div>

                            <div className="cursor-pointer relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full" ref={profileButtonRef} onClick={() => setShowProfile(!showProfile)}>
                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>


                            <div className="z-10 relative">
                                {showProfile ? (
                                    <ul className="absolute right-0 text-gray-900 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg">
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <span className="text-green-900 hover:text-gray-200" >
                                                Welcome {username}, <span className='font-bold'>Credits: {credits}</span>
                                            </span>
                                        </li>

                                        {username ? (
                                            <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                                <a href='/profile' className="">Profile</a>
                                            </li>
                                        ) : null}
                                        {username ? (
                                            <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                                <a href='/subs' className="">Subscription</a>
                                            </li>
                                        ) : null}

                                        {role == 'admin' ? (
                                            <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                                <a href='/setting' className="">Settings</a>
                                            </li>
                                        ) : null}

                                        {username ? (
                                            <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                                <button onClick={handleLogout} >Logout </button>
                                            </li>
                                        ) : null}

                                    </ul>
                                ) : null}
                            </div>
                        </div>}



                    <div className="z-10 relative">
                        <button
                            className="block lg:hidden w-10 h-10 rounded-md bg-gray-200 "
                            onClick={() => setOpen(!open)}
                            ref={menuButtonRef}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 m-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {open && (
                            <ul className="lg:hidden absolute right-0 text-gray-900 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg">
                                <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                    <a href="/">Home</a>
                                </li>
                                {!username ? (
                                    <>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/pricing">Pricing</a>
                                        </li>


                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/remove-background">Remove Background</a>
                                        </li>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/generate-background">Generate Background</a>
                                        </li>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/restore-photos">Restore Photos</a>
                                        </li>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/upscale-photos">Upscale Photos</a>
                                        </li>
                                        {/* <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/photo-editor">Photo Editor</a>
                                        </li> */}
                                    </>
                                ) : null}

                                {role == 'admin' ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">

                                        <a className="" href="/admin/index">Users Management</a>
                                    </li>
                                ) : null}
                                {false ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                        <a className="" href="/admin/add">Add Users</a>
                                    </li>
                                ) : null}

                                {username ? (
                                    <>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/remove-background-pro">Remove Background</a>
                                        </li>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/generate-background-pro">Generate Background</a>
                                        </li>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/restore-photos-pro">Restore Photos</a>
                                        </li>
                                        <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/upscale-photos-pro">Upscale Photos</a>
                                        </li>
                                        {/* <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                            <a className="" href="/photo-editor">Photo Editor</a>
                                        </li> */}
                                    </>
                                ) : null}
                                {!username ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                        <a className="" href="/register">Register</a>
                                    </li>
                                ) : null}
                                {username ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                        <a className="" href="/gallery">Gallery</a>
                                    </li>
                                ) : null}
                                {!username ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                        <a className="" href="/login">Login</a>
                                    </li>
                                ) : null}
                                {username && !showAddCreditsButton && role != 'admin' ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                        <a className="w-full inline-flex items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded cursor-pointer" id="upgradeButton" onClick={() => setShowUpgrade(true)}>Upgrade</a>
                                    </li>
                                ) : null}

                                {username && showAddCreditsButton && role != 'admin' ? (
                                    <li className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                                        <a className="w-full inline-flex items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded cursor-pointer" id="upgradeButton" onClick={() => setShowUpgradeAddOnPlan(true)}>Add-on Plans </a>
                                    </li>
                                ) : null}




                            </ul>
                        )}
                    </div>
                </div >
            </nav >




            {showUpgrade ? (
                <div id="showLimiteMessage" className="modal fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80 items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0" >
                    <div className="md:w-2/3 mx-auto inline-block  align-center rounded-lg overflow-hidden shadow-xl  transform transition-all sm:my-8 sm:align-middle bg-white">
                        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900"> Monthly Plans </h3>

                            <button onClick={() => setShowUpgrade(false)} id="closeModelButton" type="button" className=" text-gray-900 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 ">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6">
                                </path></svg><span className="sr-only">Close</span>
                            </button>
                        </div>

                        <div className="justify-center w-auto sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            {plans.map(plan => (
                                <div className="p-6 space-y-6 flex flex-col relative">
                                    <div key={plan.id}>
                                        <p className="text-gray-700 text-left">Need more generations?  Upgrade to <b>
                                            {plan.name}
                                        </b> today.
                                        </p>
                                        <div className="flex flex-col">
                                            <div className="flex">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <div className="col-span-11 text-l flex font-semibold pl-2">
                                                    <span className="font-bold">
                                                        {plan.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded w-full flex flex-col border-solid">
                                            <h3 className="text-3xl p-5 text-left pl-6">{plan.name}</h3>
                                            <div className="flex flex-row items-center pt-3 pl-6 pr-10 gap-3 pb-3 text-primary-500">
                                                <div className="flex flex-row gap-1">
                                                    <span className="text-base">$</span>
                                                    <p className="text-5xl font-semibold">{plan.price}</p>
                                                </div>
                                                <p className="font-light text-sm">/ month</p>
                                            </div>
                                            <div className="pl-6 pr-10 gap-3 pb-3 text-left">
                                                <ul className="text-gray-700">
                                                    <li>No advertisements</li>
                                                    <li>Commercial usage of photos</li>
                                                    <li>Premium support</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <a className="w-[200px] plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4 absolute bottom-5" href={plan.checkoutUrl}>Subscribe</a>

                                </div>
                            ))}



                        </div>

                        <hr></hr>

                    </div>

                </div>
            ) : null
            }


            {showUpgradeAddOnPlan ? (
                <div id="showLimiteMessage" className="modal fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80 items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0" >
                    <div className="md:w-2/3 mx-auto inline-block  align-center rounded-lg overflow-hidden shadow-xl  transform transition-all sm:my-8 sm:align-middle bg-white">
                        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900"> Add-on Plans  </h3>

                            <button onClick={() => setShowUpgradeAddOnPlan(false)} id="closeModelButton" type="button" className=" text-gray-900 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 ">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6">
                                </path></svg><span className="sr-only">Close</span>
                            </button>
                        </div>



                        <div className="justify-center w-auto sm:grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-6">
                            {plansPayment.map(plan => (
                                <div className="p-6 space-y-6 flex flex-col relative">
                                    <div key={plan.id}>
                                        <p className="text-gray-700 text-left">Want to buy more credits? Upgrade to <b>
                                            {plan.name}
                                        </b> today.
                                        </p>
                                        <div className="flex flex-col">
                                            <div className="flex">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <div className="col-span-11 text-l flex font-semibold pl-2">
                                                    <span className="font-bold">
                                                        {plan.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded w-full flex flex-col border-solid">
                                            <h3 className="text-3xl p-5 text-left pl-6">{plan.name}</h3>
                                            <div className="flex flex-row items-center pt-3 pl-6 pr-10 gap-3 pb-3 text-primary-500">
                                                <div className="flex flex-row gap-1">
                                                    <span className="text-base">$</span>
                                                    <p className="text-5xl font-semibold">{plan.price}</p>
                                                </div>
                                                <p className="font-light text-sm"></p>
                                            </div>
                                            <div className="pl-6 pr-10 gap-3 pb-3 text-left">
                                                <ul className="text-gray-700">
                                                    <li>No advertisements</li>
                                                    <li>Commercial usage of photos</li>
                                                    <li>Premium support</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <a className="w-[200px] plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4 absolute bottom-5" href={plan.checkoutUrl}>Subscribe</a>

                                </div>
                            ))}



                        </div>

                    </div>

                </div>
            ) : null
            }


        </>



    );
}

