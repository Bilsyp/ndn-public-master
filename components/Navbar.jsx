import Link from "next/link";
import { FaThreads } from "react-icons/fa6";

function Navbar() {
  return (
    <nav className="flex py-2 justify-between px-4  items-center ">
      <div>
        <Link href={"/"} className="font-bold">
          <FaThreads className="inline" size={35} />
          <span className=" pl:1 lg:pl-3 ">Bilsyp</span>
        </Link>
      </div>
      <ul style={{ display: "flex", listStyle: "none" }}>
        <li style={{ margin: "0 1rem" }}>Home</li>
        <li style={{ margin: "0 1rem" }}>About</li>
        <li style={{ margin: "0 1rem" }}>Services</li>
        <li style={{ margin: "0 1rem" }}>Contact</li>
      </ul>
    </nav>
  );
}

export default Navbar;
