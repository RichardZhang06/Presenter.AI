import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide">Presenter.AI</Link>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link to="/mic" className="hover:text-gray-200 transition">Mic Test</Link>
                    <Link to="/about" className="hover:text-gray-200 transition">About</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
