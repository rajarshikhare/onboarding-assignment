import { Checkbox, Input, Button, Divider } from "@nextui-org/react";
import { CostBreakdown, Items } from "./CartDetails";
import { useDispatch, useSelector } from "react-redux"
import { removeItem } from "./cartSlice.js"

const Address = props => {
    return <div className="flex w-1/2 flex-col gap-6 p-4">
        <p className="text-3xl font-bold">
            Checkout
        </p>
        <p className="text-xl">
            Shipping information
        </p>
        <div className="flex flex-row gap-2">
            <Input label="First Name" />
            <Input label="Last Name" />
        </div>
        <Input label="Apartment, suite, etc (optional)" />
        <Input label="City" />
        <div className="flex flex-row gap-2">
            <Input label="Country" />
            <Input label="City" />
            <Input label="Zipcode" />
        </div>
        <Input label="Optional" />
        <Checkbox defaultSelected>Save contact information</Checkbox>
        <Button color="primary">
            Continue to shipping
        </Button>
    </div>
}

const CartInfo = props => {
    const { cartItems } = useSelector(state => state.cart)
    const total = cartItems.reduce((sum, item) => sum += item.price * item.quantity, 0)
    const dispatch = useDispatch()

    const onRemoveItem = id => {
        dispatch(removeItem(id))
    }

    return <div className="flex w-1/2 flex-col gap-6 p-4">
        <p className="text-3xl font-bold">
            Your cart
        </p>
        {
            cartItems.map(item => {
                return <Items {...item} onRemove={onRemoveItem} />
            })
        }
        {
            cartItems.map(item => {
                return <CostBreakdown label={item.title} data={`${item.quantity} x ${item.price} $`} />
            })
        }
        <Divider className="my-4" />
        <CostBreakdown label={"Subtotal"} data={`${JSON.stringify(total)} $`} />
    </div>
}

export const CheckoutPage = () => {
    return <div className="flex gap-4 w-full">
        <Address />
        <CartInfo />
    </div>
}