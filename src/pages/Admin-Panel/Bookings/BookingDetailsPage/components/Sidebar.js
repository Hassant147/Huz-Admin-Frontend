import React from 'react';
import mail from '../../../../../assets/booking/mail.svg';
import location from '../../../../../assets/booking/location.svg';
import phone from '../../../../../assets/booking/phone.svg';
import user from '../../../../../assets/booking/user.svg';

const getStatusColor = (status) => {
    switch (status) {
        case 'Rejected':
            return 'bg-[#FDECEA] text-[#F04438] font-semibold';
        case 'Active':
            return 'bg-[#c8eddb] text-[#019267] font-semibold';
        case 'Pending':
            return 'bg-[#fff0e1] text-[#FF9F43] font-semibold';
        case 'Completed':
            return 'bg-[#f1f1f2] text-[#A8AAAE] font-semibold';
        case 'Close':
            return 'bg-[#d6eee7] text-[#00936C] font-semibold';
        default:
            return 'bg-gray-200 text-gray-800 font-semibold';
    }
};

const Sidebar = ({ booking }) => {
    if (!booking) {
        return <div>Loading...</div>;
    }

    const {
        user_fullName,
        user_phone_number,
        user_email,
        user_address_detail = {},
        booking_status,
        user_photo,
    } = booking;

    const {
        street_address = '',
        address_line2 = '',
        city = '',
        state = '',
        country = '',
        postal_code = ''
    } = user_address_detail || {};

    const { REACT_APP_API_BASE_URL } = process.env;

    return (
        <div className="w-full pr-4 pb-4 pl-1 pt-1 bg-white shadow-md rounded-lg">
            <div className={`${getStatusColor(booking_status)} w-24 px-4 py-1.5 font-extralight text-center text-sm rounded-md mb-4 mx-auto sm:mx-0`}>
                {booking_status}
            </div>

            <div className="px-4 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex justify-center items-center overflow-hidden">
                    {user_photo ? (
                        <img src={`${REACT_APP_API_BASE_URL}/media/${user_photo}`} alt="User" className="object-cover w-full h-full" />
                    ) : (
                        <div className="text-gray-500 text-sm">Photo not available</div>
                    )}
                </div>

                <div className="flex flex-col mb-4 mt-4 gap-y-2 w-full">
                    <h2 className="font-thin text-gray-500 text-sm flex items-center">Contact Details</h2>
                    <h2 className="font-light text-gray-600 text-sm flex items-center">
                        <img src={user} alt="User Icon" className="w-4 h-4 mr-2" />
                        <span className="font-thin">
                            {user_fullName ? user_fullName : 'Name not available'}
                        </span>
                    </h2>
                    <p className="font-light text-gray-600 text-sm flex items-center">
                        <img src={phone} alt="Phone Icon" className="w-4 h-4 mr-2" />
                        {user_phone_number ? user_phone_number : 'Phone number not available'}
                    </p>
                    <p className="font-light text-gray-600 text-sm flex items-center">
                        <img src={mail} alt="Mail Icon" className="w-4 h-4 mr-2" />
                        {user_email ? user_email : 'Email not available'}
                    </p>
                </div>

                <div className="text-left w-full">
                    <h2 className="font-thin text-gray-500 text-sm flex">Address Details</h2>
                    <p className="font-light text-gray-600 text-sm flex mt-2">
                        <img src={location} alt="Location Icon" className="w-4 h-4 mr-2" />
                        {street_address || address_line2 || city || state || country || postal_code ? (
                            <>
                                {street_address ? street_address : 'Street address not available'},
                                {address_line2 ? address_line2 : ''} {city ? city : ''}, {state ? state : ''},
                                {country ? country : ''}. {postal_code ? postal_code : ''}
                            </>
                        ) : (
                            'Address not available'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
