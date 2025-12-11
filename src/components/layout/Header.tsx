import Link from "next/link";
import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <NavBar />
    </header>
  );
}
