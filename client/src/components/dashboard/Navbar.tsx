// client/src/components/dashboard/Navbar.tsx
import React from 'react';
import NavItem, { SubNavItem } from './NavItem';
import {
  HomeIcon, UserCircleIcon, PencilSquareIcon, TrophyIcon, CreditCardIcon, CalendarDaysIcon,
  CogIcon, XCircleIcon, EnvelopeIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon, IdentificationIcon
} from '@heroicons/react/24/outline';

export type ActiveNavItems = "Home" | "Profile" | "Advising" | "Grades" | "Payments" | "Attendance" | "Degree" | "Services" | "Course Drop" | "SMS History" | "User Guides" | "Logout" | null;

interface NavbarProps {
  activeItem?: ActiveNavItems;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem = "Home" }) => {
  const navItemBaseClass = "min-w-[110px] md:min-w-0 flex-shrink-0";

  return (
    <nav className="bg-dark-primary shadow-md border-b border-dark-tertiary">
      <ul className="container mx-auto px-2 sm:px-4 lg:px-6 flex flex-wrap justify-center md:justify-start space-x-0 md:space-x-1 py-1.5">
        <NavItem icon={<HomeIcon />} label="Home" href="/dashboard" isActive={activeItem === "Home"} className={navItemBaseClass}/>
        <NavItem icon={<UserCircleIcon />} label="Profile" isDropdown isActive={activeItem === "Profile"} className={navItemBaseClass}>
          <SubNavItem label="Student Information" href="#" />
          <SubNavItem label="Change Password" href="#" />
        </NavItem>
        <NavItem icon={<PencilSquareIcon />} label="Advising" isDropdown isActive={activeItem === "Advising"} className={navItemBaseClass}>
           <SubNavItem label="Pre-advising" href="#" />
           <SubNavItem label="Advising Slip Print" href="#" />
        </NavItem>
        {/* MODIFIED: The href for Grades is now an anchor link as it doesn't navigate away */}
        <NavItem icon={<TrophyIcon />} label="Grades" href="#" isActive={activeItem === "Grades"} className={navItemBaseClass} />
        <NavItem icon={<CreditCardIcon />} label="Payments" href="#" isActive={activeItem === "Payments"} className={navItemBaseClass} />
        <NavItem icon={<CalendarDaysIcon />} label="Attendance" href="#" isActive={activeItem === "Attendance"} className={navItemBaseClass}/>
        <NavItem icon={<IdentificationIcon />} label="Degree" href="#" isActive={activeItem === "Degree"} className={navItemBaseClass} />
        <NavItem icon={<CogIcon />} label="Services" href="#" isActive={activeItem === "Services"} className={navItemBaseClass} />
        <NavItem icon={<ArrowLeftOnRectangleIcon />} label="Logout" href="/login" className={navItemBaseClass}/>
      </ul>
    </nav>
  );
};

export default Navbar;