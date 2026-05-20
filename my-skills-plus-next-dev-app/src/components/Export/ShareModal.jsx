"use client";
import React, { useState, useEffect } from "react";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { API } from "../../app/auth/endpoints";

const ShareModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareId, setShareId] = useState(null);

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

  useEffect(() => {
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
        // setShareId(shareIdFromResponse);
      } catch (error) {
        console.error("Error making API request:", error.message);
      }
    };
    makeApiRequest();
  }, []);

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `http://` + window.location.host + `/profile/${shareId}`,
    )}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `http://` + window.location.host + `/profile/${shareId}`,
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      `http://` + window.location.host + `/profile/${shareId}`,
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  const shareOnInstagram = () => {
    alert(
      "To share on Instagram, please open the Instagram app and paste the link.",
    );
  };

  return (
    <>
      <button
        onClick={openModal}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Share profile
      </button>
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
                    ? `http://` + window.location.host + `/profile/${shareId}`
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
    </>
  );
};

export default ShareModal;
