import React from 'react';

const CompanyInfoCard = ({ company }) => {
    const {
        partner_type_and_detail = {},
        created_time,
    } = company;

    const { company_name, total_experience, company_bio, license_certificate } = partner_type_and_detail;
    const { REACT_APP_API_BASE_URL } = process.env;

    return (
        <main className="">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 bg-white p-4 rounded-lg shadow-md mb-4 md:mb-6">
                {company_name || "Company name not available"}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Experience</p>
                        <p className="text-lg text-gray-700">{total_experience || "N/A"} years</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Application Time</p>
                        <p className="text-lg text-gray-700">{new Date(created_time).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Offer Services</p>
                        <p className="text-lg text-gray-700">Hajj, Umrah, and Visa</p>
                    </div>
                    <div className="flex items-center">
                        <a
                            href={`${REACT_APP_API_BASE_URL}${license_certificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 md:mt-0 bg-[#00936C] text-white text-center px-4 py-2 rounded-md w-full"
                        >
                            License Document
                        </a>
                    </div>
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">
                    {company_bio || "No description available."}
                </p>
            </div>
        </main>
    );
};

export default CompanyInfoCard;
