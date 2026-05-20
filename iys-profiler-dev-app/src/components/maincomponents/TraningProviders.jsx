import '@/assets/css/customCss.css';
import { Container } from 'react-bootstrap';

import ContactUs from './ContactUs';

export const TraningProviders = () => {
  return (
    <>
      <Container>
        <br></br>
        <br></br>
        <h3 className="text-center mt-2">If you are a training provider</h3>
        <h3 className="text-center mt-2">
          You can can boost your business with IYS Skills Profiler
        </h3>

        <hr></hr>
        <h3 className=" mt-2">Personalization</h3>
        <p className=" fs-5 ">
          It’s a world of hype-personalization. We are recommended movies that
          is right for our taste, so also music, news, videos, products,
          services and others.
        </p>
        <p className=" fs-5 ">
          It is not enough for any business (say for example an E-Commerce one)
          to say it has millions of products, user would like to see
          “recommendations” of the four or five products that are most relevant
          to him or her based on their persona, buying behavior, and others -
          essentially <b>buyer profile</b>
        </p>
        <br></br>
        <h3 className=" mt-2">Personalization in Training offerings</h3>
        <p className=" fs-5 ">
          Is your Training providing business offerings that most four of five
          training courses to users or is it just presenting the thousands of
          courses in your repository?
        </p>
        <p className=" fs-5 ">
          If you are not recommending training courses, surely you are losing
          out.
        </p>
        <p className=" fs-5 ">
          Users would love to see you Training site offer recommendations. You
          too would like the same, right?
        </p>
        <br></br>
        <h3 className=" mt-2">How to personalize?</h3>
        <p className=" fs-5 ">
          Each user’s profile is different or rather his or her “skills
          profile”.
        </p>
        <p className=" fs-5 ">
          Once you know their “skills profile” you can matching programs to
          select the training programs that best suit the person’s skills
          profile.
        </p>
        <p className=" fs-5 ">
          So, how can you get the user to create his or her skills profile?
        </p>
        <br></br>
        <h3 className=" mt-2">IYS’s business booster</h3>
        <p className=" fs-5 ">
          IYS offers a powerful yet simple Skills Profiler that enables
          individuals to map their skills. The skills profiler is backed by a
          rich skills taxonomy that enables users to intuitively map their
          skills across different dimensions.
        </p>
        <p className=" fs-5 ">
          And once you have their skills profile, you will be able to
          programmatically recommend training programs - personalizing your
          offerings.
        </p>
        <br></br>

        <h3 className="">
          Want to know more about IYS Skills Profiler? Let’s connect.
        </h3>
        <hr></hr>
        <ContactUs />
      </Container>
    </>
  );
};

export default TraningProviders;
