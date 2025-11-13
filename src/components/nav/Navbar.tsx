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
import { getUuid } from "../../utils/Util";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
}

export function Navbar(props: NavbarProps) {
  const { isLoggedIn, setIsLoggedIn, balance, setBalance, setUser } = props;
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
    <nav className="bg-gray-900 text-white w-full z-60">
      <div className="container flex flex-row mx-auto px-4 md:flex items-center gap-6">
        <a href="#" className="py-5 w-5/8 px-2 text-white flex-1 font-bold">
          <Link to={"/"}>CnB Baloncesto Betting</Link>
        </a>
        <span className="py-2 px-3 w-2/8 block font-[ProximaNova-Bold, serif]">
          ${balance}
        </span>

        <Menu as="div" className="relative inline-block w-1/8">
          <MenuButton className="cursor-pointer inline-flex w-full justify-center gap-x-1.5 rounded-md text-sm font-semibold text-white">
            <Auth isLoggedIn={isLoggedIn} profileImg={profileImg} />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-60 mt-2 w-56 origin-top-right rounded-md bg-gray-900 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1">
              {isLoggedIn && (
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                  >
                    <Link to={"/"}>Return to Dashboard</Link>
                  </a>
                </MenuItem>
              )}
              {isLoggedIn && (
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                  >
                    <Link to={"/parlays"}>View Parlays</Link>
                  </a>
                </MenuItem>
              )}
              {isLoggedIn && (
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                    onClick={handleLogout}
                  >
                    Log Out
                  </a>
                </MenuItem>
              )}
              {!isLoggedIn && (
                <form action="#" method="POST">
                  <MenuItem>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
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
      <div>
        <LiveParlayViewer
          balance={balance}
          setBalance={setBalance}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </nav>
  );
}
