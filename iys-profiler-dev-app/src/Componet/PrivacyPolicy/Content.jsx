'use client';

import { useEffect } from 'react';
import Newsletter from '../Newsletter';

const Content = () => {
  useEffect(() => {
    // Add event listener for Bootstrap accordion shown event
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item) => {
      item.addEventListener('shown.bs.collapse', () => {
        // Scroll the item to the top of the screen
        const itemTop = item.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, itemTop - 100);
      });
    });
  }, []);

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-7 mx-auto">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item mb-5 border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className="accordion-button fs-5"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse1"
                  aria-expanded="true"
                  aria-controls="collapse1"
                >
                  1. Who we are
                </button>
              </h2>
              <div
                id="collapse1"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Our website address is:{' '}
                    <a href="https://iysskillstech.com/">
                      https://iysskillstech.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item mb-5 border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fs-5"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse2"
                  aria-expanded="false"
                  aria-controls="collapse2"
                >
                  2. What personal data we collect and why we collect it
                </button>
              </h2>
              <div
                id="collapse2"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <h4>Comments</h4>
                  <p>
                    When visitors leave comments on the site we collect the data
                    shown in the comments form, and also the visitor’s IP
                    address and browser user agent string to help spam
                    detection.
                  </p>
                  <p>
                    An anonymized string created from your email address (also
                    called a hash) may be provided to the Gravatar service to
                    see if you are using it. The Gravatar service privacy policy
                    is available here:{' '}
                    <a target='_blank' href="https://automattic.com/privacy">
                      https://automattic.com/privacy/
                    </a>
                    . After approval of your comment, your profile picture is
                    visible to the public in the context of your comment.
                  </p>
                  <h4>Media</h4>
                  <p>
                    If you upload images to the website, you should avoid
                    uploading images with embedded location data (EXIF GPS)
                    included. Visitors to the website can download and extract
                    any location data from images on the website.
                  </p>
                  <h4>Contact forms</h4>
                  <h4>Cookies</h4>
                  <p>
                    If you leave a comment on our site you may opt-in to saving
                    your name, email address and website in cookies. These are
                    for your convenience so that you do not have to fill in your
                    details again when you leave another comment. These cookies
                    will last for one year.
                  </p>
                  <p>
                    If you visit our login page, we will set a temporary cookie
                    to determine if your browser accepts cookies. This cookie
                    contains no personal data and is discarded when you close
                    your browser.
                  </p>
                  <p>
                    When you log in, we will also set up several cookies to save
                    your login information and your screen display choices.
                    Login cookies last for two days, and screen options cookies
                    last for a year. If you select “Remember Me”, your login
                    will persist for two weeks. If you log out of your account,
                    the login cookies will be removed.
                  </p>
                  <p>
                    If you edit or publish an article, an additional cookie will
                    be saved in your browser. This cookie includes no personal
                    data and simply indicates the post ID of the article you
                    just edited. It expires after 1 day.
                  </p>
                  <h4>Embedded content from other websites</h4>
                  <p>
                    Articles on this site may include embedded content (e.g.
                    videos, images, articles, etc.). Embedded content from other
                    websites behaves in the exact same way as if the visitor has
                    visited the other website.
                  </p>
                  <p>
                    These websites may collect data about you, use cookies,
                    embed additional third-party tracking, and monitor your
                    interaction with that embedded content, including tracking
                    your interaction with the embedded content if you have an
                    account and are logged in to that website.
                  </p>
                  <h4>Analytics</h4>
                </div>
              </div>
            </div>
            <div className="accordion-item mb-5 border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fs-5"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse3"
                  aria-expanded="false"
                  aria-controls="collapse3"
                >
                  3. Who we share your data with
                </button>
              </h2>
              <div
                id="collapse3"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    If you request a password reset, your IP address will be
                    included in the reset email.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item mb-5 border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fs-5"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse4"
                  aria-expanded="false"
                  aria-controls="collapse4"
                >
                  4. How long we retain your data
                </button>
              </h2>
              <div
                id="collapse4"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    If you leave a comment, the comment and its metadata are
                    retained indefinitely. This is so we can recognize and
                    approve any follow-up comments automatically instead of
                    holding them in a moderation queue.
                  </p>
                  <p>
                    For users that register on our website (if any), we also
                    store the personal information they provide in their user
                    profile. All users can see, edit, or delete their personal
                    information at any time (except they cannot change their
                    username). Website administrators can also see and edit that
                    information.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item mb-5 border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fs-5"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse5"
                  aria-expanded="false"
                  aria-controls="collapse5"
                >
                  5. What rights you have over your data
                </button>
              </h2>
              <div
                id="collapse5"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    If you have an account on this site, or have left comments,
                    you can request to receive an exported file of the personal
                    data we hold about you, including any data you have provided
                    to us. You can also request that we erase any personal data
                    we hold about you. This does not include any data we are
                    obliged to keep for administrative, legal, or security
                    purposes.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item mb-5 border-0 border-bottom">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed fs-5"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse6"
                  aria-expanded="false"
                  aria-controls="collapse6"
                >
                  6. Where we send your data
                </button>
              </h2>
              <div
                id="collapse6"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Visitor comments may be checked through an automated spam
                    detection service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Newsletter title="Have more questions?" />
      </div>
    </div>
  );
};

export default Content;
