import axios from 'axios';
import React, { useState } from 'react';
const getUsername = async () => {
    try {
        const response = await axios.get('/getUser', {
            withCredentials: true,
        });
        const isAuthenticated = JSON.stringify(response.data);

        return response.data
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
};

const username = await getUsername().then((result) => {
    return result.username;
});

export default function Overview() {

    return (


        <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen">
            <div className="container bg-white p-10 rounded-lg mx-auto flex-col">
                <div className="">

                    <div className="md:p-8">
                        <h2 className="text-3xl font-semibold mb-6 text-center">Overview </h2>

                        <p className="text-xl mb-8 text-center">
                            Welcome to AIBgen.com - Your Ultimate AI Background Solution!
                            At AIBgen, we believe in the power of artificial intelligence to transform the way you create and enhance visual content. Our AI background generator is your gateway to effortlessly elevating your visuals with custom backgrounds tailored to your images.
                            Why Choose AIBgen.com?

                        </p>
                        <div className="pr-10">
                            <p className="mb-6">
                                Unique Customization: Simply describe your vision, and our AI background generator will create a unique image backdrop that perfectly complements your photo subject. Stand out from the crowd with captivating designs that leave a lasting impression.
                                Loved by Professionals: Join the community of 300+ customers who have embraced AIBgen.com's innovative AI background solutions. Our platform has been trusted and loved by graphic designers, professional photographers, and small business owners alike.

                            </p>

                            <p className="mb-6">
                                Effortless Creativity: Unleash your creativity with AI-powered photo editing tools. Enhance image quality, create stunning AI art, wallpapers, and personalized avatars, all in one convenient interface. Say goodbye to app-hopping and unlock a world of limitless possibilities. </p>

                        </div>


                        <div className="mb-4 text-lg font-semibold">Key Features:</div>
                        <div className="pr-10">
                            <p className="mb-6">
                                Instant AI Background Generation: Get a new background in seconds with our AI background generator.
                            </p>

                            <p className="mb-6">
                                Endless Background Style Variety: Unleash your boundless creativity with an unlimited selection of diverse background styles.
                            </p>
                            <p className="mb-6">
                                High-Quality Downloads: Export your images with AI-generated backgrounds in crystal-clear, high-resolution quality.
                            </p>

                        </div>

                        <div className="mb-4 text-lg font-semibold">Get Started:</div>
                        <p className="mb-6">
                            Ready to experience the future of visual content creation? Get started with AIBgen.com for free and unlock a world of creative possibilities.
                        </p>

                        {!username ? (
                            <a className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/register">Get started for free</a>

                        ) :
                            <a className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 shadow-md hover:bg-blue-500 focus:shadow-outline focus:outline-none bg-primary-500 rounded" href="/dashboard">Get started for free</a>

                        }



                    </div>


                </div>
            </div>
        </main>


    );
}
