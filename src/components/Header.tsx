
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-glass-dark backdrop-blur-lg border-b border-glass-border"
          : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            SageX
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {["Product", "Resources", "Pricing", "Blog"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-white hover:text-purple-400 transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <motion.button
            className="hidden md:flex px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium transition-all duration-300 animate-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Get Started
          </motion.button>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-glass-dark backdrop-blur-lg border-t border-glass-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="px-4 py-4 space-y-4">
            {["Product", "Resources", "Pricing", "Blog"].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-white hover:text-purple-400 transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium transition-all duration-300">
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
