// ExcelUploadComponent.tsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

export type People = {
  name: string;
  email: string;
  relationship: string;
};

interface ExcelUploadProps {
  onDataParsed: (data: People[]) => void;
}

const ExcelUploadComponent: React.FC<ExcelUploadProps> = ({ onDataParsed }) => {
  const [peopleData, setPeopleData] = useState<People[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target?.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Assuming your Excel sheet has columns "name", "email", "relationship"
          const data: People[] = XLSX.utils.sheet_to_json(sheet);

          setPeopleData(data);
          onDataParsed(data); // Pass data to the parent component
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <label
        htmlFor="fileInput"
        className="cursor-pointer rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        Upload Excel File
      </label>
      <input
        id="fileInput"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ExcelUploadComponent;
