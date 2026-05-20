type People = {
  name: string;
  email: string;
  relationship: string;
  profile: number;
};

const peopleData: People[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    relationship: "Junior",
    profile: 2,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    relationship: "Senior",
    profile: 2,
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    relationship: "Peer",
    profile: 2,
  },
];

const FeedbackTable = () => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">History</h3>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name / Email
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Relationship
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* <pre>{JSON.stringify(peopleData, null, 2)}</pre> */}

              {peopleData.map((personItem, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {personItem.email}
                    </h5>
                    <p className="text-sm">{personItem.name}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {personItem.relationship}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    {/* <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                        personItem.status === "Done"
                          ? "bg-success text-success"
                          : personItem.status === "Cancelled"
                            ? "bg-danger text-danger"
                            : "bg-warning text-warning"
                      }`}
                    >
                      {personItem.status}
                    </p> */}
                    status
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">svg</button>
                      <button className="hover:text-primary">svg</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FeedbackTable;
