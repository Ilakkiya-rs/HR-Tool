import React, { forwardRef } from "react";

const PrintPage = forwardRef((props, ref) => {
  const { tabularViewContent, quickTabContent } = props;

  return (
    <div ref={ref} className="print-page">
      <div className="top-content">
        <img src={"/images/logo/Logo.png"} alt="Logo" className="logo" />
        <h3 className="logo-text">Skills Tech</h3>
      </div>
      <div className="title">
        <h2 className="title-text">My Skills Profile</h2>
      </div>
      <div className="print-content">
        <div className="quick-view">
            <div className="quick-tab-content" dangerouslySetInnerHTML={{ __html: quickTabContent }} />
        </div>
        <div className="tabular-view">
            <div className="tabular-view-content" dangerouslySetInnerHTML={{ __html: tabularViewContent }} />
        </div>
      </div>
      <footer className="footer">
        <p>My Skills Profile is created with myskillsplus.com</p>
      </footer>
    </div>
  );
});

PrintPage.displayName = "PrintPage";

export default PrintPage;
