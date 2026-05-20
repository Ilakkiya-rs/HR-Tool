"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { checkout } from "@/services/checkout";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import PrintPage from "@/components/Export/PrintPage";
import "../css/print.css";
import { API } from "../app/auth/endpoints";
import { XCircle } from "lucide-react";

const ExperienceHomePlugin = () => {
  const printRef = useRef();
  const [iframeContent, setIframeContent] = useState(null);
  const [quickTabContent, setQuickTabContent] = useState(null);
  const [isPaid, setIsPaid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareId, setShareId] = useState(null);
  const [showPluginView, setShowPluginView] = useState(false);
  const [isShowFirstSection, setIsShowFirstSection] = useState(false);
  const [isShowSecondSection, setIsShowSecondSection] = useState(true);
  const iframeRef = React.useRef(null);
  const userData = JSON.parse(localStorage.getItem("loginUserDetail"));
  const [activeButton, setActiveButton] = useState("view");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Export print page code is below
    localStorage.setItem('iys', JSON.stringify({
      page: "Home",
      tap: "profile",
      profile_view: "all",
      isEdit: false,
      isDelete: false,
      doughnt: true,
      experience: true
    }));

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const amount = urlParams.get('amount');

    if (sessionId) {
        const userDetails = JSON.parse(localStorage.getItem('loginUserDetail'));

        fetch(API.verifyPayment, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userDetails.email,
                payment_id: sessionId,
                paid_amount: amount,
            }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.is_payment_complete)  {
            userDetails.is_payment_complete = data.is_payment_complete;
            userDetails.paid_amount = data.paid_amount;
            userDetails.paid_for = data.paid_for;
            localStorage.setItem('loginUserDetail', JSON.stringify(userDetails));

            if (data.paid_for.includes("print&share")) {
              setIsPaid(true);
            }
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('Payment verification failed with status:', data.payment.status);
          }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
      const storedUserDetails = JSON.parse(localStorage.getItem('loginUserDetail'));
      if (storedUserDetails && storedUserDetails.is_payment_complete && storedUserDetails.paid_for.includes("print&share")) {
        setIsPaid(true);
      }
    }
    
    const iframe = document.getElementById("iys-iframe");
    if (iframe) {
      iframe.onload = () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const tabularViewContentDiv = iframeDoc.querySelector("#tabular-tab-content");
        // const quickTabContentDiv = iframeDoc.querySelector("#quick-tab-content");
        
        if (tabularViewContentDiv) {
          setIframeContent(tabularViewContentDiv.innerHTML);
        }

        // if (quickTabContentDiv) {
        //   setQuickTabContent(quickTabContentDiv.innerHTML);
        // }
      };
    }

    //Share Profile code is below
    const apiEndpoint = `${API.getSkills}`;

    const makeApiRequest = async () => {
      const token = JSON.parse(
        localStorage.getItem("tokenData") || "{}",
      ).access;
      try {
        const response = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const shareIdFromResponse = data.share_id;
        const encodedId = btoa(shareIdFromResponse);
        console.log(encodedId);
        setShareId(encodedId);
      } catch (error) {
        console.error("Error making API request:", error.message);
      }
    };
    makeApiRequest();

  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });  

  const handleStripePayment = async () => {
    const lineItems = [
      {
        price: "price_1PlmazCSYx0IKNzZpTm8l2jU",
        quantity: 1,
      },
    ];
    try {
      await checkout({ lineItems });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleViewButtonClick = (action) => {
    setActiveButton(action);
    const updatedIys = {
      page: "Home",
      tap: action ==="edit" ?"profile":"profile",
      profile_view: "all",
      isEdit: action ==="edit" ? true : false,
      isDelete: action ==="edit" ? true : false,
      doughnt: true,
      experience: true,
      save_button: action ==="edit" ?true:false,
    };
    localStorage.setItem("iys", JSON.stringify(updatedIys));
    // Force iframe to reload with updated localStorage
    const iframe = document.getElementById("iys-iframe");
    if (iframe) {
      iframe.src = iframe.src;
    }
    setShowPluginView(true);
    setIsShowFirstSection(false);
    setIsShowSecondSection(true);
  };

  const handleButtonClick = (action) => {
    setActiveButton(action);
    if (!isPaid) {
      alert("Please pay $1 to activate this feature.");
      return;
    }
    if (action === "download") {
      handlePrint();
      // alert("Thank you for downloading your 'My Skills Profile'!");
    } else if (action === "share") {
      openModal();
      // alert("Thank you for share your 'My Skills Profile'!")
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleCopyClick = () => {
    const textToCopy = document.getElementById("copythistext").innerText;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error("Unable to copy to clipboard", err));
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `http://` + window.location.host + `/individual/${userData.individual_profile_id}`,
    )}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `http://` + window.location.host + `/individual/${userData.individual_profile_id}`,
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      `http://` + window.location.host + `/individual/${userData.individual_profile_id}`,
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  const shareOnInstagram = () => {
    alert(
      "To share on Instagram, please open the Instagram app and paste the link.",
    );
  };

  const experienceLevels = Array.isArray(userData.current_experience_level)
    ? userData.current_experience_level
    : [];

  const isFresher = experienceLevels.some((item) =>
    item?.label === "I am starting my career" ||
    item?.label === "I am a student currently pursuing education"
  );


  const iframeSrc = isFresher
    ? "/plugins/fresher/index.html"
    : "/plugins/allinone/index.html";

  const contentToPrint = (
    <div className="col-12" style={{ height: "78vh" }}>
      <iframe
        id="iys-iframe"
        style={{ borderRadius: "10px", height: "100%", width: "100%" }}
        src={iframeSrc}
        title="IYS Plugin Rating"
      />
    </div>
  );

  const handleGenerateAssessment = (action) => {
    setIsShowFirstSection(false);
    setIsShowSecondSection(true);
    setActiveButton(action);
    const skills = JSON.parse(localStorage.getItem("logginUserRatedSkills"));
    const userData = JSON.parse(localStorage.getItem("loginUserDetail"));

    if (!skills || !userData) {
      alert("Skills or user data is missing in localStorage!");
      return;
    }

    const user = {
      individual_profile_id: userData.individual_profile_id,
      name: userData.first_name,
      email: userData.email,
      role: "user",
    };

    const message = {
      type: "TRIGGER_ASSESSMENT",
      skills,
      user
    };

    const assessmentWindow = window.open("https://vani.myskillsplus.com/skills", "_blank");
    // const assessmentWindow = window.open("http://localhost:5173/skills", "_blank");
    const handleMessage = (event) => {
      if (event.data?.type === "ASSESSMENT_WINDOW_READY") {
        assessmentWindow.postMessage(message, "*");
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    // iframeRef?.current?.contentWindow?.postMessage(message, "https://vani.myskillsplus.com/");
  };
  
console.log(isPaid);
  return (
    <>
      {/* Guidance message */}
      {visible && (
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 mt-6 mb-6 relative">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-4 right-4 text-[#9E9E9E] hover:text-[#E53935]"
            aria-label="Close"
          >
            <XCircle size={24} />
          </button>

          <h2 className="text-xl font-bold mb-3 text-green-700">
            🎉 Congratulations on Building Your Skills Profile!
          </h2>

          <p className="mb-4 text-[#616161]">
            You have just taken a powerful step toward showcasing your capabilities.
            Your profile is now web-ready - complete with a unique URL you can:
          </p>

          <ul className="list-disc list-inside mb-4 text-[#616161]">
            <li>Download and attach to your resume</li>
            <li>Add to your LinkedIn profile</li>
            <li>Share across social media or any communication</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2 text-blue-600">
            🚀 Next Steps to Make the Most of Your Profile:
          </h3>

          <ol className="list-decimal list-inside space-y-2 text-[#616161]">
            <li>
              <strong>Complete Your Personal Background Profile (PBP)</strong> — Add your education, experience, and preferences to strengthen your profile context.
            </li>
            <li>
              <strong>Set Your Earning Preferences</strong> — Define how others can connect with you:
              <ul className="list-disc list-inside ml-6">
                <li>VSP (Value of Skills Profile)</li>
                <li>BVF (Background View Fee)</li>
                <li>PCF (Personal Contact Fee)</li>
              </ul>
            </li>
            <li>
              <strong>Get Anonymous Feedback — For Free!</strong> — Invite your friends, colleagues, reportees, or supervisors to give you confidential skill feedback.
            </li>
          </ol>
        </div>
      )}

      {/* <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {[
            { id: "view", label: "View Profile", onClick: () => handleViewButtonClick("view") },
            { id: "download", label: "Print Profile", onClick: () => handleButtonClick("download") },
            { id: "share", label: "Share Profile", onClick: () => handleButtonClick("share") },
            { id: "edit", label: "Edit Profile", onClick: () => handleViewButtonClick("edit") },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={btn.onClick}
              className={`px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-all duration-200 shadow-md ${
                activeButton === btn.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-800"
                  : "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
              } ${!isPaid ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
              disabled={!isPaid}
            >
              {btn.label}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={handleGenerateAssessment}
              className="px-6 py-2.5 rounded-full text-white text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Generate Skills Assessment
            </button>
          </div>
        </div>
        <div className="text-right font-semibold text-xl text-[#285192] mt-4">
          <span className="text-black font-medium text-lg">Individual Id: </span>
          <span>{userData.individual_profile_id}</span>
        </div>  
      </div>   */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 no-print bg-white p-2 rounded-lg">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "view", label: "View Profile", onClick: () => handleViewButtonClick("view") },
            { id: "download", label: "Print Profile", onClick: () => handleButtonClick("download") },
            { id: "share", label: "Share Profile", onClick: () => handleButtonClick("share") },
            { id: "edit", label: "Edit Profile", onClick: () => handleViewButtonClick("edit") },
            { id: "assessment", label: "Generate Assessment", onClick: () => handleGenerateAssessment("assessment") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={tab.onClick}
              disabled={!isPaid}
              className={`px-5 py-2.5 font-bold text-black text-sm transition-all duration-200
                border-b-2 ${
                  activeButton === tab.id
                    ? "border-indigo-600 text-indigo-600 font-semibold"
                    : "border-transparent text-gray-600 hover:text-indigo-600"
                }
                ${!isPaid ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="font-semibold text-xl text-[#285192]">
          <span className="text-black font-medium text-lg">Individual Id: </span>
          <span>{userData.individual_profile_id}</span>
        </div>
      </div>
      {isModalOpen && (
          <div
            className="fixed inset-0 z-[1000] flex h-full w-full flex-wrap items-center justify-center overflow-auto p-4 font-[sans-serif]"
            onClick={handleBackdropClick}
          >
            <div className="before:fixed before:inset-0 before:h-full before:w-full before:bg-[rgba(0,0,0,0.5)]"></div>
            <div className="relative w-full max-w-md rounded-md bg-white p-6 shadow-lg">
              <div className="flex items-center border-b pb-3">
                <h3 className="flex-1 text-xl font-bold text-[#333]">
                  Share your profile
                </h3>
                <button onClick={closeModal}>
                  <MaterialSymbol icon="close" size={24} />
                </button>
              </div>
              <div className="my-8">
                {shareId !== null ? (
                  <>
                    <h6 className="text-base text-[#333]">Share this link via</h6>
                    <div className="mt-6 space-x-6 text-center">
                      <button
                        type="button"
                        className="facebook inline-flex h-12 w-12 items-center justify-center rounded-full border-none bg-blue-600 outline-none hover:bg-blue-700 active:bg-blue-600"
                        onClick={shareOnFacebook}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          fill="#fff"
                          viewBox="0 0 155.139 155.139"
                        >
                          <path
                            d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"
                            data-original="#010002"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="twitter inline-flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#03a9f4] outline-none hover:bg-[#03a1f4] active:bg-[#03a9f4]"
                        onClick={shareOnTwitter}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          fill="#fff"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z"
                            data-original="#03a9f4"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="linkedin inline-flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#0077b5] outline-none hover:bg-[#0055b5] active:bg-[#0077b5]"
                        onClick={shareOnLinkedIn}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          fill="#fff"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0z"
                            data-original="#0077b5"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="instagram inline-flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#ea0065] outline-none hover:bg-[#ea0065d6] active:bg-[#ea0065]"
                        onClick={shareOnInstagram}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          fill="#fff"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M301 256c0 24.852-20.148 45-45 45s-45-20.148-45-45 20.148-45 45-45 45 20.148 45 45zm0 0"
                            data-original="#000000"
                          />
                          <path
                            d="M332 120H180c-33.086 0-60 26.914-60 60v152c0 33.086 26.914 60 60 60h152c33.086 0 60-26.914 60-60V180c0-33.086-26.914-60-60-60zm-76 211c-41.355 0-75-33.645-75-75s33.645-75 75-75 75 33.645 75 75-33.645 75-75 75zm86-146c-8.285 0-15-6.715-15-15s6.715-15 15-15 15 6.715 15 15-6.715 15-15 15zm0 0"
                            data-original="#000000"
                          />
                          <path
                            d="M377 0H135C60.562 0 0 60.563 0 135v242c0 74.438 60.563 135 135 135h242c74.438 0 135-60.563 135-135V135C512 60.562 451.437 0 377 0zm45 332c0 49.625-40.375 90-90 90H180c-49.625 0-90-40.375-90-90V180c0-49.625 40.375-90 90-90h152c49.625 0 90 40.375 90 90zm0 0"
                            data-original="#000000"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center">
                    <div
                      className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h6 className="text-base text-[#333]">Or copy link</h6>
                <div className="mt-6 flex w-full items-center overflow-hidden rounded border">
                  <p
                    className="text-gray-400 ml-4 flex-1 text-sm"
                    id="copythistext"
                  >
                    {shareId
                      ? `http://` + window.location.host + `/individual/${userData.individual_profile_id}`
                      : "Loading..."}
                  </p>
                  <button
                    className="bg-blue-500 px-4 py-3 text-sm text-white hover:bg-blue-600"
                    onClick={handleCopyClick}
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
      {!isPaid && (
        <div className="flex mt-4" style={{ alignItems: 'center' }}>
          <h2 className="font-medium text-blue-900 dark:text-white">
            Share your Skills Profile in social media Take pdf output, add to Linkedin or to your resume
            <span className="ms-3 font-bold">Just $1</span>
            <button onClick={handleStripePayment} className="rounded bg-green-500 px-3 py-2 ms-3 font-bold text-white hover:bg-green-700" id="pay-now">
              Pay Now
            </button>
          </h2>
        </div>
      )}

      <div className="d-flex flex-column align-items-center justify-content-between mt-5">
        <div className="col-12">
          <iframe
            style={{
              borderRadius: "10px",
              height: "78vh",
              width: "100%",
              display: isShowFirstSection ? "block" : "none",
            }}
            ref={iframeRef}
            src="https://vani.myskillsplus.com/"
            id="assessmentIframe"
          />
        </div>
      </div>

      {isShowSecondSection ?
        <section>
          <div className="rounded">
              <div className="d-flex flex-column align-items-center justify-content-between">
                  <div className="mt-5">
                      {contentToPrint}
                  </div>
              </div>
          </div>
        </section>
      : <></>
      }

      {/* <div style={{ display: "none" }}>
        {iframeContent && (
          <PrintPage ref={printRef} tabularViewContent={iframeContent} />
        )}
      </div> */}

      <div style={{ display: "none" }}>
        <PrintPage
          ref={printRef}
          tabularViewContent={iframeContent}
          skills={JSON.parse(localStorage.getItem("logginUserRatedSkills") || "[]")}
          profileId={userData.individual_profile_id}
        />
      </div>
    </>
  );
};

export default ExperienceHomePlugin;
