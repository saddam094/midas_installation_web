import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Profile = () => {

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Title and Back Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b">

                {/* Back Button */}
                <Link to={"/"}>
                    <button className="absolute left-4 text-gray-700 hover:text-black">
                        <ArrowBackIcon className="text-xl sm:text-2xl" />
                    </button>
                </Link>

                {/* Title */}
                <h1 className="text-center w-full text-lg sm:text-xl font-semibold text-gray-800">
                    Profile
                </h1>

            </div>


            {/* Profile Picture */}
            <div className="flex justify-center mt-6 sm:mt-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gray-200 flex items-center justify-center bg-gray-100">
                    <svg className="w-14 h-14 sm:w-16 sm:h-16 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2V19.2c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                </div>
            </div>

            {/* Profile Information */}
            <div className="px-4 sm:px-10 mt-6 sm:mt-10 space-y-4 max-w-xl mx-auto">
                {/* Name */}
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Name</label>
                    <input
                        type="text"
                        value="Saddam Hussain"
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none bg-gray-50"
                    />
                </div>

                {/* Department */}
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Department</label>
                    <input
                        type="text"
                        value="Software Engineer"
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none bg-gray-50"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Phone</label>
                    <input
                        type="text"
                        value="6202548771"
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none bg-gray-50"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block font-semibold mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        value="saddambns143@gmail.com"
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none bg-gray-50"
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
