"use client";

const helpCategories = [
    "Getting Started",
    "Privacy Settings",
    "Search Profile",
    "Initiate Contact",
    "Membership",
    "Login/Password",
    "Fraud Alert",
    "Help Center/Customer Support",
    "Common Issues",
    "Changing Basic details",
    "Getting responses",
    "Add On Services",
    "Managing your Profile",
    "JSExclusive",
    "Video Profiles",
    "Match Hour",
    "Introducing Free Chat on Jeevansathi",
    "Profile Verification",
    "30-Day Full Refund Guarantee",
];

export default function HelpPage() {
    return (
        <>
           
            {/* ADD BOTTOM PADDING HERE */}
            <main className="pt-20 pb-20 bg-gray-100 min-h-screen">

                {/* CARD WRAPPER WITH TOP MARGIN */}
                <div className="max-w-5xl mx-auto px-6 mt-10">
                    <div className="bg-white shadow-md rounded-xl p-10 border border-gray-200">

                        {/* TOP Heading + Search */}
                        <div className="text-center mb-14">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                What can we help with?
                            </h1>

                            <div className="flex justify-center mt-6 w-full">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full px-5 py-3 border border-gray-300 rounded-l-lg text-base focus:outline-none"
                                />
                                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-base rounded-r-lg whitespace-nowrap">
                                    Search
                                </button>
                            </div>

                        </div>

                        {/* CATEGORY GRID */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-6">
                            Categories
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10">
                            {helpCategories.map((category) => (
                                <div key={category} className="flex flex-col">
                                    <span className="text-gray-800 font-medium text-[15px]">
                                        {category}
                                    </span>

                                    <span className="text-red-500 text-sm mt-1 cursor-pointer hover:underline">
                                        View all questions
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </main>

        </>
    );
}
