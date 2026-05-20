"use client";
import React, { useState, useEffect } from "react";
import { API } from "../../app/auth/endpoints";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { setLocalStorage } from "@/common/token";

type ExportProps = {
  params: {
    id: string | number;
  };
};

const PublicProfile = ({ params }: ExportProps) => {
  console.log(params);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(params.id);
        const decodeId=atob(params.id.toString());
        console.log(decodeId);
        const response = await axios.get(
          `${API.getSharedUserSkills}` + decodeId,
        );
        setUserData(response.data);
        setLocalStorage("userRatedSkills", response.data.data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    localStorage.setItem('iys', JSON.stringify({
      page:"Profile",
      tap: "profile",
      profile_view: "all",
      isEdit: false,
      isDelete: false,
      doughnt: true, 
      experience: true
    }));

    fetchData();
  }, [params.id]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : userData ? (
        <>
          <Breadcrumb pageName={userData.full_name} />
          IYS Skills Profile
          <div className="col-12" style={{ height: "78vh" }}>
            {/* src="/plugins/profile/profilePlugin.html" */}
            <iframe
              style={{ borderRadius: "10px", height: "100%", width: "100%" }}
              src="/plugins/allinone/index.html"
              title="IYS Plugin Rating"
            />
          </div>
        </>
      ) : (
        <p>Getting Profile Details...</p>
      )}
    </div>
  );
};

export default PublicProfile;
