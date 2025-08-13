// /client/src/components/dashboard/Navbar.tsx

import React from 'react';
import NavItem, { SubNavItem } from './NavItem';
import {
  HomeIcon,
  TrophyIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  IdentificationIcon,
  TableCellsIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

// This type is now used by each page to identify itself.
export type ActiveNavItems = "Home" | "Routine" | "Attendance" | "Grades" | "Disputes" | "Degree" | "Services" | null;

interface NavbarProps {
  activeItem?: ActiveNavItems;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem = "Home" }) => {
  const navItemBaseClass = "min-w-[110px] md:min-w-0 flex-shrink-0";

  return (
    <nav className="bg-dark-primary shadow-md border-b border-dark-tertiary">
      <ul className="container mx-auto px-2 sm:px-4 lg:px-6 flex flex-wrap justify-center md:justify-start space-x-0 md:space-x-1 py-1.5">
        {/* All links now navigate to the main dashboard page. */}
        <NavItem icon={<HomeIcon />} label="Home" href="/dashboard" isActive={activeItem === "Home"} className={navItemBaseClass}/>
        <NavItem icon={<TableCellsIcon />} label="Routine" href="/dashboard" isActive={activeItem === "Routine"} className={navItemBaseClass}/>
        <NavItem icon={<DocumentChartBarIcon />} label="Attendance" href="/dashboard" isActive={activeItem === "Attendance"} className={navItemBaseClass}/>
        
        <NavItem icon={<TrophyIcon />} label="Grades" isDropdown isActive={["Grades", "Disputes"].includes(activeItem || "")} className={navItemBaseClass}>
           <SubNavItem label="View Grades" href="/dashboard" isActive={activeItem === "Grades"} />
           {/* This link correctly navigates to the separate Grade Dispute page. */}
           <SubNavItem label="Grade Dispute" href="/disputes" isActive={activeItem === "Disputes"} />
        </NavItem>
        
        <NavItem icon={<IdentificationIcon />} label="Degree" href="/dashboard" isActive={activeItem === "Degree"} className={navItemBaseClass} />
        <NavItem icon={<CogIcon />} label="Services" href="/dashboard" isActive={activeItem === "Services"} className={navItemBaseClass} />
        <NavItem icon={<ArrowLeftOnRectangleIcon />} label="Logout" href="/login" className={navItemBaseClass}/>
      </ul>
    </nav>
  );
};

export default Navbar;