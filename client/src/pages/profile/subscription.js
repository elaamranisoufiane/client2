import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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


export default function Subscription() {

    const [plans, setPlans] = useState([]);
    const [plansPayment, setPlansPayment] = useState([]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get('/api/getAllProductss', {
                    withCredentials: true,
                });
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            }
        };

        fetchPlans();
    }, []);

    useEffect(() => {
        const fetchPlansPayment = async () => {
            try {
                const response = await axios.get('/api/getAllProductsspayment', {
                    withCredentials: true,
                });
                setPlansPayment(response.data);
            } catch (error) {
                console.error("Failed to fetch plans payment:", error);
            }
        };

        fetchPlansPayment();
    }, []);

    const [oldUserInfo, setOldUserInfo] = useState('');
    const [isPro, setisPro] = useState(null);
    //subscription credits
    const [showUpgrade, setShowUpgrade] = useState(false);

    const [ErrorMessage, setErrorMessage] = useState("");
    const [SubscriptionChangeMessage, setSubscriptionChangeMessage] = useState("");


    useEffect(() => {
        axios.get(`/getuser`, { withCredentials: true })
            .then(response => {
                setOldUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching item data:', error);
            });

    }, []);

    useEffect(() => {
        axios({
            method: "get",
            withCredentials: true,
            url: "/checkSubscribe"
        })
            .then(respense => {
                const isPro = JSON.stringify(respense.data);
                setisPro(isPro);
            })
            .catch(err => console.log(err));
    }, []);


    const cancelSubscription = (userId) => {
        axios.delete('/api/cancelSubscription', {
            data: { userId },
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                //if (response) {
                if (response.data) {
                    setSubscriptionChangeMessage('Subscription canceled');
                    window.location.reload();
                } else {
                    setSubscriptionChangeMessage('This user is not subscribed.');
                }

            })
            .catch((error) => {
                setSubscriptionChangeMessage('This user is not subscribed.');
                //console.error('Error deleting item', error);
            });
    };

    const resumingSubscription = (userId) => {
        axios({
            method: "post",
            data: {
                userId,
            },
            withCredentials: true,
            url: "/api/resumingSubscription"
        }).then(response => {
            setSubscriptionChangeMessage('Subscription resumed.');
            window.location.reload();
        })
            .catch(error => {
                setSubscriptionChangeMessage('This user is not subscribed.');
            });
    }


    const changeUserPlan = (userId, variantId) => {
        axios({
            method: "post",
            data: {
                userId,
                variantId: variantId
            },
            withCredentials: true,
            url: "/api/changePlan"
        })
            .then(response => {
                //console.log('Item', response.data);
                setSubscriptionChangeMessage('User\'s plan has been changed.');
                window.location.reload();
            })
            .catch(error => {
                setSubscriptionChangeMessage('This user is not subscribed.', error);
            });
    }

    const [openChnagePlanModal, setOpenChnagePlanModel] = useState(false);
    const [currentProdutsId, setCurrentProductsId] = useState('');


    useEffect(() => {
        const userId = oldUserInfo.id;
        if (userId) {
            axios.get(`/getUserIdProduct?userId=${userId}`)
                .then(response => {
                    setCurrentProductsId(response.data);
                })
                .catch(error => {
                    console.error('Error fetching item data:', error);
                });
        }
    }, [oldUserInfo]);




    return (

        <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen">
            <div className="container bg-white p-10 rounded-lg   mx-auto flex-col">

                <div className="grid grid-cols-1 md:grid-cols-6 md:h-16 gap-4 pt-20 p-6">

                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <p className="text-gray-600">Remaining Days</p>
                        {oldUserInfo.currentPeriodEnd && isPro == 'true' ? (<>
                            <p className="text-2xl font-semibold text-blue-600">{Math.floor((new Date(oldUserInfo.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))}</p>
                        </>) : <p className="text-2xl font-semibold text-gray-600">--</p>}
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <p className="text-gray-600">Current Period End</p>
                        {oldUserInfo.currentPeriodEnd ? (<>
                            <p className="text-2xl font-semibold text-blue-600"> {new Date(oldUserInfo.currentPeriodEnd).toLocaleDateString()} </p>
                        </>) : <p className="text-2xl font-semibold text-gray-600">--</p>}
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <p className="text-gray-600">Generated Images</p>
                        {oldUserInfo.NumberOfAttempt ? (<>
                            <p className="text-2xl font-semibold text-blue-600"> {oldUserInfo.NumberOfAttempt} </p>
                        </>) : <p className="text-2xl font-semibold text-gray-600">--</p>}
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4">

                        <p className="text-gray-600">Subscription Status</p>
                        <div>
                            {isPro ? (
                                <>
                                    {isPro == 'true' ? (
                                        <p className='text-2xl font-semibold text-green-600'>
                                            Active
                                        </p>

                                    ) : (
                                        <p className='text-2xl font-semibold text-red-600'>
                                            Not Active
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-2xl font-semibold text-gray-600">--</p>
                            )}
                        </div>

                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <p className="text-gray-600">Credits</p>
                        {oldUserInfo.credits ? (<>
                            <p className="text-2xl font-semibold text-blue-600"> {oldUserInfo.credits} </p>
                        </>) : <p className="text-2xl font-semibold text-gray-600">--</p>}
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <p className="text-gray-600">Active plan</p>
                        {oldUserInfo.planName ? (<>
                            <p className="text-2xl font-semibold text-blue-600"> {oldUserInfo.planName} </p>
                        </>) : <p className="text-2xl font-semibold text-gray-600">--</p>}
                    </div>

                </div>

                <div className="md:h-16 gap-4 pt-20 p-6">

                    {ErrorMessage && (
                        <p className="text-red-500 text-sm mt-2">{ErrorMessage}</p>
                    )}

                    {SubscriptionChangeMessage && (
                        <p className="text-green-500 text-sm mt-2">{SubscriptionChangeMessage}</p>
                    )}

                    {oldUserInfo.canceled === 0 && oldUserInfo.variantId ? (
                        <div className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                            < a className="w-full inline-flex items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-red-900 focus:shadow-outline focus:outline-none bg-red-500 rounded cursor-pointer " id="upgradeButton" onClick={() => cancelSubscription(oldUserInfo.id)}>Cancel Subscription</a>
                        </div>

                    ) : oldUserInfo.canceled === 1 && oldUserInfo.variantId ? (
                        <div className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                            <a className="w-full inline-flex items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-900 focus:shadow-outline focus:outline-none bg-blue-500 rounded cursor-pointer " id="upgradeButton" onClick={() => resumingSubscription(oldUserInfo.id)}>Resume Subscription</a>
                        </div>
                    ) : null}

                    {oldUserInfo.variantId ? (

                        <div className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                            <a className="w-full inline-flex items-center justify-center h-10 px-6 text-xs md:text-md md:font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-green-900 focus:shadow-outline focus:outline-none bg-green-500 rounded cursor-pointer " id="upgradeButton" onClick={() => setOpenChnagePlanModel(true)}>Change Your Plan</a>
                        </div>

                    ) : null}

                </div>



            </div>



            {openChnagePlanModal ? (
                <div id="showLimiteMessage" className="modal fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80 items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0" >
                    <div className="md:w-2/3 mx-auto inline-block  align-center rounded-lg overflow-hidden shadow-xl  transform transition-all sm:my-8 sm:align-middle bg-white">
                        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900"> Monthly Plans </h3>

                            <button onClick={() => setOpenChnagePlanModel(false)} id="closeModelButton" type="button" className=" text-gray-900 bg-transparent  hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 ">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6">
                                </path></svg><span className="sr-only">Close</span>
                            </button>
                        </div>
                        {ErrorMessage && (
                            <p className="text-red-500 text-sm mt-2">{ErrorMessage}</p>
                        )}

                        {SubscriptionChangeMessage && (
                            <p className="text-green-500 text-sm mt-2">{SubscriptionChangeMessage}</p>
                        )}

                        <div className="justify-center w-auto sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            {plans.map(plan => (
                                <div className={`p-6 space-y-6 flex flex-col relative ${plan.id === currentProdutsId ? 'border border-green-500' : ''}`}>


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
                                    {plan.id !== currentProdutsId && (
                                        <button className="w-[200px] plan-btn bg-primary-500 text-white text-base font-semibold py-2 px-4 rounded-lg mt-4 absolute bottom-5" onClick={(e) => { changeUserPlan(oldUserInfo.id, plan.id) }}> Change To This Plan</button>

                                    )}

                                </div>
                            ))}



                        </div>

                    </div>

                </div>
            ) : null
            }


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
                            {plans.slice().reverse().map(plan => (
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

                        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900"> Credit Based Plans (No Expiry)</h3>

                        </div>

                        <div className="justify-center w-auto sm:grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-6">
                            {plansPayment.slice().reverse().map(plan => (
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

                    </div>

                </div>
            ) : null
            }


        </main>
    );
}
