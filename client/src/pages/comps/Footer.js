
export default function Footer() {

    return (
        <footer className="container mx-auto flex justify-between items-center">
            <div className="pt-12 lg:pt-16">
                <div className="px-4 mx-auto max-w-7xl md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                        <div className="col-span-full lg:col-span-2">
                            <div className="lg:-mt-2 mb-4">
                                <a
                                    href="/"
                                    className="inline-flex items-center text-black-800 text-xl md:text-2xl font-bold gap-2"
                                >
                                    <span className="">RePixer</span>
                                </a>
                            </div>
                            <p className="text-gray-500 sm:pr-8 mb-6">
                                Unleash Your Creativity with AI-Driven Image Manipulation Tools like Background Generator, Background Removal, Image Upscaler and Restore Image for your photos.
                            </p>

                        </div>

                        <div className="">
                            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">
                                Products
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="">
                                    <a
                                        href="/generate-background"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        AI Background Generator
                                    </a>
                                </div>
                                <div className="">
                                    <a
                                        href="/remove-background"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        AI Background Remover
                                    </a>
                                    <div className="">
                                        <a
                                            href="/restore-photos"
                                            className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                        >
                                            Restore Photos
                                        </a>

                                    </div>
                                    <div className="">
                                        <a
                                            href="/upscale-photos"
                                            className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                        >
                                            Upscale Images
                                        </a>
                                        <div className="">
                                            {/* <a
                                        href="https://aibackgroundgeneration.lemonsqueezy.com/affiliates"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Affiliate Program
                                    </a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">
                                Company
                            </div>
                            <nav className="flex flex-col gap-4">
                                <div className="">
                                    <a
                                        href="/about"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        About
                                    </a>
                                </div>
                                <div className="">
                                    <a
                                        href="#"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Jobs
                                    </a>
                                </div>
                            </nav>
                        </div>
                        <div className="">
                            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">
                                Support
                            </div>
                            <nav className="flex flex-col gap-4">
                                <div className="">
                                    <a
                                        // href="mailto:apps127@yahoo.in"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Contact
                                    </a>
                                </div>
                            </nav>
                        </div>
                        <div className="">
                            <div className="text-gray-800 font-bold tracking-widest uppercase mb-4">
                                Legal
                            </div>
                            <nav className="flex flex-col gap-4">
                                <div className="">
                                    <a
                                        href="/about"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        About Us
                                    </a>
                                </div>
                                <div className="">
                                    <a
                                        // href="mailto:apps127@yahoo.in"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Contact
                                    </a>
                                </div>
                                <div className="">
                                    <a
                                        href="/terms"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Terms of Service
                                    </a>
                                </div>
                                <div className="">
                                    <a
                                        href="/privacy"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Privacy Policy
                                    </a>
                                </div>
                                <div className="">
                                    <a
                                        href="/cookies"
                                        className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                                    >
                                        Cookie settings
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                    <div className="text-gray-400 text-sm text-center border-t py-8">
                        © 2024 All rights reserved by RePixer.
                    </div>

                </div>

            </div>

        </footer >

    );

}