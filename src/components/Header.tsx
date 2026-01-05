import { Menu, X, Mail, House, Info, Star, Headset, Book, Speaker, LogOut, User as UserIcon, LayoutDashboard, FileText, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: House },
    { id: 'about', label: 'Giới thiệu', icon: Info },
    { id: 'handbook', label: 'Cẩm nang', icon: Book },
    { id: 'research', label: 'Bài báo KH', icon: FileText },
    { id: 'reviews', label: 'Đánh giá', icon: Star },
    { id: 'contact', label: 'Liên hệ', icon: Headset }
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    onNavigate('home');
  };

  const getUserName = () => {
    return user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  };

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
              Gratia Et Vita
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

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{getUserName()}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-500">Đăng nhập bằng</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('counting-blessings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Đếm điều may mắn
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <UserIcon className="w-5 h-5" />
                Đăng nhập
              </button>
            )}
          </div>

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

            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div>
                  <div className="mb-2 px-2">
                    <p className="text-sm text-gray-500">Đăng nhập bằng</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors rounded mb-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('counting-blessings');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-left text-amber-600 hover:bg-amber-50 transition-colors rounded mb-2"
                  >
                    <Heart className="w-4 h-4" />
                    Đếm điều may mắn
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-left text-red-600 hover:bg-red-50 transition-colors rounded"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <UserIcon className="w-5 h-5" />
                  Đăng nhập
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
