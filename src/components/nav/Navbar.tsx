import { Auth } from "./Auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LiveParlayViewer } from "./LiveParlayViewer";
import * as React from "react";
import { Link } from "react-router-dom";
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { UserData } from "../../App";
import { getUuid, numberWithCommas } from "../../utils/Util";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  isViewingDashboard: boolean;
}

export function Navbar(props: NavbarProps) {
  const {
    isLoggedIn,
    setIsLoggedIn,
    balance,
    setBalance,
    setUser,
    isViewingDashboard,
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
    <nav className="bg-gray-900 text-white w-full fixed z-60 scrollbar-hide">
      <div className="container flex flex-row mx-auto px-4 items-center gap-6">
        <div className="flex flex-row w-5/8">
          <Link className="py-5 px-2 text-white flex-1 font-bold" to={"/"}>
            CnB Baloncesto Betting
          </Link>
        </div>
        <div className="flex justify-end w-2/8">
          <span className="py-2 px-3 flex font-[ProximaNova-Bold, serif]">
            ${numberWithCommas(balance)}
          </span>
        </div>
        <Menu as="div" className="flex relative w-1/8">
          <MenuButton className="cursor-pointer inline-flex w-full justify-center rounded-md hover:bg-gray-800 focus:outline-none text-base px-2 py-2 focus-visible:ring-2 focus-visible:ring-gray-800">
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
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-end text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                      onClick={handleLogout}
                    >
                      Log Out
                    </a>
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
        <div className="shadow-none overflow-hidden rounded-xs list-none">
          <div className="h-9.5 border-b-gray-600 bg-gray-700 border-solid border-b pr-4 pl-4 flex-row items-stretch flex justify-start box-border relative">
            <div className="w-1/2 h-9.5 basis-0 grow items-center justify-between flex box-border relative">
              <h3 className="text-ellipsis text-xs text-gray-300 box-border overflow-hidden relative m-0 p-0 font-inherit">
                FANTASY BASKETBALL
              </h3>
            </div>
            <div className="w-1/2 items-stretch justify-start flex-col flex box-border relative list-none">
              <div className="grow items-center justify-between flex-row flex box-border relative list-none ml-4">
                <div className="basis-0 grow justify-center items-center flex-row flex box-border relative">
                  <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                    spread
                  </span>
                </div>
                <div className="basis-0 grow justify-center items-center flex-row flex box-border relative ml-4">
                  <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative">
                    total
                  </span>
                </div>
                <div className="basis-0 grow justify-center items-center flex-row flex box-border relative">
                  <span className="font-[Proxima Nova Condensed, serif] tracking-[1px] uppercase text-gray-300 text-xs text-center box-border relative ml-4">
                    money
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <LiveParlayViewer
          balance={balance}
          setBalance={setBalance}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </nav>
  );
}
