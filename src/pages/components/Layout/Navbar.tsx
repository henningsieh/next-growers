import { AnimatePresence, motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';
import Modal from '../Modal';
import { useState } from 'react';

const Navbar = () => {
  const { data: session, status } = useSession();

  const [showModal, setShowModal] = useState(false);

  const handleSignInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="sticky top-0 p-2">
      <AnimatePresence>
        <motion.nav
          initial={{ y: -50, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, type: 'easeInOut'}}
        >
          <div className="navbar bg-neutral">
            <div className="navbar-start">
              {/* Mobile Nav */}
              <div className="z-40 dropdown">
                <label tabIndex={0} className="btn btn-ghost lg:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>

                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg> */}
                </label>
                <ul
                  tabIndex={0}
                  className="z-40 w-64 mt-3 p-2 shadow bg-base-200 rounded-box menu menu-compact dropdown-content"
                >
                  <li>
                    <a href="#TOP">TOP SECTION</a>
                  </li>
                  <li>
                    <a href="#API">BELOW SECTION</a>
                  </li>
                  <li>
                    <Link href="/t3-app-info">T3-App Info</Link>
                  </li>
                  <li tabIndex={0}>
                    <a className="justify-between cursor-default">
                      Parent {`<submenu>`}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>
                    <ul className="p-2 w-32">
                      <li>
                        <a>Seeds</a>
                      </li>
                      <li>
                        <a>Lights</a>
                      </li>
                      <li>
                        <a>Tents</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="btn btn-ghost normal-case text-xl">
                <Link href="/">GrowAGram.com</Link>
              </div>
            </div>
            {/* Regular Nav */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a href="#TOP">TOP SECTION</a>
                </li>
                <li>
                  <a href="#API">BELOW SECTION</a>
                </li>
                <li>
                  <Link href="/t3-app-info">T3-App Info</Link>
                </li>
                <li tabIndex={0}>
                  <a className="justify-between cursor-default">
                    Parent {`<submenu>`}
                    <svg
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </a>
                  <ul className="p-2">
                    <li>
                      <a>Seeds</a>
                    </li>
                    <li>
                      <a>Lights</a>
                    </li>
                    <li>
                      <a>Tents</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="navbar-end">
              {/* <div className='pr-2'><i>{status}</i> as {session?.user.role.replace(/"/g, '')} with {JSON.stringify(session?.user.email)}</div> */}
              {status === "unauthenticated" ?
              <button
                className={`btn ${status === "authenticated" 
                  ? "btn btn-outline btn-error" 
                  : "btn btn-primary rounded-lg"
                }`} 
                onClick={ status === "authenticated" 
                  ? () => void signOut() 
                  : handleSignInClick }>
                {status === "authenticated"
                  ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" 
                    viewBox="4 -2 22 28"
                    className="pr-0 w-6 h-6" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor"
                    viewBox="4 -2 22 28"
                    className="pr-1 w-6 h-6" >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                  </svg>
                }
                {status === "authenticated" ? "Sign Out" : "Sign In" }
              </button>
              : '' }

            {status === "authenticated" 
            ? <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    {session?.user?.image 
                    ? (
                      <Image
                        alt={`${session.user.name || ''}'s Profile Image`}
                        width={500} height={500}
                        src={session.user.image}
                      /> ) 
                    : ( '' )}
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-64">
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge badge-error badge-outline">Attention</span>
                    </a>
                  </li>
                  <li><a>Settings</a></li>
                  <li className='btn-outline btn-error rounded-md'><a  onClick={() => void signOut()} >Logout</a></li>
                </ul>
              </div>
            : '' }
            </div>


          </div>
        </motion.nav>
        {showModal && <Modal onClose={handleCloseModal} isOpen={showModal} />}
      </AnimatePresence>      
    </div>
  );
};

export default Navbar;
