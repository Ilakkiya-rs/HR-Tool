import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black py-1 text-center">
      <p className="text-white">
        myskillsplus.com is a property of {" "}
        <Link
          href="https://www.iysskillstech.com"
          target="_blank"
          className="text-primary hover:underline"
        >
          IYS Skills Tech
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
