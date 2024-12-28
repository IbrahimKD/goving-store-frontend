import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import WebsiteName from "../utils/WebsiteName";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer
      className="bg-[#101924] border-t border-t-primary/50 mt-10
     w-full  flex flex-col justify-center items-center"
    >
      <div className="flex justify-around px-12 py-16 max-lg:px-4  items-start  flex-wrap max-md:gap-y-5 max-[550px]:gap-y-8">
        <div className="flex flex-col gap-3 w-[24%] max-lg:w-2/5 max-[550px]:w-full">
          {/* <Image
            src={"https://tranzur.com/uploads/1706470372288-265562912.svg"}
            width={50}
            height={50}
            alt="logo"
          /> */}
          <h2 className="text-xl font-semibold">{WebsiteName}</h2>
          <p className="text-accent text-sm">
            {WebsiteName} is an online store that provides game products,
            in-game purchases, digital programs, digital cards, and
            subscriptions for various platforms.
          </p>
        </div>
        <div className="flex flex-col gap-3 max-md:w-2/5 max-[550px]:w-full">
          <h2 className="text-accent text-xl">USEFUL LINKS</h2>
          <ul className="flex flex-col  text-sm gap-3">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Use & Return Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-5 h-full max-md:w-[90%] max-[550px]:w-full">
          <h2 className="text-accent text-xl">Contact</h2>
          <div className="flex flex-col gap-3">
            <a href="/" className="flex gap-2 items-center text-sm">
              <MdOutlineMail className="text-xl" /> example@example.com
            </a>
            <a href="/" className="flex gap-2 items-center text-sm">
              <FaWhatsapp className="text-xl" /> +90 505 578 13 00
            </a>
          </div>
          <div className="flex flex-wrap  text-xl w-max gap-2 ">
            <Link href="/" className="cursor-pointer">
              <FaYoutube />
            </Link>
            <Link href="/" className="cursor-pointer">
              <FaTiktok />
            </Link>
            <Link href="/" className="cursor-pointer">
              <FaFacebook />
            </Link>
            <Link href="/" className="cursor-pointer">
              <FaTwitter />
            </Link>
            <Link
              href="https://instagram.com/jamal_mohafil"
              className="cursor-pointer"
            >
              <FaInstagram />
            </Link>

            <Link href="/" className="cursor-pointer">
              <FaDiscord />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#0e1620] max-w-[1200px] px-16 py-3 flex justify-between items-center max-md:px-2 flex-wrap gap-2">
        <span className="text-[13px]">
          © 2024. All rights reserved | Powered by{" "}
          <a
            href="https://instagram.com/jamal_mohafil"
            target="_blank"
            className="text-primary"
          >
            Jamal Mohafil.
          </a>
        </span>
        {/* <Image
          width={30}
          height={30}
          alt="lo"
          className="bg-white p-1 rounded-md"
          src="https://blackdozer.com/assets/images/sbc_logo.webp"
        /> */}
      </div>
    </footer>
  );
};

export default Footer;
