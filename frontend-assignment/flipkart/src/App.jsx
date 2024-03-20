import { Button } from "@nextui-org/react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { PrivateRoute } from "./approuter/PrivateRoute";
import { Product } from "./productpage/Product";
import { ProductDetails } from "./productdetails/ProductDetails";
import { CartDetails } from "./cartdetails/CartDetails";
import { Orders } from "./orders/Orders";
import { NextUIProvider } from "@nextui-org/react";
import { CheckoutPage } from "./cartdetails/CheckoutPage";

function App() {
    const navigate = useNavigate()
    return (
        <NextUIProvider navigate={navigate}>
            <Routes>
                <Route path="/" element={<PrivateRoute />}>
                    <Route path="" element={<Product />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<CartDetails />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="orders" element={<Orders />} />
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

export default App;
