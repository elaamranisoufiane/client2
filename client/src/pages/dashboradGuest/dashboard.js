import React, { useState, useEffect } from "react";



export default function Subscription() {

    return (

        <main className="max-w-3/4 h-full flex  flex-col items-center min-h-screen">
            <div className="container bg-white p-10 rounded-lg   mx-auto flex-col transition-all">
                <div className="grid grid-cols-1 md:grid-cols-4 md:h-16 gap-4 pt-20 p-6">
                    <a href="/remove-background-pro" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:scale-105 cursor-pointer">
                        <p className="text-2xl font-semibold text-blue-600"> Remove Background </p>
                    </a>
                    <a href="/generate-background-pro" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:scale-105 cursor-pointer">
                        <p className="text-2xl font-semibold text-blue-600"> Generate Background </p>
                    </a>
                    <a href="/restore-photos-pro" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:scale-105 cursor-pointer">
                        <p className="text-2xl font-semibold text-blue-600"> Restore Photo </p>
                    </a>
                    <a href="/upscale-photos-pro" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:scale-105 cursor-pointer">
                        <p className="text-2xl font-semibold text-blue-600"> Upscale Photo </p>
                    </a>
                    {/* <a href="/photo-editor" className="bg-white shadow-lg rounded-lg p-4 transition-transform transform-gpu hover:scale-105 cursor-pointer">
                        <p className="text-2xl font-semibold text-blue-600"> Photo Editor </p>
                    </a> */}

                </div>
            </div>
        </main>
    );
}
