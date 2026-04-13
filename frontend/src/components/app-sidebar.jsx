import { Home, User, Settings, BarChart3, Vote } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { title: "Home", url: "/feed", icon: Home },
  { title: "My Polls", url: "/my-polls", icon: BarChart3 },
  // { title: "Voted Polls", url: "/voted-polls", icon: Vote },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <div className="w-full h-full">
      <div className="p-4">
        <h3 
          className="text-lg font-bold mb-6"
          style={{ color: '#1c1917', fontFamily: "'Syne', sans-serif" }}
        >
          WePollin
        </h3>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{
                  background: isActive ? '#fef3c7' : 'transparent',
                  color: isActive ? '#92400e' : '#57534e',
                  border: isActive ? '1px solid #fde68a' : '1px solid transparent',
                  fontFamily: "'DM Sans', sans-serif"
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}