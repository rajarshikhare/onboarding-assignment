import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  useDisclosure,
} from "@nextui-org/react";
import EditProfile from "./EditProfile";
import { Outlet } from "react-router";
import { Navigate } from "react-router-dom";

export default function AppBar() {
  if (
    localStorage.getItem("token") === "" ||
    localStorage.getItem("token") === null
  ) {
    return <Navigate to="/" />;
  }

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onLogout = () => {
    localStorage.setItem("token", "");
    location.reload();
  };

  return (
    <>
      <EditProfile isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">File Sharing 101</p>
        </NavbarBrand>
        <NavbarContent
          className="hidden gap-4 sm:flex"
          justify="end"
        >
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          <p className="text-2xl">
            Hi, {localStorage.getItem("name")}
          </p>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{localStorage.getItem("email")}</p>
              </DropdownItem>
              <DropdownItem key="settings" onClick={onOpen}>
                My Settings
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={onLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <Outlet />
    </>
  );
}
