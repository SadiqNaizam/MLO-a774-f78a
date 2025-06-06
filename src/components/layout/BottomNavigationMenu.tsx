import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListChecks, CreditCard, Settings, Landmark } from 'lucide-react'; // Example icons

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/accounts', label: 'Accounts', icon: Landmark },
  { href: '/transactions', label: 'Activity', icon: ListChecks },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings }, // Example item
];

const BottomNavigationMenu: React.FC = () => {
  console.log("Rendering BottomNavigationMenu");
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-5 items-center">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center space-y-1 rounded-md p-2 text-sm font-medium transition-colors
                ${isActive
                  ? 'text-primary-action' // Use custom primary action color for active
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-action' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNavigationMenu;