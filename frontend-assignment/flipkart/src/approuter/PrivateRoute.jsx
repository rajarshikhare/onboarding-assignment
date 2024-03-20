import { Outlet } from "react-router-dom"
import { Navbar, NavbarBrand, Input, NavbarContent, NavbarItem, Link, Button, Badge, useSelect } from "@nextui-org/react";
import { SearchIcon } from "./SearchIcon.jsx";
import { CartIcon } from "./CartIcon.jsx";
import { useSelector } from "react-redux";


export const PrivateRoute = () => {
    const cartItems = useSelector(state => state.cart.cartItems)
    const itemCount = cartItems.reduce((sum, i) => sum += i.quantity, 0)
    return <div>
        <Navbar shouldHideOnScroll>
            <NavbarBrand className="gap-4">
                <Link href="/">
                    <p className="font-bold text-inherit" >Flipkart</p>
                </Link>
                <NavbarItem className="w-full">
                    <Input
                        classNames={{
                            base: "w-full h-10",
                            mainWrapper: "h-full",
                            input: "text-small",
                            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                        }}
                        placeholder="Type to search..."
                        size="sm"
                        startContent={<SearchIcon size={18} />}
                        type="search"
                    />
                </NavbarItem>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Link color="foreground" href="/orders">
                        My Orders
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link color="foreground" href="/cart">
                        <Badge color="danger" content={itemCount} shape="circle">
                            <CartIcon />
                        </Badge>
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        <div className="w-screen p-32 pt-8">
            <Outlet />
        </div>
    </div >
}