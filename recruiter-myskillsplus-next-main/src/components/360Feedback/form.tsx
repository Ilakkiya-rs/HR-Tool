"use client";
import React, { useState , useEffect} from "react";
// import FeedbackTable from "./FeedbackTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../app/auth/endpoints";
import { checkout } from "@/services/feedbackCheckout";
import "../../css/style.css";

export type People = {
  name: string;
  email: string;
  relationship: string;
};

const Form = () => {
  const initialPeopleList: People[] = Array.from({ length: 5 }, () => ({
    name: "",
    email: "",
    relationship: "",
  }));

  const [peopleList, setPeopleList] = useState<People[]>(initialPeopleList);
  const [isSending, setIsSending] = useState(false);
  const submittedNames = peopleList.map(({ name }) => name).join(", ");
  const [isPaid, setIsPaid] = useState(true);

  useEffect(() => {
    
    const storedUserDetailsString = localStorage.getItem('logedinUserDetail');
    
    if (storedUserDetailsString) {
      const storedUserDetails = JSON.parse(storedUserDetailsString);

      if (storedUserDetails && storedUserDetails.is_payment_complete && storedUserDetails.paid_for.includes("add_people")) {
        setIsPaid(true);
      }

      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const amount = urlParams.get('amount');

      if (sessionId) {
          fetch(API.verifyPayment, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: storedUserDetails.email,
                  payment_id: sessionId,
                  paid_amount: amount,
              }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.is_payment_complete)  {
              storedUserDetails.is_payment_complete = data.is_payment_complete;
              storedUserDetails.paid_amount = data.paid_amount;
              storedUserDetails.paid_for = data.paid_for;
              localStorage.setItem('logedinUserDetail', JSON.stringify(storedUserDetails));

              if (data.paid_for.includes("add_people")) {
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
      }
    }
  },[])

  const handleInputChange = (
    index: number,
    key: keyof People,
    value: string,
  ) => {
    const updatedPeopleList = peopleList.map((person, i) =>
      i === index ? { ...person, [key]: value } : person,
    );
    setPeopleList(updatedPeopleList);
  };

  const handleStripePayment = async () => {
    const lineItems = [
      {
        price: "price_1PlmasCSYx0IKNzZU3D3Sffh",
        quantity: 1,
      },
    ];
    try {
      await checkout({ lineItems });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleSubmit = async () => {
    setIsSending(true); // Start sending state

    // Validation: Check for unique emails
    // const uniqueEmails = new Set<string>();
    // let hasError = false;

    // const updatedPeopleList = peopleList.map((person, index) => {
    //   if (uniqueEmails.has(person.email)) {
    //     hasError = true;
    //   }
    //   uniqueEmails.add(person.email);
    //   return person;
    // });

    // if (hasError) {
    //   setIsSending(false); // Reset sending state
    //   toast.error("Duplicate emails found. Please enter unique emails.");
    //   return;
    // }

    // // Validation: Ensure no field remains empty
    // const isEmptyField = updatedPeopleList.some(
    //   (person) => !person.name || !person.email || !person.relationship,
    // );

    // if (isEmptyField) {
    //   setIsSending(false); // Reset sending state
    //   toast.error("All fields are required. Please fill in all fields.");
    //   return;
    // }

    //Issues New code
    if (peopleList.some(person => !person.name || !person.email || !person.relationship)) {
      setIsSending(false); // Reset sending state
      toast.error("All fields are required. Please fill in all fields.");
      return;
    }
  
    const emails = peopleList.map(person => person.email);
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      setIsSending(false); 
      toast.error("Duplicate emails found. Please enter unique emails.");
      return;
    } // Issues New code ended

    const token = JSON.parse(localStorage.getItem("tokenData") || "{}").access;

    if (!token) {
      console.error("Access token not found in localStorage");
      setIsSending(false); //New code
      return;
    }

    const apiUrl = `${API.addReviewUser}`;

    const getUserTypeInitial = (value: string) => {
      const userTypeMap: Record<string, string> = {
        junior: "JR",
        peer: "PR",
        senior: "SR",
        indirectsenior: "IS",
      };
      return userTypeMap[value.toLowerCase()] || "OTHER";
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          // updatedPeopleList.map(({ name, email, relationship }) => ({
            peopleList.map(({ name, email, relationship }) => ({ //New code
              name,
              email,
              user_type: getUserTypeInitial(relationship),
          })),
        ),
      });

      if (response.status === 201) {
        toast.success(`Feedback request sent successfully`);
        setPeopleList(initialPeopleList); // Clear form on success
      } else {
        console.error(
          "Failed to add review users. Server returned:",
          response.status,
          response.statusText,
        );
        toast.error(
          `${response.status} : ${response.statusText.toUpperCase()}`,
        );
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  const addPerson = () => {
    setPeopleList([...peopleList, { name: "", email: "", relationship: "" }]);
  };

  return (
    <>
      <ToastContainer />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <div className="text-lg text-black">
            <p className="mb-3">
              Feedback from others is the best way to understand our areas of
              strength and areas in which we need to improve.
            </p>
            <p className="mb-3">
              Different people observe us using our skills. It is beneficial to
              hear from them regarding our skills. <b>IYS 360</b> facilitates
              this process for you.
            </p>
            <p className="mb-3">
              You can collect feedback from your <b>Juniors</b> (those who have
              worked under you or for you), <b>Peers</b> (those who have worked
              alongside you or have been colleagues), and <b>Seniors</b>{" "}
              (Managers, Supervisors, Teachers, and others who have overseen
              your work directly or indirectly).
            </p>
            <p className="mb-3">
              The feedback is <b>ANONYMOUS</b>. You will not know who provided
              which feedback on which skill, as this is not important. What is
              important is that you know how they collectively perceive your
              skills.
            </p>
            <p className="mb-5">
              To receive high-quality feedback, seek input from as many people
              as possible and ensure a good number of participants across the
              three categories of relationships. Take the next step in your
              development and growth. Send a Feedback Request now.
            </p>
            {!isPaid && (
              <h2 className="font-medium text-blue-900 dark:text-white mb-5">
                Invest just $5 to get valuable feedback from people who matter
                <button
                  onClick={handleStripePayment}
                  className="rounded bg-green-500 px-2 py-1 ms-5 font-bold text-white hover:bg-green-700"
                >
                  Pay Now
                </button>
              </h2>
            )}
            <h3 className="font-medium text-black dark:text-white">
              Add 5 People to review your Skills Profile {!isPaid && ( <span className="font-medium text-blue-900 dark:text-white">(Once you have made the payment, you can add people below)</span> )}
            </h3>
          </div>
        </div>
        <div className="form m-3">
          {peopleList.map((person, index) => (
            <div key={index}>
              <div className="flex flex-col gap-3 md:mb-3 md:flex-row">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={person.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  disabled={!isPaid}
                />
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={person.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  disabled={!isPaid}
                />
                <div className="w-full">
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      value={person.relationship}
                      onChange={(e) => {
                        handleInputChange(
                          index,
                          "relationship",
                          e.target.value,
                        );
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                      disabled={!isPaid}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your relationship
                      </option>
                      <option
                        value="junior"
                        className="text-body dark:text-bodydark"
                      >
                        Junior
                      </option>
                      <option
                        value="peer"
                        className="text-body dark:text-bodydark"
                      >
                        Peer
                      </option>
                      <option
                        value="senior"
                        className="text-body dark:text-bodydark"
                      >
                        Senior
                      </option>
                      <option
                        value="indirectsenior"
                        className="text-body dark:text-bodydark"
                      >
                        Indirect Senior
                      </option>
                    </select>
                    <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <hr className="dark:bg-gray-700 my-8 h-px border-0 bg-gray md:hidden" />
            </div>
          ))}
        </div>
        <div className="m-3 flex justify-end gap-3">
          <button
            onClick={addPerson}
            className="rounded border border-blue-500 bg-transparent px-5 py-3 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
            disabled={!isPaid}
          >
            Add More People
          </button>
          {/* <button
            onClick={handleSubmit}
            disabled={isSending} // Disable button when sending
            className="rounded border border-blue-500 bg-blue-500 px-5 py-3 font-semibold text-white hover:border-transparent hover:bg-blue-600 hover:text-white"
          >
            {isSending ? "Sending..." : "Send Feedback Request"}
          </button> */}
          <button
            onClick={handleSubmit}
            disabled={isSending} // Disable button when sending
            className="relative rounded border border-blue-500 bg-blue-500 px-5 py-3 font-semibold text-white hover:border-transparent hover:bg-blue-600 hover:text-white"
          >
            {isSending ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-t-transparent border-blue-300 border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              "Send Feedback Request"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Form;
