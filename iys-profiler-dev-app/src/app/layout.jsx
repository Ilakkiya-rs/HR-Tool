import './globals.css';

import Footer1 from '@/Layout/Footer/Footer1';
import GDPRCookieConsent from '@/Componet/GDPRCookieConsent';
import { GlobalStateProvider } from './GlobalState';
import { GoogleTagManager } from '@next/third-parties/google'
import Header1 from '@/Layout/Header/Header1';
import { METADATA } from '@/constants/seo';
/* eslint-disable @next/next/no-css-tags */
import Script from 'next/script';

export const metadata = {
  ...METADATA
};

// const RootLayout = ({ children }) => (
//   <html lang="en">
//     {/* <GoogleTagManager gtmId="GTM-N2K43PT3" /> */}
//     <head>
//       <Script id="gtm" strategy="afterInteractive">
//         {`
//           (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//           new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//           j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//           'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//           })(window,document,'script','dataLayer','GTM-N2K43PT3');
//         `}
//       </Script>
//     </head>
//     <body>
//       <GlobalStateProvider>
//         <noscript
//           dangerouslySetInnerHTML={{
//             __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2K43PT3" height="0" width="0" style="display: none; visibility: hidden;" />`
//           }}
//         />
//         <Header1 />
//         <GDPRCookieConsent />
//         {children}
//         <Footer1 />
//       </GlobalStateProvider>

//       {/* <!-- Google tag (gtag.js) --> */}
//       <Script
//         id="gtm-script"
//         src="https://www.googletagmanager.com/gtag/js?id=G-Y4KJZMEP64"
//         strategy="afterInteractive"
//         async
//       />

//       <Script
//         async
//         src="https://www.googletagmanager.com/gtag/js?id=G-12P5T77TL9"
//         strategy="afterInteractive"
//       />

//       <Script
//         async
//         type="text/javascript"
//         src="/scripts/gtag.js"
//         strategy="afterInteractive"
//       />

//       <Script
//         async
//         type="text/javascript"
//         src="/scripts/gAdCampaign.js"
//         strategy="afterInteractive"
//       />

//       {/* <!--== counter --> */}
//       <Script src="/js/counter.js" type="text/babel" />

//       {/* <!--== countdown --> */}
//       <Script src="/js/jquery.countdown.min.js" type="text/babel" />

//       {/* <!--== particles --> */}
//       <Script src="/js/particles.js" type="text/babel" />

//       {/* <!--== typer --> */}
//       <Script src="/js/typer.js" type="text/babel" />

//       {/* <!--== wow --> */}
//       <Script src="/js/wow.min.js" type="text/babel" />

//       {/* <!--== theme-Script --> */}
//       <Script src="/js/theme-script.js" type="text/babel" />

//       {/* Bootstrap js */}
//       <Script
//         src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
//         integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
//         crossOrigin="anonymous"
//       />

//       {/* JQuery */}
//       <Script
//         src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
//         integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
//         crossOrigin="anonymous"
//       />
//     </body>
//   </html>
// );

// export default RootLayout;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-N2K43PT3" />
      <head>
        {/* <Script id="gtm" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N2K43PT3');
        `}
        </Script> */}
      </head>
      <body>
        <GlobalStateProvider>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2K43PT3" height="0" width="0" style="display: none; visibility: hidden;" />`
            }}
          />
          <Header1 />
          <GDPRCookieConsent />
          {children}
          <Footer1 />
        </GlobalStateProvider>

        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          id="gtm-script"
          src="https://www.googletagmanager.com/gtag/js?id=G-Y4KJZMEP64"
          strategy="afterInteractive"
          async
        />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-12P5T77TL9"
          strategy="afterInteractive"
        />

        <Script
          async
          type="text/javascript"
          src="/scripts/gtag.js"
          strategy="afterInteractive"
        />

        <Script
          async
          type="text/javascript"
          src="/scripts/gAdCampaign.js"
          strategy="afterInteractive"
        />

        {/* <!--== counter --> */}
        <Script src="/js/counter.js" type="text/babel" />

        {/* <!--== countdown --> */}
        <Script src="/js/jquery.countdown.min.js" type="text/babel" />

        {/* <!--== particles --> */}
        <Script src="/js/particles.js" type="text/babel" />

        {/* <!--== typer --> */}
        <Script src="/js/typer.js" type="text/babel" />

        {/* <!--== wow --> */}
        <Script src="/js/wow.min.js" type="text/babel" />

        {/* <!--== theme-Script --> */}
        <Script src="/js/theme-script.js" type="text/babel" />

        {/* Bootstrap js */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
        />

        {/* JQuery */}
        <Script
          src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
          integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
