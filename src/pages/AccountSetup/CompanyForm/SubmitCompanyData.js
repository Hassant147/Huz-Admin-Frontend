// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import FormData from 'form-data';

// const SubmitCompanyData = ({ formData }) => {
//     const [response, setResponse] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const submitData = async () => {
//             let data = new FormData();

//             data.append('partner_session_token', 'anV0YXppQG1haWxpbmF0b3IuY29tNTI5NTU5MTc=');
//             data.append('company_name', formData['Basic Information'].companyName);
//             data.append('contact_name', formData['Basic Information'].contactName);
//             data.append('contact_number', formData['Basic Information'].contactNumber);
//             data.append('company_website', formData['Basic Information'].websiteURL);
//             data.append('incorporation_number', formData['Registration & Tax Info'].incorporationNumber);
//             data.append('national_tax_number', formData['Registration & Tax Info'].taxNumber);
//             data.append('total_experience', formData['Company Overview'].yearsOfExperience);
//             data.append('company_bio', formData['Company Overview'].companyDetail);

//             const logoFile = formData['Upload Logo'].selectedFile;
//             if (logoFile) {
//                 data.append('company_logo', logoFile);
//             }

//             data.append('street_address', formData['Address Detail'].streetAddress);
//             data.append('address_line2', formData['Address Detail'].addressLine2);
//             data.append('city', formData['Address Detail'].city);
//             data.append('state', formData['Address Detail'].state);
//             data.append('country', formData['Address Detail'].countryRegion);
//             data.append('postal_code', formData['Address Detail'].postalCode);
//             data.append('lat', '');
//             data.append('long', '');

//             const config = {
//                 method: 'post',
//                 maxBodyLength: Infinity,
//                 url: 'http://159.89.172.34/partner/company_documents/',
//                 headers: {
//                     'Authorization': 'Basic a2V6dG9ncm91cDpoMnNvNGgybw==',
//                     ...data.getHeaders()
//                 },
//                 data: data
//             };

//             try {
//                 const response = await axios.request(config);
//                 setResponse(response.data);
//             } catch (error) {
//                 setError(error);
//             }
//         };

//         submitData();
//     }, [formData]);

//     if (response) {
//         return <div>Response: {JSON.stringify(response)}</div>;
//     }

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     return <div>Submitting data...</div>;
// };

// export default SubmitCompanyData;
