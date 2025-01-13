// import React from 'react';
// import { Link } from 'react-router-dom';
// import bgimg from '../../assets/bgImage.png';
// import Header from '../../components/Headers/HeaderforSingup';
// import Footer from '../../components/Footers/FooterForSingup';

// const SignupPage = () => {
//   return (
//     <div
//       className="flex flex-col min-h-screen font-sans"
//       style={{
//         backgroundImage: `url(${bgimg})`,
//         backgroundSize: 'cover',
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'center'
//       }}
//     >
//       {/* Fixed Header */}
//       <Header />

//       {/* Content between Header and Footer */}
//       <main className="flex-grow flex justify-center items-center p-4">
//         <div className="w-full max-w-md py-12 px-6 bg-white rounded-lg shadow-custom-shadow md:mx-auto">
//           <h2 className="text-base font-medium mb-1 text-gray-600 text-center">
//             Create your account
//           </h2>
//           <p className="mb-6 text-xs text-gray-500 font-thin text-center">
//             Please sign in to your account and start the adventure
//           </p>
//           <button
//             className="w-full text-sm flex items-center justify-center p-2 mb-3 border text-gray-500 rounded-md cursor-not-allowed"
//             disabled
//           >
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
//               alt="Google"
//               className="w-4 mr-2 ml-2"
//             />
//             Sign up with Google
//           </button>
//           <button
//             className="w-full text-sm flex items-center justify-center p-2 mb-3 border text-gray-500 rounded-md cursor-not-allowed"
//             disabled
//           >
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png"
//               alt="Apple"
//               className="w-4 mr-2"
//             />
//             Sign up with Apple
//           </button>
//           <Link to="/signup/email">
//             <button className="w-full text-sm p-2 mb-3 bg-[#00936C] text-white rounded-md hover:bg-green-900">
//               Sign up with Email
//             </button>
//           </Link>
//         </div>
//       </main>

//       {/* Fixed Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default SignupPage;
