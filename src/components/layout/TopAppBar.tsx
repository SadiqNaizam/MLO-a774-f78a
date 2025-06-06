import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile menu drawer

interface TopAppBarProps {
  title?: string;
  onMenuClick?: () => void; // Optional: if mobile menu is handled externally
}

const TopAppBar: React.FC<TopAppBarProps> = ({ title = "My App", onMenuClick }) => {
  console.log("Rendering TopAppBar");

  // Placeholder navigation items for mobile drawer
  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Accounts", href: "/accounts" },
    { label: "Transactions", href: "/transactions" },
    { label: "Payments", href: "/payments" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-2 py-1 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* App Title/Logo */}
        <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
          {/* <YourLogoComponent className="h-6 w-6" /> */}
          <span className="font-bold sm:inline-block">{title}</span>
        </Link>

        {/* Desktop Navigation (optional, can be empty if primary nav is BottomNavigationMenu) */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {/* Desktop nav items can go here if needed */}
        </nav>

        {/* Right side items (e.g., User Profile) */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile"> {/* Placeholder link */}
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
export default TopAppBar;