import { Auth } from "./Auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import * as React from "react";
import { Link } from "react-router-dom";
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { getUuid, numberWithCommas } from "../../utils/Util";
import { NavbarProps } from "../../utils/Interfaces";

export function Navbar(props: NavbarProps) {
  const {
    isLoggedIn,
    setIsLoggedIn,
    balance,
    setBalance,
    setUser,
    isViewingDashboard,
    matchup,
  } = props;
  const [profileImg, setProfileImg] = React.useState("");

  const extractUserData = (credentialReponse: CredentialResponse) => {
    const data: never = jwtDecode(credentialReponse.credential);
    setProfileImg(data["picture"]);
    setIsLoggedIn(true);
    setUser({
      id: getUuid(data["email"]),
      name: data["name"],
      profile: data["picture"],
    });
  };

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
    setUser(null);
    setBalance(0);
  };

  return (
    <nav className="bg-gray-900 text-white w-full fixed z-60 scrollbar-hide border-b-gray-300 border-b-1">
      <div className="flex-row py-4 items-center flex justify-start box-border relative">
        <div className="flex flex-row grow justify-start w-6/10 md:w-18/20">
          <Link
            className="px-4 justify-start text-start text-white flex-1 flex-row font-bold"
            to={"/"}
          >
            <span className="">CnB Baloncesto Betting</span>
            <span className="text-xs md:text-sm text-gray-400 pl-1">
              Week {matchup >= 0 ? matchup : ""}
            </span>
          </Link>
        </div>
        <div className="flex flex-row grow justify-end w-2/10 md:w-1/20">
          <span className="px-3 flex font-[ProximaNova-Bold, serif]">
            ${numberWithCommas(parseFloat(balance.toFixed(2)))}
          </span>
        </div>
        <Menu
          as="div"
          className="flex justify-center grow px-4 md:justify-end relative w-2/10 md:w-1/20"
        >
          <MenuButton className="cursor-pointer inline-flex rounded-md hover:bg-gray-800 focus:outline-none text-base py-2 focus-visible:ring-1 focus-visible:ring-gray-800">
            <Auth isLoggedIn={isLoggedIn} profileImg={profileImg} />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 mr-2 z-65 mt-12 w-46 origin-top-right rounded-md bg-gray-900 outline-1 outline-gray-400 -outline-offset-1  transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="">
              {isLoggedIn && (
                <div>
                  <MenuItem>
                    <Link
                      className="block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                      to={"/"}
                    >
                      Return to Dashboard
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      className="block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                      to={"/parlays"}
                    >
                      View Parlays
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={"/"}
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                    >
                      <span>Log Out</span>
                    </Link>
                  </MenuItem>
                </div>
              )}
              {!isLoggedIn && (
                <form action="#" method="POST">
                  <MenuItem>
                    <button
                      type="submit"
                      className="block w-full mr-4 bg-transparent"
                    >
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          extractUserData(credentialResponse);
                        }}
                        onError={() => console.log("Login failed")}
                        auto_select={true}
                      />
                    </button>
                  </MenuItem>
                  {!isViewingDashboard && (
                    <MenuItem>
                      <Link
                        className="block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                        to={"/"}
                      >
                        Return to Dashboard
                      </Link>
                    </MenuItem>
                  )}
                </form>
              )}
            </div>
          </MenuItems>
        </Menu>
      </div>
      <div
        className={
          isViewingDashboard
            ? "h-9.5 box-border w-full overflow-hidden z-60 mb-2.5 fixed"
            : "h-9.5 box-border w-full overflow-hidden z-60 mb-2.5 fixed hidden"
        }
      >
        <div className="shadow-none overflow-hidden rounded-b-xs list-none">
          <div className="h-9.5 border-b-gray-600 bg-gray-700 border-solid border-b flex-row items-stretch flex justify-start box-border relative">
            <div className="w-1/2 h-9.5 basis-0 grow items-center justify-between flex box-border relative pl-4">
              <h3 className="text-ellipsis text-xs text-gray-300 box-border overflow-hidden relative m-0 p-0 font-inherit">
                FANTASY BASKETBALL
              </h3>
            </div>
            <div className="w-1/2 items-stretch justify-start flex-col flex box-border relative list-none">
              <div className="grow items-center justify-start flex-row flex box-border relative list-none">
                <div className="w-1/3 basis-0 grow justify-center items-center flex-row flex box-border relative">
                  <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                    spread
                  </span>
                </div>
                <div className="w-1/3 basis-0 grow justify-center items-center flex-row flex box-border relative">
                  <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                    totals
                  </span>
                </div>
                <div className="w-1/3 basis-0 grow justify-center items-center flex-row flex box-border relative">
                  <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                    money
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
