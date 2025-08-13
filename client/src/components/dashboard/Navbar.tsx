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
  DocumentChartBarIcon,
  CreditCardIcon // 1. ADD THIS IMPORT for the new payments icon
} from '@heroicons/react/24/outline';

// 2. UPDATE THIS TYPE to include the new payment-related navigation states
export type ActiveNavItems = "Home" | "Routine" | "Attendance" | "Grades" | "Disputes" | "Degree" | "Services" | "Payments" | "Payment History" | null;

interface NavbarProps {
  activeItem?: ActiveNavItems;
}

const Navbar: React.FC<NavbarProps> = ({ activeItem = "Home" }) => {
  const navItemBaseClass = "min-w-[110px] md:min-w-0 flex-shrink-0";

  return (
    <nav className="bg-dark-primary shadow-md border-b border-dark-tertiary">
      <ul className="container mx-auto px-2 sm:px-4 lg:px-6 flex flex-wrap justify-center md:justify-start space-x-0 md:space-x-1 py-1.5">
        <NavItem icon={<HomeIcon />} label="Home" href="/dashboard" isActive={activeItem === "Home"} className={navItemBaseClass}/>
        <NavItem icon={<TableCellsIcon />} label="Routine" href="/routine" isActive={activeItem === "Routine"} className={navItemBaseClass}/>
        <NavItem icon={<DocumentChartBarIcon />} label="Attendance" href="/attendance" isActive={activeItem === "Attendance"} className={navItemBaseClass}/>
        
        <NavItem icon={<TrophyIcon />} label="Grades" isDropdown isActive={["Grades", "Disputes"].includes(activeItem || "")} className={navItemBaseClass}>
           <SubNavItem label="Grade Dispute" href="/disputes" isActive={activeItem === "Disputes"} />
        </NavItem>

        {/* 3. ADD THIS ENTIRE NavItem BLOCK for the Payments feature */}
        <NavItem 
            icon={<CreditCardIcon />} 
            label="Payments" 
            isDropdown 
            isActive={["Payments", "Payment History"].includes(activeItem || "")} 
            className={navItemBaseClass}
        >
           <SubNavItem label="Account Status" href="/payments" isActive={activeItem === "Payments"} />
           <SubNavItem label="Online Payment History" href="/payment-history" isActive={activeItem === "Payment History"} />
        </NavItem>
        
        <NavItem icon={<IdentificationIcon />} label="Degree" href="/dashboard" isActive={activeItem === "Degree"} className={navItemBaseClass} />
        
        <NavItem icon={<CogIcon />} label="Services" isDropdown isActive={activeItem === "Services"} className={navItemBaseClass}>
          <SubNavItem label="Car Parking Request" href="/car-parking-request" />
          <SubNavItem label="Course Add/Drop" href="/course-add-drop" />
          <SubNavItem label="RFID Request" href="/rfid-request" />
          <SubNavItem label="Semester Drop Request" href="/semester-drop-request" />
        </NavItem>

        <NavItem icon={<ArrowLeftOnRectangleIcon />} label="Logout" href="/login" className={navItemBaseClass}/>
      </ul>
    </nav>
  );
};

export default Navbar;