import { Menu, X, Mail, House, Info, Star, Headset } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: House },
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'reviews', label: 'Đánh giá', icon: Star },
    { id: 'contact', label: 'Liên hệ', icon: Headset },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <span className="text-[25px] font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Hành Vi Bầy Đàn
            </span>
          </div>

          <nav className="hidden md:flex gap-6 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 font-medium transition-all ${
                  currentPage === item.id
                    ? 'text-lg text-blue-600 border-b-2 border-blue-600'
                    : 'text-lg text-gray-600 hover:text-blue-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-4 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`text-left font-medium transition-all ${
                  currentPage === item.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
