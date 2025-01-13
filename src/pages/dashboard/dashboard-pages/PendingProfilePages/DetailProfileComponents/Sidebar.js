import React from 'react';
import mail from '../../../../../assets/booking/mail.svg';
import location from '../../../../../assets/booking/location.svg';
import phone from '../../../../../assets/booking/phone.svg';
import user from '../../../../../assets/booking/user.svg';

const Sidebar = ({ company }) => {
    if (!company) {
        return <div>Loading...</div>;
    }

    const {
        partner_type_and_detail = {},
        name,
        email,
        phone_number,
        user_photo,
        address,
    } = company;

    const { company_name, contact_name, contact_number, company_logo } = partner_type_and_detail;

    const { REACT_APP_API_BASE_URL } = process.env;

    return (
        <div className="pr-4 pb-4 pl-1 pt-1 bg-white shadow-md rounded-lg">
            <div className="px-4 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex justify-center items-center overflow-hidden">
                    {company_logo ? (
                        <img src={`${REACT_APP_API_BASE_URL}${company_logo}`} alt="Company Logo" className="object-cover w-full h-full" />
                    ) : (
                        <div className="text-gray-500 text-sm">Logo not available</div>
                    )}
                </div>

                <div className="flex flex-col mb-4 mt-4 gap-y-2 w-full">
                    <h2 className="font-thin text-gray-500 text-sm flex items-center">Contact Details</h2>
                    <h2 className="font-light text-gray-600 text-sm flex items-center">
                        <img src={user} alt="User Icon" className="w-4 h-4 mr-2" />
                        <span className="font-thin">
                            {contact_name ? contact_name : 'Name not available'}
                        </span>
                    </h2>
                    <p className="font-light text-gray-600 text-sm flex items-center">
                        <img src={phone} alt="Phone Icon" className="w-4 h-4 mr-2" />
                        {contact_number ? contact_number : 'Phone number not available'}
                    </p>
                    <p className="font-light text-gray-600 text-sm flex items-center">
                        <img src={mail} alt="Mail Icon" className="w-4 h-4 mr-2" />
                        {email ? email : 'Email not available'}
                    </p>
                </div>

                <div className="text-left w-full">
                    <h2 className="font-thin text-gray-500 text-sm flex">Address Details</h2>
                    <p className="font-light text-gray-600 text-sm flex mt-2">
                        <img src={location} alt="Location Icon" className="w-4 h-4 mr-2" />
                        {address ? address : 'Address not available'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
