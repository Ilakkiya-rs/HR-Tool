"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MessageWindow from "@/components/ChatBox";

const MessagePage = () => {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Messages" />
        <MessageWindow />
    </DefaultLayout>
  );
};

export default MessagePage;