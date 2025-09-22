
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { data } = useAppContext();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Matches', path: '/matches' },
    { name: 'Players', path: '/players' },
  ];

  const activeLinkStyle = {
    color: '#1e40af', // a deep blue
    borderBottom: '2px solid #1e40af',
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.065a2.502 2.502 0 011.637 4.505l.08.04a1 1 0 01.363 1.363l-1.5 2.598a1 1 0 01-1.554.448l-.08-.04a2.5 2.5 0 01-1.638-4.505V2a1 1 0 01.3- .954zM4.637 8.61A2.5 2.5 0 013 13.115V18a1 1 0 001 1h12a1 1 0 001-1v-4.885a2.5 2.5 0 01-1.637-4.505l-.08-.04a1 1 0 00-1.555.448l-1.5 2.598a1 1 0 00.364 1.363l.08.04a2.5 2.5 0 011.638 4.505V17H5v-.885a2.5 2.5 0 011.638-4.505l.08-.04a1 1 0 00.363-1.363l-1.5-2.598a1 1 0 00-1.554-.448l-.08.04z" clipRule="evenodd" />
            </svg>
            <span className="ml-3 text-xl font-bold text-gray-800">Team Manager</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition duration-150 ease-in-out"
                style={({ isActive }) => (isActive ? activeLinkStyle : { borderBottom: '2px solid transparent' })}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center">
             <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{data.year} Season</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
