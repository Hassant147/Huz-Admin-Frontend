import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai"; // Importing search icon from React Icons
import Header from "../../../../components/Headers/HeaderForLoggedIn";
// import NavigationBar from "../../../../components/NavigationBarForContent";
import Footer from "../../../../components/Footers/FooterForLoggedIn";

const faqs = [
  {
    question: "How do I register as a vendor on the platform?",
    answer:
      "To register as a vendor, visit our registration page and fill out the required forms. You will need to provide business credentials and details about your Hajj and Umrah packages.",
  },
  {
    question: "What are the fees associated with listing my services?",
    answer:
      "We charge a nominal listing fee for each package you post. Additionally, a transaction fee is applied for each booking made through our platform. Detailed fee structure is available in the vendor dashboard.",
  },
  {
    question: "How can I manage my listings?",
    answer:
      "You can manage your listings through your vendor dashboard. Here, you can add new packages, update existing ones, and track your bookings.",
  },
  {
    question: "What kind of support does the platform offer to vendors?",
    answer:
      "We offer 24/7 support to our vendors. You can reach out to us via email, phone, or live chat for assistance with any issues related to your listings or account.",
  },
  {
    question:
      "Are there any specific requirements for packages listed on your platform?",
    answer:
      "Yes, all packages must meet certain standards regarding safety, quality, and customer service. Detailed requirements can be found in our vendor guidelines.",
  },
  {
    question: "How do payments work on the platform?",
    answer:
      "Payments for bookings are processed through our secure online payment system. Funds are transferred to your account after deducting our fees, typically within a few business days after the service is rendered.",
  },
  {
    question:
      "Can I offer special promotions or discounts through the platform?",
    answer:
      "Yes, vendors can offer special promotions and discounts. You can set up these offers directly through your vendor dashboard under the promotions tab.",
  },
  {
    question: "How do I handle cancellations and refunds?",
    answer:
      "Cancellation policies can be set by the vendor within the guidelines of our platform. Refunds are processed in accordance with these policies and can be managed through the dashboard.",
  },
  {
    question: "What happens if there is a dispute with a customer?",
    answer:
      "In case of disputes, our dedicated support team will intervene to mediate and help resolve the issue in a fair manner, considering the terms of the service agreement.",
  },
  {
    question: "How can I get feedback from customers?",
    answer:
      "Customers can leave reviews and ratings for your services. You can view all customer feedback in your vendor dashboard and use this information to improve your offerings.",
  },
];

const FQA = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const text = "Most asked queries";
  // const textRevealAnimation = (text) => <></>;

  return (
    <div>
      <Header />
      {/* <NavigationBar /> */}
      <div className=" bg-gray-100">
        <div className="p-5 pb-11 w-[90%] mx-auto ">
          <div className="mt-11">
            <div className="flex flex-col lg:flex-row">
              <div className="md:w-[65%]">
                {/* <p className="text-[#00936C]"></p> */}
                <h1 className="mb-2">
                  {text &&
                    text.match(/./gu).map((char, index) => (
                      <span
                        className="animate-text-reveal inline-block [animation-fill-mode:backwards] md:text-base text-[14px]"
                        key={`${char}-${index}`}
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                </h1>
                <h1 className="font-semibold mb-3 text-[#484848] md:text-4xl text-lg leading-relaxed">
                  Frequently asked <br className="hidden lg:inline" /> questions
                </h1>
                <p className="text-gray-600 md:text-base text-[11px]">
                  Trusted in more than 100 countries and 5 million customers.
                </p>
                {/* Search input */}
                <div className="flex items-center border-2 rounded-full py-2 px-3 shadow-sm bg-white md:w-72 md:mt-5 my-5">
                  <input
                    type="text"
                    placeholder="Search"
                    className="outline-none flex-grow text-sm rounded-l-full px-2 caret-[#00936C]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <AiOutlineSearch className="text-gray-500 text-lg" />
                </div>
              </div>
              <div className="w-full mx-auto bg-white rounded-lg shadow-md md:p-7">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`lg:py-7 md:py-4 py-3.5 ${
                      index === faqs.length - 1
                        ? ""
                        : "border-b-[#c7c7c7] border-b"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className={`flex justify-between items-center w-full text-left md:text-[15px] text-[10px] font-medium px-4 py-2 outline-none  ${
                        openIndex === index ? "text-[#00936C]" : ""
                      }`}
                    >
                      {faq.question}
                      <span
                        className={`${
                          openIndex === index ? "rotate-180" : "rotate-0"
                        } transition-transform duration-500`}
                      >
                        <IoIosArrowDown />
                      </span>
                    </button>
                    <Transition
                      show={openIndex === index}
                      enter="transition ease-out duration-500"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition ease-in duration-500"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <p className="bg-white px-4 py-2 pb-7 text-gray-700">
                        {faq.answer}
                      </p>
                    </Transition>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FQA;
