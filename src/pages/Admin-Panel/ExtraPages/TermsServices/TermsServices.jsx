import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminPanelLayout from "../../../../components/layout/AdminPanelLayout";

const TermsServices = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <AdminPanelLayout
      title="Terms of Service"
      subtitle="Review the service terms and obligations for platform usage."
      mainClassName="py-5 bg-gray-50"
    >
      <div className="min-h-screen bg-gray-50 flex flex-col justify-start sm:px-6 lg:px-8">
        <div className="mt-10">
          <h2 className="text-center text-3xl text-gray-900">
            Terms of Service
          </h2>
          <div className="flex flex-col items-center py-8">
            <div className="flex flex-col w-full mb-12 text-left">
              <div className="w-[90%] mx-auto px-3 px-lg-0 text-justify">
                <ol style={{ listStyle: "auto" }} className="text-2xl">
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Your Agreement to these Terms of Service
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    PLEASE READ THESE TERMS OF SERVICE CAREFULLY. THIS IS A
                    BINDING CONTRACT. Welcome to the services operated by Hajj
                    Umrah , Inc. (collectively with its affiliates, “Hajj Umrah”
                    or “We”) consisting of the website available at
                    https://huz.com, and its network of websites, software
                    applications, or any other products or services offered by
                    Hajj Umrah (the “Services”). Other services offered by Hajj
                    Umrah may be subject to separate terms.
                    <br />
                    <br />
                    When using the Hajj Umrah Services, you will be subject to
                    Hajj Umrah’s additional guidelines or rules that are posted
                    on the Hajj Umrah Services, made available to you, or
                    disclosed to you in connection with specific services and
                    features. Hajj Umrah may also offer certain paid services,
                    which are subject to additional terms or conditions that are
                    disclosed to you in connection with such services. All such
                    terms and guidelines are incorporated into these Terms of
                    Service by reference.
                    <br />
                    <br />
                    The Terms of Service apply whether you are a user that
                    registers an account with the Hajj Umrah Services or an
                    unregistered user. You agree that by clicking “Sign Up” or
                    otherwise registering, downloading, accessing, or using the
                    Hajj Umrah Services, you are entering into a legally binding
                    agreement between you and Hajj Umrah regarding your use of
                    the Hajj Umrah Services. You acknowledge that you have read,
                    understood, and agree to be bound by these Terms of Service.
                    If you do not agree to these Terms of Service, do not access
                    or otherwise use any of the Hajj Umrah Services.
                    <br />
                    <br />
                    When using Hajj Umrah or opening an account with Hajj Umrah
                    on behalf of a company, entity, or organization
                    (collectively, “Subscribing Organization”), you represent
                    and warrant that you: (i) are an authorized representative
                    of that Subscribing Organization with the authority to bind
                    that organization to these Terms of Service and grant the
                    licenses set forth herein; and (ii) agree to these Terms of
                    Service on behalf of such Subscribing Organization.
                    <br />
                    <br />
                  </p>

                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Use of Hajj Umrah by Minors and Blocked Persons
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    The Hajj Umrah Services are not available to persons under
                    the age of 13. If you are between the ages of 13 and the age
                    of legal majority in your jurisdiction of residence, you may
                    only use the Hajj Umrah Services under the supervision of a
                    parent or legal guardian who agrees to be bound by these
                    Terms of Service.
                    <br />
                    <br />
                    The Hajj Umrah Services are also not available to any users
                    previously removed from the Hajj Umrah Services by Hajj
                    Umrah or to any persons barred from receiving them under the
                    laws of the United States (such as its export and re-export
                    restrictions and regulations) or applicable laws in any
                    other jurisdiction.
                    <br />
                    <br />
                    BY DOWNLOADING, INSTALLING, OR OTHERWISE USING THE Hajj
                    Umrah SERVICES, YOU REPRESENT THAT YOU ARE AT LEAST 13 YEARS
                    OF AGE, THAT YOUR PARENT OR LEGAL GUARDIAN AGREES TO BE
                    BOUND BY THESE TERMS OF SERVICE IF YOU ARE BETWEEN 13 AND
                    THE AGE OF LEGAL MAJORITY IN YOUR JURISDICTION OF RESIDENCE,
                    AND THAT YOU HAVE NOT BEEN PREVIOUSLY REMOVED FROM AND ARE
                    NOT PROHIBITED FROM RECEIVING THE Hajj Umrah SERVICES.
                    <br />
                    <br />
                  </p>

                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Privacy Policy
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Your privacy is important to Hajj Umrah. Please see our
                    <Link to="/privacy-policy">
                      <span className="text-blue-600 underline cursor-pointer">
                        {" "}
                        Privacy Policy{" "}
                      </span>
                    </Link>
                    or information relating to how we collect, use, and disclose
                    your personal information.
                    <br />
                    <br />
                  </p>

                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Account
                    </h2>
                  </li>

                  <ol style={{ listStyleType: "lower-alpha" }}>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Account and Password
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        In order to open an account, you will be asked to
                        provide us with certain information such as an account
                        name and password.
                        <br />
                        <br />
                        You are solely responsible for maintaining the
                        confidentiality of your account, your password and for
                        restricting access to your computer. If you permit
                        others to use your account credentials, you agree to
                        these Terms of Service on behalf of all other persons
                        who use the Services under your account or password, and
                        you are responsible for all activities that occur under
                        your account or password. Please make sure the
                        information you provide to Hajj Umrah upon registration
                        and at all other times is true, accurate, current, and
                        complete to the best of your knowledge.
                        <br />
                        <br />
                        Unless expressly permitted in writing by Hajj Umrah, you
                        may not sell, rent, lease, share, or provide access to
                        your account to anyone else, including without
                        limitation, charging anyone for access to administrative
                        rights on your account. Hajj Umrah reserves all
                        available legal rights and remedies to prevent
                        unauthorized use of the Hajj Umrah Services, including,
                        but not limited to, technological barriers, IP mapping,
                        and, in serious cases, directly contacting your Internet
                        Service Provider (ISP) regarding such unauthorized use.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Third-Party Accounts
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        Hajj Umrah may permit you to register for and log on to
                        the Hajj Umrah Services via certain third-party
                        services. The third party’s collection, use, and
                        disclosure of your information will be subject to that
                        third-party service’s privacy policy. Further
                        information about how Hajj Umrah collects, uses, and
                        discloses your personal information when you link your
                        Hajj Umrah account with your account on any third-party
                        service can be found in our
                        <Link
                          to="/privacy-policy"
                          className="text-blue-600 underline cursor-pointer"
                        >
                          {" "}
                          Privacy Policy{" "}
                        </Link>
                        .<br />
                        <br />
                      </p>
                    </li>
                  </ol>

                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Use of Devices and Services
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Access to the Hajj Umrah Services may require the use of
                    your personal computer or mobile device, as well as
                    communications with or use of space on such devices. You are
                    responsible for any Internet connection or mobile fees and
                    charges that you incur when accessing the Hajj Umrah
                    Services.
                    <br />
                    <br />
                  </p>

                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Modification of these Terms of Service
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Hajj Umrah may amend any of the terms of these Terms of
                    Service by posting the amended terms. Your continued use of
                    the Hajj Umrah Services after the effective date of the
                    revised Terms of Service constitutes your acceptance of the
                    terms. To the extent you have purchased a subscription to
                    the Service, the modified terms will be effective as to such
                    subscription Service upon your next subscription renewal. In
                    this case, if you object to the updated terms, as your
                    exclusive remedy, you may choose not to renew, including
                    cancelling any terms set to auto-renew. In all other cases,
                    any continued use by you of the Site or the Service after
                    the posting of such modified Terms of Service shall be
                    deemed to indicate your irrevocable agreement to such
                    modified Terms of Service. Accordingly, if at any time you
                    do not agree to be subject to any modified Terms of Service,
                    you may no longer use the Site or Service.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      License
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    The Hajj Umrah Services are owned and operated by Hajj
                    Umrah. Unless otherwise indicated, all content, information,
                    and other materials on the Hajj Umrah Services (excluding
                    User Content, set out in Section 8 below), including,
                    without limitation, Hajj Umrah’s trademarks and logos, the
                    visual interfaces, graphics, design, compilation,
                    information, software, computer code (including source code
                    or object code), services, text, pictures, information,
                    data, sound files, other files, and the selection and
                    arrangement thereof (collectively, the “Materials”) are
                    protected by relevant intellectual property and proprietary
                    rights and laws. All Materials are the property of Hajj
                    Umrah or its subsidiaries or affiliated companies and/or
                    third-party licensors. Unless otherwise expressly stated in
                    writing by Hajj Umrah, by agreeing to these Terms of Service
                    you are granted a limited, non-sublicensable license (i.e.,
                    a personal and limited right) to access and use the Hajj
                    Umrah Services for your personal use or internal business
                    use only.
                    <br />
                    <br />
                    Hajj Umrah reserves all rights not expressly granted in
                    these Terms of Service. This license is subject to these
                    Terms of Service and does not permit you to engage in any of
                    the following: (a) resale or commercial use of the Hajj
                    Umrah Services or the Materials; (b) distribution, public
                    performance or public display of any Materials; (c)
                    modifying or otherwise making any derivative uses of the
                    Hajj Umrah Services or the Materials, or any portion of
                    them; (d) use of any data mining, robots, or similar data
                    gathering or extraction methods; (e) downloading (except
                    page caching) of any portion of the Hajj Umrah Services, the
                    Materials, or any information contained in them, except as
                    expressly permitted on the Hajj Umrah Services; (f)
                    accessing data not intended for users of the Site or the
                    Service, or gaining unauthorized access to an account,
                    server or any other computer system; (g) attempting to
                    probe, scan or test thevulnerability of a system or network
                    or to breach security or authentication measures; (h)
                    attempting to interfere with the function of the Site, the
                    Service, host or network, including, without limitation, via
                    means of submitting a virus to the Site, overloading,
                    “flooding”, “mailbombing”, “crashing”, or sending
                    unsolicited e-mail, including promotions and/or advertising
                    of products or services; or (i) forging any TCP/IP packet
                    header or any part of the header information in any e-mail
                    or newsgroup posting; (j) transmitting, importing,
                    uploading, or incorporating any financial or medical
                    information of any nature, or any sensitive personal
                    information (e.g., Social Security numbers, driver’s license
                    numbers, birth dates, personal bank account numbers,
                    passport or visa numbers, credit card numbers, passwords and
                    security credentials). Violations of the Site’s, the
                    Service’s or Hajj Umrah’s system or network security may
                    result in civil or criminal liability; (k) reverse engineer,
                    decompile, disassemble or otherwise attempt to discover the
                    source code, object code or underlying structure, ideas or
                    algorithms of the Service or any software, documentation or
                    data related to or provided with the Service (“Software”);
                    (l) modify, translate, or create derivative works based on
                    the Service or Software; or copy (except for archival
                    purposes), rent, lease, distribute, pledge, assign, or
                    otherwise transfer or encumber rights to the Service or
                    Software; (m) use or access the Service to build or support,
                    and/or assist a third party in building or supporting,
                    products or services competitive to Hajj Umrah; (n) remove
                    any proprietary notices or labels from the Service or
                    Software; or (o) otherwise use the Service or Software
                    outside of the scope of the rights expressly granted herein.
                    You agree to use the Service and Software only for your own
                    internal business operations, and not to transfer,
                    distribute, sell, republish, resell, lease, sublease,
                    license, sub-license or assign the Service or use the
                    Service for the operation of a service bureau or timesharing
                    service; or (p) any use of the Hajj Umrah Services or the
                    Materials except for their intended purposes. Any use of the
                    Hajj Umrah Services or the Materials except as specifically
                    authorized in these Terms of Service, without the prior
                    written permission of Hajj Umrah, is strictly prohibited and
                    may violate intellectual property rights or other laws.
                    Unless explicitly stated in these Terms of Service, nothing
                    in them shall be interpreted as conferring any license to
                    intellectual property rights, whether by estoppel,
                    implication, or other legal principles. Hajj Umrah can
                    terminate this license as set out in Section 15.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Refunds
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Upgrading and Downgrading: Refunds are processed according
                    to our fair refund policy. Any upgrade or downgrade in your
                    Service use will result in the new Fees being charged at the
                    next billing cycle. There will be no prorating for
                    downgrades in between billing cycles. Downgrading your
                    Service may cause the loss of features or capacity of your
                    User Account. Hajj Umrah does not accept any liability for
                    such loss. Design and build costs and on-boarding costs are
                    non-refundable.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Cancellation and Termination by You
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    You are solely responsible for properly canceling your User
                    Account. An email or phone request to cancel your User
                    Account is not considered cancellation. You can cancel your
                    Hajj Umrah account anytime from the My Account page in your
                    contractor dashboard.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      User Content
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Hajj Umrah allows you to distribute pre-recorded
                    audio-visual works; services and packages, such as but not
                    limited to care services, and to participate in other
                    activities in which you may create, post, transmit, perform,
                    or store content, messages, text, images, applications,
                    code, or other data or materials on the Hajj Umrah Services
                    (“User Content”).
                    <br />
                    <br />
                  </p>
                  <ol style={{ listStyleType: "lower-alpha" }}>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        License to Hajj Umrah
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        (i) Unless otherwise agreed to in a written agreement
                        between you and Hajj Umrah that was signed by an
                        authorized representative of Hajj Umrah, if you submit,
                        transmit, display, perform, post, or store User Content
                        using the Hajj Umrah Services, you grant Hajj Umrah and
                        its sub-licensees, to the furthest extent and for the
                        maximum duration permitted by applicable law (including
                        in perpetuity if permitted under applicable law), an
                        unrestricted, worldwide, irrevocable, fully
                        sub-licenseable, nonexclusive, and royalty-free right
                        to: (a) use, reproduce, modify, adapt, publish,
                        translate, create derivative works from, distribute,
                        perform, and display such User Content (including
                        without limitation for promoting and redistributing part
                        or all of the Hajj Umrah Services (and derivative works
                        thereof) in any form, format, media, or media channels
                        now known or later developed or discovered; and (b) use
                        the name, identity, likeness, and voice (or other
                        biographical information) that you submit in connection
                        with such User Content. Should such User Content contain
                        the name, identity, likeness, and voice (or other
                        biographical information) of third parties, you
                        represent and warrant that you have obtained the
                        appropriate consents and/or licenses for your use of
                        such features and that Hajj Umrah and its sub-licensees
                        are allowed to use them to the extent indicated in these
                        Terms of Service.
                        <br />
                        <br />
                        (ii) With respect to pre-recorded audio-visual works,
                        the rights granted by you hereunder terminate once you
                        delete such User Content from the Hajj Umrah Services,
                        or generally by closing your account, except:(a) to the
                        extent you shared it with others as part of the Hajj
                        Umrah Services and others copied or stored portions of
                        the User Content (e.g., made a Clip); (b) Hajj Umrah
                        used it for promotional purposes; and (c) for the
                        reasonable time it takes to remove from backup and other
                        systems.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        User Content Representations and Warranties
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        You are solely responsible for your User Content and the
                        consequences of posting or publishing it. You represent
                        and warrant that: (1) you are the creator or own or
                        control all right in and to the User Content or
                        otherwise have sufficient rights and authority to grant
                        the rights granted herein; (2) your User Content does
                        not and will not: (a) infringe, violate, or
                        misappropriate any third-party right, including any
                        copyright, trademark, patent, trade secret, moral right,
                        privacy right, right of publicity, or any other
                        intellectual property or proprietary right, or (b)
                        defame any other person; (3) your User Content does not
                        contain any viruses, adware, spyware, worms, or other
                        harmful or malicious code; and (4) unless you have
                        received prior written authorization, your User Content
                        specifically does not contain any pre-release or
                        non-public beta software or any confidential information
                        of Hajj Umrah or third parties. Hajj Umrah reserves all
                        rights and remedies against any users who breach these
                        representations and warranties.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Content is Uploaded at Your Own Risk
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        Hajj Umrah uses reasonable security measures in order to
                        attempt to protect User Content against unauthorized
                        copying and distribution. However, Hajj Umrah does not
                        guarantee that any unauthorized copying, use, or
                        distribution of User Content by third parties will not
                        take place. To the furthest extent permitted by
                        applicable law, you hereby agree that Hajj Umrah shall
                        not be liable for any unauthorized copying, use, or
                        distribution of User Content by third parties and
                        release and forever waive any claims you may have
                        against Hajj Umrah for any such unauthorized copying or
                        usage of the User Content, under any theory. THE
                        SECURITY MEASURES TO PROTECT USER CONTENT USED BY Hajj
                        Umrah HEREIN ARE PROVIDED AND USED “AS-IS” AND WITH NO
                        WARRANTIES, GUARANTEES, CONDITIONS, ASSURANCES, OR OTHER
                        TERMS THAT SUCH SECURITY MEASURES WILL WITHSTAND
                        ATTEMPTS TO EVADE SECURITY MECHANISMS OR THAT THERE WILL
                        BE NO CRACKS, DISABLEMENTS, OR OTHER CIRCUMVENTION OF
                        SUCH SECURITY MEASURES.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Promotions
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        Users may promote, administer, or conduct a promotion
                        (e.g., a contest or sweepstakes) on, through, or
                        utilizing the Hajj Umrah Services (a “Promotion”). If
                        you choose to promote, administer, or conduct a
                        Promotion, you must adhere to the following rules: (1)
                        You may carry out Promotions to the extent permitted by
                        applicable law and you are solely responsible for
                        ensuring that any Promotions comply with any and all
                        applicable laws, obligations, and restrictions; (2) You
                        will be classified as the promoter of your Promotion in
                        the applicable jurisdiction(s) and you will be solely
                        responsible for all aspects of and expenses related to
                        your Promotion, including without limitation the
                        execution, administration, and operation of the
                        Promotion; drafting and posting any official rules;
                        selecting winners; issuing prizes; and obtaining all
                        necessary third-party permissions and approvals,
                        including without limitation filing any and all
                        necessary registrations and bonds. Hajj Umrah has the
                        right to remove your Promotion from the Hajj Umrah
                        Services if Hajj Umrah reasonably believes that your
                        Promotion does not comply with the Terms of Service or
                        applicable law; (3) Hajj Umrah is not responsible for
                        and does not endorse or support any such Promotions. You
                        may not indicate that Hajj Umrah is a sponsor or
                        co-sponsor of the Promotion; and (4) You will display or
                        read out the following disclaimer when promoting,
                        administering, or conducting a Promotion: “This is a
                        promotion by [Your Name]. Hajj Umrah does not sponsor or
                        endorse this promotion and is not responsible for it.”.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Endorsements/Testimonials
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        You agree that your User Content will comply with the
                        FTC’s
                        <span className="text-green-500">
                          {" "}
                          Guidelines Concerning the Use of Testimonials and
                          Endorsements in Advertising{" "}
                        </span>
                        , the FTC’s{" "}
                        <span className="text-green-500">
                          Disclosures Guide
                        </span>
                        , the FTC’s{" "}
                        <span className="text-green-500">
                          {" "}
                          Native Advertising Guidelines
                        </span>
                        , and any other guidelines issued by the FTC from time
                        to time (the “FTC Guidelines”), as well as any other
                        advertising guidelines required under applicable law.
                        For example, if you have been paid or provided with free
                        products in exchange for discussing or promoting a
                        product or service through the Hajj Umrah Services, or
                        if you are an employee of a company and you decide to
                        discuss or promote that company’s products or services
                        through the Hajj Umrah Services, you agree to comply
                        with the FTC Guidelines’ requirements for disclosing
                        such relationships. You, and not Hajj Umrah, are solely
                        responsible for any endorsements or testimonials you
                        make regarding any product or service through the Hajj
                        Umrah Services.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Political Activity
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        Subject to these Terms of Service and the Community
                        Guidelines, you may share political opinions;
                        participate in political activity; provide links to a
                        political committee’s official website, including the
                        contribution page of a political committee; and solicit
                        viewers to make contributions directly to a political
                        committee. You agree, however, that these activities are
                        entirely your own. Moreover, by engaging in these
                        activities, you represent and warrant that you are
                        eligible to engage in them under applicable law, and
                        that you will abide by all relevant laws and regulations
                        while doing so.
                        <br />
                        <br />
                        You agree not to solicit the use of or use any Hajj
                        Umrah monetization tool (e.g., Hajj Umrah Tokens or
                        subscriptions) for the purpose of making or delivering a
                        contribution to a candidate, candidate’s committee,
                        political action committee, ballot committee, or any
                        other campaign committee, or otherwise for the purpose
                        of influencing any election. Candidates for political
                        office are not eligible to use any Hajj Umrah
                        monetization tool in any capacity to raise money for a
                        political campaign.
                        <br />
                        <br />
                      </p>
                    </li>
                  </ol>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Prohibited Conduct
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    YOU AGREE NOT TO violate any law, contract, intellectual
                    property, or other third-party right; not to commit a tort,
                    and that you are solely responsible for your conduct while
                    on the Hajj Umrah Services.
                    <br />
                    <br />
                    You agree that you will comply with these Terms of Service
                    and Hajj Umrah’s Community Guidelines and will not:
                    <br />
                    <br />
                    i. create, upload, transmit, distribute, or store any
                    content that is inaccurate, unlawful, infringing,
                    defamatory, obscene, pornographic, invasive of privacy or
                    publicity rights, harassing, threatening, abusive,
                    inflammatory, or otherwise objectionable;
                    <br />
                    <br />
                    ii. impersonate any person or entity; falsely claim an
                    affiliation with any person or entity; access the Hajj Umrah
                    Services accounts of others without permission; forge
                    another person’s digital signature; misrepresent the source,
                    identity, or content of information transmitted via the Hajj
                    Umrah Services; or perform any other similar fraudulent
                    activity;
                    <br />
                    <br />
                    iii. send junk mail or spam to users of the Hajj Umrah
                    Services, including without limitation unsolicited
                    advertising, promotional materials, or other solicitation
                    material; bulk mailing of commercial advertising, chain
                    mail, informational announcements, charity requests,
                    petitions for signatures, or any of the preceding things
                    related to promotional giveaways (such as raffles and
                    contests); and other similar activities;
                    <br />
                    <br />
                    iv. harvest or collect email addresses or other contact
                    information of other users from the Hajj Umrah Services;
                    <br />
                    <br />
                    v. defame, harass, abuse, threaten, or defraud users of the
                    Hajj Umrah Services, or collect or attempt to collect,
                    personal information about users or third parties without
                    their consent;
                    <br />
                    <br />
                    vi. delete, remove, circumvent, disable, damage, or
                    otherwise interfere with (a) security-related features of
                    the Hajj Umrah Services or User Content, (b) features that
                    prevent or restrict use or copying of any content accessible
                    through the Hajj Umrah Services, (c) features that enforce
                    limitations on the use of the Hajj Umrah Services or User
                    Content, or (d) the copyright or other proprietary rights
                    notices on the Hajj Umrah Services or User Content;
                    <br />
                    <br />
                    vii. reverse engineer, decompile, disassemble, or otherwise
                    attempt to discover the source code of the Hajj Umrah
                    Services or any part thereof, except and only to the extent
                    that this activity is expressly permitted by the law of your
                    jurisdiction of residence;
                    <br />
                    <br />
                    viii. modify, adapt, translate, or create derivative works
                    based upon the Hajj Umrah Services or any part thereof,
                    except and only to the extent that such activity is
                    expressly permitted by applicable law notwithstanding this
                    limitation;
                    <br />
                    <br />
                    ix. interfere with or damage the operation of the Hajj Umrah
                    Services or any user’s enjoyment of them, by any means,
                    including uploading or otherwise disseminating viruses,
                    adware, spyware, worms, or other malicious code;
                    <br />
                    <br />
                    x. relay email from a third party’s mail servers without the
                    permission of that third party;
                    <br />
                    <br />
                    xi. access any website, server, software application, or
                    other computer resource owned, used, and/or licensed by Hajj
                    Umrah , including but not limited to the Hajj Umrah
                    Services, by means of any robot, spider, scraper, crawler,
                    or other automated means for any purpose, or bypass any
                    measures Hajj Umrah may use to prevent or restrict access to
                    any website, server, software application, or other computer
                    resource owned, used, and/or licensed by Hajj Umrah,
                    including but not limited to the Hajj Umrah Services;
                    <br />
                    <br />
                    xii. manipulate identifiers in order to disguise the origin
                    of any User Content transmitted through the Hajj Umrah
                    Services;
                    <br />
                    <br />
                    xiii. interfere with or disrupt the Hajj Umrah Services or
                    servers or networks connected to the Hajj Umrah Services, or
                    disobey any requirements, procedures, policies, or
                    regulations of networks connected to the Hajj Umrah
                    Services; use the Hajj Umrah Services in any manner that
                    could interfere with, disrupt, negatively affect, or inhibit
                    other users from fully enjoying the Hajj Umrah Services, or
                    that could damage, disable, overburden, or impair the
                    functioning of the Hajj Umrah Services in any manner;
                    <br />
                    <br />
                    xiv. use or attempt to use another user’s account without
                    authorization from that user and Hajj Umrah;
                    <br />
                    <br />
                    xv. attempt to circumvent any content filtering techniques
                    we employ, or attempt to access any service or area of the
                    Hajj Umrah Services that you are not authorized to access;
                    <br />
                    <br />
                    xvi. attempt to indicate in any manner, without our prior
                    written permission, that you have a relationship with us or
                    that we have endorsed you or any products or services for
                    any purpose; and
                    <br />
                    <br />
                    xvii. use the Hajj Umrah Services for any illegal purpose,
                    or in violation of any local, state, national, or
                    international law or regulation, including without
                    limitation laws governing intellectual property and other
                    proprietary rights, data protection, and privacy.
                    <br />
                    <br />
                    To the extent permitted by applicable law, Hajj Umrah takes
                    no responsibility and assumes no liability for any User
                    Content or for any loss or damage resulting therefrom, nor
                    is Hajj Umrah liable for any mistakes, defamation, slander,
                    libel, omissions, falsehoods, obscenity, pornography, or
                    profanity you may encounter when using the Hajj Umrah
                    Services. Your use of the Hajj Umrah Services is at your own
                    risk. In addition, these rules do not create any private
                    right of action on the part of any third party or any
                    reasonable expectation that the Hajj Umrah Services will not
                    contain any content that is prohibited by such rules.
                    <br />
                    <br />
                    Hajj Umrah is not liable for any statements or
                    representations included in User Content. Hajj Umrah does
                    not endorse any User Content, opinion, recommendation, or
                    advice expressed therein, and Hajj Umrah expressly disclaims
                    any and all liability in connection with User Content. To
                    the fullest extent permitted by applicable law, Hajj Umrah
                    reserves the right to remove, screen, or edit any User
                    Content posted or stored on the Hajj Umrah Services at any
                    time and without notice, including where such User Content
                    violates these Terms of Service or applicable law, and you
                    are solely responsible for creating backup copies of and
                    replacing any User Content you post or store on the Hajj
                    Umrah Services at your sole cost and expense. Any use of the
                    Hajj Umrah Services in violation of the foregoing violates
                    these Terms of Service and may result in, among other
                    things, termination or suspension of your rights to use the
                    Hajj Umrah Services.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Respecting Copyright
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Hajj Umrah respects the intellectual property of others and
                    follows the requirements set forth in the Digital Millennium
                    Copyright Act (“DMCA”) and other applicable laws. If you are
                    the copyright owner or agent thereof and believe that
                    content posted on the Hajj Umrah Services infringes upon
                    your copyright, please submit your request with sufficient
                    detail including as much information as necessary for Hajj
                    Umrah to identify and evaluate your request to
                    <span className="text-blue-600 underline">
                      {" "}
                      hello@Hajj Umrah.com
                    </span>{" "}
                    Attn: Legal, or Hajj Umrah, LLC., Attn: Legal, 3801
                    Meadowknolls rd, Marion, IA 52302. All requests must include
                    the information you may have that will help us identify the
                    relevant records (particularly, the Hajj Umrah Service at
                    issue, e.g., Hajj Umrah.com, and the username at issue), the
                    specific information requested, and its relationship to your
                    investigation. Please also note that limiting your request
                    to the relevant records (e.g., a limited time period) will
                    facilitate efficient processing of your request.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Trademarks
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    Hajj Umrah, the Hajj Umrah logos, and any other product or
                    service name, logo, or slogan used by Hajj Umrah, and the
                    look and feel of the Hajj Umrah Services, including all page
                    headers, custom graphics, button icons, and scripts, are
                    trademarks or trade dress of Hajj Umrah, and may not be used
                    in whole or in part in connection with any product or
                    service that is not Hajj Umrah’s, in any manner that is
                    likely to cause confusion among customers, or in any manner
                    that disparages or discredits Hajj Umrah, without our prior
                    written permission. Any use of these trademarks must be in
                    accordance with all applicable laws.
                    <br />
                    <br />
                    All other trademarks referenced in the Hajj Umrah Services
                    are the property of their respective owners. Reference on
                    the Hajj Umrah Services to any products, services,
                    processes, or other information by trade name, trademark,
                    manufacturer, supplier, or otherwise does not constitute or
                    imply endorsement, sponsorship, or recommendation thereof by
                    us or any other affiliation.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Third-Party Content
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    In addition to the User Content, Hajj Umrah may provide
                    other third-party content on the Hajj Umrah Services
                    (collectively, the “Third-Party Content”). Hajj Umrah does
                    not control or endorse any Third-Party Content and makes no
                    representation or warranties of any kind regarding the
                    Third-Party Content, including without limitation regarding
                    its accuracy or completeness. Please be aware that we do not
                    create Third-Party Content, update, or monitor it.
                    Therefore, we are not responsible for any Third-Party
                    Content on the Hajj Umrah Services.
                    <br />
                    <br />
                    You are responsible for deciding if you want to access or
                    use third-party websites or applications that link from the
                    Hajj Umrah Services (the “Reference Sites”). Hajj Umrah does
                    not control or endorse any such Reference Sites or the
                    information, materials, products, or services contained on
                    or accessible through Reference Sites, and makes no
                    representations or warranties of any kind regarding the
                    Reference Sites. In addition, your correspondence or
                    business dealings with, or participation in promotions of,
                    advertisers found on or through the Hajj Umrah Services are
                    solely between you and such advertiser. Access and use of
                    Reference Sites, including the information, materials,
                    products, and services on or available through Reference
                    Sites is solely at your own risk.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Idea Submission
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    By submitting ideas, suggestions, documents, and/or
                    proposals (the “Submissions”) to Hajj Umrah or its
                    employees, you acknowledge and agree that Hajj Umrah shall
                    be entitled to use or disclose such Submissions for any
                    purpose in any way without providing compensation or credit
                    to you.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Termination
                    </h2>
                  </li>

                  <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                    To the fullest extent permitted by applicable law, Hajj
                    Umrah reserves the right, without notice and in our sole
                    discretion, to terminate your license to use the Hajj Umrah
                    Services (including to post User Content) and to block or
                    prevent your future access to and use of the Hajj Umrah
                    Services, including where we reasonably consider that: (a)
                    your use of the Hajj Umrah Services violates these Terms of
                    Service or applicable law; (b) you fraudulently use or
                    misuse the Hajj Umrah Services; or (c) we are unable to
                    continue providing the Hajj Umrah Services to you due to
                    technical or legitimate business reasons. Our right to
                    terminate your license includes the ability to terminate or
                    to suspend your access to any purchased products or
                    services. To the fullest extent permitted by applicable law,
                    your only remedy with respect to any dissatisfaction with:
                    (i) the Hajj Umrah Services, (ii) any term of these Terms of
                    Service, (iii) any policy or practice of Hajj Umrah in
                    operating the Hajj Umrah Services, or (iv) any content or
                    information transmitted through the Hajj Umrah Services, is
                    to terminate your account and to discontinue use of any and
                    all parts of the Hajj Umrah Services. We will not refund or
                    reimburse you if we terminate your User Account for cause,
                    including but not limited to a violation of these Terms of
                    Service. Once your User Account is terminated, we may
                    permanently delete your User Account and any or all User
                    Content associated with it. If you do not log in to your
                    User Account for 12 or more months, we may treat your User
                    Account as “inactive” and permanently delete the User
                    Account and all the data associated with it. Except where an
                    exclusive remedy may be specified in this Agreement, the
                    exercise by either party of any remedy, including
                    termination, will be without prejudice to any other remedies
                    it may have under these Terms of Service. All sections of
                    this Agreement which by their nature should survive
                    termination will survive, including without limitation,
                    accrued rights to payment, use restrictions and indemnity
                    obligations, confidentiality obligations, warranty
                    disclaimers, and limitations of liability.
                    <br />
                    <br />
                  </p>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Disputes
                    </h2>
                  </li>

                  <ol style={{ listStyleType: "lower-alpha" }}>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Indemnification
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        To the fullest extent permitted by applicable law, you
                        agree to indemnify, defend, and hold harmless Hajj
                        Umrah, its affiliated companies, and each of our
                        respective contractors, employees, officers, directors,
                        agents, third-party suppliers, licensors, and partners
                        (individually and collectively, the “Hajj Umrah
                        Parties”) from any claims, losses, damages, demands,
                        expenses, costs, and liabilities, including legal fees
                        and expenses, arising out of or related to your access,
                        use, or misuse of the Hajj Umrah Services, any User
                        Content you post, store, or otherwise transmit in or
                        through the Hajj Umrah Services, your violation of the
                        rights of any third party, any violation by you of these
                        Terms of Service, or any breach of the representations,
                        warranties, and covenants made by you herein. You agree
                        to promptly notify the Hajj Umrah Parties of any
                        third-party claim, and Hajj Umrah reserves the right, at
                        your expense, to assume the exclusive defense and
                        control of any matter for which you are required to
                        indemnify Hajj Umrah, and you agree to cooperate with
                        Hajj Umrah’s defense of these claims. Hajj Umrah will
                        use reasonable efforts to notify you of any such claim,
                        action, or proceeding upon becoming aware of it.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Disclaimers; No Warranties
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW: (A)
                        THE Hajj Umrah SERVICES AND THE CONTENT AND MATERIALS
                        CONTAINED THEREIN ARE PROVIDED ON AN “AS IS” BASIS
                        WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                        IMPLIED, EXCEPT AS EXPRESSLY PROVIDED TO THE CONTRARY IN
                        WRITING BY Hajj Umrah; (B) THE Hajj Umrah PARTIES
                        DISCLAIM ALL OTHER WARRANTIES, STATUTORY, EXPRESS, OR
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED
                        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                        PURPOSE, TITLE, AND NON-INFRINGEMENT AS TO THE Hajj
                        Umrah SERVICES, INCLUDING ANY INFORMATION, CONTENT, OR
                        MATERIALS CONTAINED THEREIN; (C) Hajj Umrah DOES NOT
                        REPRESENT OR WARRANT THAT THE CONTENT OR MATERIALS ON
                        THE Hajj Umrah SERVICES ARE ACCURATE, COMPLETE,
                        RELIABLE, CURRENT, OR ERROR-FREE; (D) Hajj Umrah IS NOT
                        RESPONSIBLE FOR TYPOGRAPHICAL ERRORS OR OMISSIONS
                        RELATING TO TEXT OR PHOTOGRAPHY; AND (E) WHILE Hajj
                        Umrah ATTEMPTS TO MAKE YOUR ACCESS AND USE OF THE Hajj
                        Umrah SERVICES SAFE,Hajj Umrah CANNOT AND DOES NOT
                        REPRESENT OR WARRANT THAT THE Hajj Umrah SERVICES OR OUR
                        SERVER(S) ARE FREE OF VIRUSES OR OTHER HARMFUL
                        COMPONENTS, AND THEREFORE, YOU SHOULD USE
                        INDUSTRY-RECOGNIZED SOFTWARE TO DETECT AND DISINFECT
                        VIRUSES FROM ANY DOWNLOAD. NO ADVICE OR INFORMATION,
                        WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM Hajj Umrah
                        OR THROUGH THE Hajj Umrah SERVICES WILL CREATE ANY
                        WARRANTY NOT EXPRESSLY STATED HEREIN.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Limitation of Liability and Damages
                      </h3>
                      <ol style={{ listStyleType: "lower-roman" }}>
                        <li className="text-lg">
                          <h3 className="mx-auto mt-4 mb-4 text-lg text-black">
                            Limitation of Liability
                          </h3>
                          <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW:
                            (A) IN NO EVENT SHALL Hajj Umrah OR THE Hajj Umrah
                            PARTIES BE LIABLE FOR ANY DIRECT, SPECIAL, INDIRECT,
                            OR CONSEQUENTIAL DAMAGES, OR ANY OTHER DAMAGES OF
                            ANY KIND, INCLUDING BUT NOT LIMITED TO LOSS OF USE,
                            LOSS OF PROFITS, OR LOSS OF DATA, WHETHER IN AN
                            ACTION IN CONTRACT, TORT (INCLUDING BUT NOT LIMITED
                            TO NEGLIGENCE), OR OTHERWISE, ARISING OUT OF OR IN
                            ANY WAY CONNECTED WITH THE USE OF OR INABILITY TO
                            USE THE Hajj Umrah SERVICES, THE CONTENT OR THE
                            MATERIALS, INCLUDING WITHOUT LIMITATION ANY DAMAGES
                            CAUSED BY OR RESULTING FROM RELIANCE ON ANY
                            INFORMATION OBTAINED FROM Hajj Umrah, OR THAT RESULT
                            FROM MISTAKES, OMISSIONS, INTERRUPTIONS, DELETION OF
                            FILES OR EMAIL, ERRORS, DEFECTS, VIRUSES, DELAYS IN
                            OPERATION OR TRANSMISSION, OR ANY FAILURE OF
                            PERFORMANCE, WHETHER OR NOT RESULTING FROM ACTS OF
                            GOD, COMMUNICATIONS FAILURE, THEFT, DESTRUCTION, OR
                            UNAUTHORIZED ACCESS TO Hajj Umrah’S RECORDS,
                            PROGRAMS, OR SERVICES; AND (B) IN NO EVENT SHALL THE
                            AGGREGATE LIABILITY OF Hajj Umrah, WHETHER IN
                            CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE,
                            WHETHER ACTIVE, PASSIVE, OR IMPUTED), PRODUCT
                            LIABILITY, STRICT LIABILITY, OR OTHER THEORY,
                            ARISING OUT OF OR RELATING TO THE USE OF OR
                            INABILITY TO USE THE Hajj Umrah SERVICES EXCEED THE
                            AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE Hajj
                            Umrah SERVICES DURING THE TWELVE (12) MONTHS
                            IMMEDIATELY PRECEDING THE DATE OF THE CLAIM OR ONE
                            HUNDRED DOLLARS, WHICHEVER IS GREATER. TO THE EXTENT
                            THAT APPLICABLE LAW PROHIBITS LIMITATION OF SUCH
                            LIABILITY, Hajj Umrah SHALL LIMIT ITS LIABILITY TO
                            THE FULL EXTENT ALLOWED BY APPLICABLE LAW.
                            <br />
                            <br />
                          </p>
                        </li>
                        <li className="text-lg">
                          <h3 className="mx-auto mt-4 mb-4 text-lg text-black">
                            Reference Sites
                          </h3>
                          <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                            THESE LIMITATIONS OF LIABILITY ALSO APPLY WITH
                            RESPECT TO DAMAGES INCURRED BY YOU BY REASON OF ANY
                            PRODUCTS OR SERVICES SOLD OR PROVIDED ON ANY
                            REFERENCE SITES OR OTHERWISE BY THIRD PARTIES OTHER
                            THAN Hajj Umrah AND RECEIVED THROUGH OR ADVERTISED
                            ON THE Hajj Umrah SERVICES OR RECEIVED THROUGH ANY
                            REFERENCE SITES.
                            <br />
                            <br />
                          </p>
                        </li>
                        <li className="text-lg">
                          <h3 className="mx-auto mt-4 mb-4 text-lg text-black">
                            Basis of the Bargain
                          </h3>
                          <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                            YOU ACKNOWLEDGE AND AGREE THAT Hajj Umrah HAS
                            OFFERED THE Hajj Umrah SERVICES, USER CONTENT,
                            MATERIALS, AND OTHER CONTENT AND INFORMATION, SET
                            ITS PRICES, AND ENTERED INTO THESE TERMS OF SERVICE
                            IN RELIANCE UPON THE WARRANTY DISCLAIMERS AND
                            LIMITATIONS OF LIABILITY SET FORTH HEREIN, THAT THE
                            WARRANTY DISCLAIMERS AND LIMITATIONS OF LIABILITY
                            SET FORTH HEREIN REFLECT A REASONABLE AND FAIR
                            ALLOCATION OF RISK BETWEEN YOU AND Hajj Umrah, AND
                            THAT THE WARRANTY DISCLAIMERS AND LIMITATIONS OF
                            LIABILITY SET FORTH HEREIN FORM AN ESSENTIAL BASIS
                            OF THE BARGAIN BETWEEN YOU AND Hajj Umrah. Hajj
                            Umrah WOULD NOT BE ABLE TO PROVIDE THE Hajj Umrah
                            SERVICES TO YOU ON AN ECONOMICALLY REASONABLE BASIS
                            WITHOUT THESE LIMITATIONS.
                            <br />
                            <br />
                          </p>
                        </li>
                      </ol>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Applicable Law and Venue
                      </h3>
                      <ol style={{ listStyleType: "lower-roman" }}>
                        <li className="text-lg">
                          <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                            To the fullest extent permitted by applicable law,
                            you and Hajj Umrah agree that if you are a
                            Subscribing Organization or a consumer resident of a
                            jurisdiction other than those in (ii) below, the
                            following governing law and arbitration provision
                            applies:
                            <br />
                            <br />
                            PLEASE READ THE FOLLOWING CAREFULLY BECAUSE IT
                            REQUIRES YOU TO ARBITRATE DISPUTES WITH Hajj Umrah
                            AND LIMITS THE MANNER IN WHICH YOU CAN SEEK RELIEF
                            FROM Hajj Umrah.
                            <br />
                            <br />
                            You and Hajj Umrah agree to arbitrate any dispute
                            arising from these Terms of Service or your use of
                            the Hajj Umrah Services, except that you and Hajj
                            Umrah are not required to arbitrate any dispute in
                            which either party seeks equitable and other relief
                            for the alleged unlawful use of copyrights,
                            trademarks, trade names, logos, trade secrets, or
                            patents. ARBITRATION PREVENTS YOU FROM SUING IN
                            COURT OR FROM HAVING A JURY TRIAL. You and Hajj
                            Umrah agree that you will notify each other in
                            writing of any dispute within thirty (30) days of
                            when it arises. Notice to Hajj Umrah shall be sent
                            to: Hajj Umrah, LLC., Attn: Legal, 3801 Meadowknolls
                            rd, Marion, IA, 52302. You and Hajj Umrah further
                            agree: to attempt informal resolution prior to any
                            demand for arbitration; that any arbitration will
                            occur in Travis County, Texas; that arbitration will
                            be conducted confidentially by a single arbitrator
                            in accordance with the rules of JAMS; and that the
                            state or federal courts in Travis County, Texas,
                            have exclusive jurisdiction over any appeals of an
                            arbitration award and over any suit between the
                            parties not subject to arbitration. Other than class
                            procedures and remedies discussed below, the
                            arbitrator has the authority to grant any remedy
                            that would otherwise be available in court. Any
                            dispute between the parties will be governed by this
                            Agreement and the laws of the State of Texas and
                            applicable United States law, without giving effect
                            to any conflict of laws principles that may provide
                            for the application of the law of another
                            jurisdiction. Whether the dispute is heard in
                            arbitration or in court, you and Hajj Umrah will not
                            commence against the other a class action, class
                            arbitration, or other representative action or
                            proceeding.
                            <br />
                            <br />
                          </p>
                        </li>
                        <li className="text-lg">
                          <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                            If you are a resident in any jurisdiction in which
                            the provision in the section above is found to be
                            unenforceable, then any disputes, claims, or causes
                            of action arising out of or in connection with these
                            Terms of Service will be governed by and construed
                            under the laws of your jurisdiction of residence and
                            shall be resolved by competent civil courts within
                            your jurisdiction of residence.
                            <br />
                            <br />
                          </p>
                        </li>
                      </ol>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Claims
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        YOU AND Hajj Umrah AGREE THAT ANY CAUSE OF ACTION
                        ARISING OUT OF OR RELATED TO THE Hajj Umrah SERVICES
                        MUST COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF
                        ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS
                        PERMANENTLY BARRED.
                        <br />
                        <br />
                      </p>
                    </li>
                  </ol>

                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Miscellaneous
                    </h2>
                  </li>

                  <ol style={{ listStyleType: "lower-alpha" }}>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Waiver
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        If we fail to exercise or enforce any right or provision
                        of these Terms of Service, it will not constitute a
                        waiver of such right or provision. Any waiver of any
                        provision of these Terms of Service will be effective
                        only if in writing and signed by the relevant party.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Severability
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        If any provision of these Terms of Service is held to be
                        unlawful, void, or for any reason unenforceable, then
                        that provision will be limited or eliminated from these
                        Terms of Service to the minimum extent necessary and
                        will not affect the validity and enforceability of any
                        remaining provisions.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Assignment
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        These Terms of Service, and any rights and licenses
                        granted hereunder, may not be transferred or assigned by
                        you, but may be assigned by Hajj Umrah without
                        restriction. Any assignment attempted to be made in
                        violation of this Terms of Service shall be void.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Survival
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        Upon termination of these Terms of Service, any
                        provision which, by its nature or express terms should
                        survive, will survive such termination or expiration,
                        including, but not limited to, Sections 7, 8, 11, 12,
                        and 15-17.
                        <br />
                        <br />
                      </p>
                    </li>
                    <li className="text-xl">
                      <h3 className="mx-auto mt-4 mb-4 text-xl text-black">
                        Entire Agreement
                      </h3>
                      <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                        The Terms of Service, which incorporate the Terms of
                        Sale and the Community Guidelines, is the entire
                        agreement between you and Hajj Umrah relating to the
                        subject matter herein and will not be modified except by
                        a writing signed by authorized representatives of both
                        parties, or by a change to these Terms of Service made
                        by Hajj Umrah as set forth in Section 6 above.
                        <br />
                        <br />
                      </p>
                    </li>
                  </ol>
                  <li>
                    <h2 className="mx-auto mt-4 mb-4 text-2xl text-black">
                      Requests for Information and How to Serve a Subpoena
                    </h2>
                    <p className="mb-0 mx-auto text-base font-medium leading-relaxed text-gray-600">
                      All requests for information or documents related to
                      potential, anticipated, or current legal proceedings,
                      investigations, or disputes must be made using the
                      appropriate level of legal process, and must be properly
                      served on Hajj Umrah at Hajj Umrah, LLC., Attn: Legal,
                      3801 Meadowknolls rd, Marion, IA, 52302.
                      <br />
                      <br />
                      Please note that Hajj Umrah does not accept requests for
                      information or documents, or service of process, via
                      e-mail or fax and will not respond to such requests. All
                      requests must include the information you may have that
                      will help us identify the relevant records (particularly,
                      the Hajj Umrah Service at issue, e.g., Hajj Umrah.com, and
                      the username at issue), the specific information
                      requested, and its relationship to your investigation.
                      Please also note that limiting your request to the
                      relevant records (e.g., a limited time period) will
                      facilitate efficient processing of your request.
                      <br />
                      <br />
                      The Hajj Umrah Services are offered by Hajj Umrah, Inc.,
                      and can be reached by email at hello@Hajj Umrah.com.
                      <br />
                      <br />
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
};

export default TermsServices;
