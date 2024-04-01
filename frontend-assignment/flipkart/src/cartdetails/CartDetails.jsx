import { Link, useNavigate } from "react-router-dom"
import { Button, Divider, Image, Input } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { removeItem } from "./cartSlice.js"

export const CartDetails = () => {
    const cartItems = useSelector(state => state.cart.cartItems)
    const total = cartItems.reduce((sum, item) => sum += item.price * item.quantity, 0)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onRemoveItem = id => {
        dispatch(removeItem(id))
    }

    const onCheckout = () => {
        navigate("/checkout")
    }

    return <div className="flex w-full gap-8">
        <div className="flex flex-col w-1/2 gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-3xl">
                    Your cart
                </p>
                <p>
                    Not ready to checkout?
                    <Link to={"/"}>
                        Continue Shopping
                    </Link>
                </p>
            </div>
            {
                cartItems.map(order => {
                    return <Items {...order} onRemove={onRemoveItem} />
                })
            }
        </div>
        <div className="flex flex-col gap-8 w-1/2">
            <p className="text-3xl">
                Order Summary
            </p>
            <Input label="Enter coupon code here" size="sm" />
            <div className="flex flex-col gap-4">
                {
                    cartItems.map(item => {
                        return <CostBreakdown label={item.title} data={`${item.quantity} x ${item.price} $`} />
                    })
                }
                <Divider className="my-4" />
                <CostBreakdown label={"Subtotal"} data={`${JSON.stringify(total)} $`} />
            </div>
            <div className="flex justify-end">
                <Button color="primary" onClick={onCheckout}>
                    Continue to checkout
                </Button>
            </div>
        </div>
    </div>
}

export const Items = props => {
    const { title, id, price, onRemove, quantity = 1 } = props

    return <div className="flex w-full py-4 gap-4">
        <div className="flex w-1/4">
            <Image
                shadow="sm"
                width="100%"
                radius="lg"
                alt={title}
                className="h-full"
                src={"/images/hero-card-complete.jpg"}
            />
        </div>
        <div className="w-3/4 gap-1 flex flex-col p-2">
            <div>
                <p className="font-bold text-1xl">
                    {title}
                </p>
            </div>
            <div>
                <p>
                    Quantity: {quantity}
                </p>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="w-full font-bold text-2xl">
                    {`${price} $`}
                </div>
                <div />
                <div className="w-full flex justify-end">
                    <Button color="danger" onClick={() => onRemove(id)}>
                        Remove
                    </Button>
                </div>
            </div>
        </div>

    </div>
}

export const CostBreakdown = props => {
    const { label, data } = props
    return <div className="flex">
        {label}
        <div className="flex-grow" />
        <p className="text-slate-500">
            {data}
        </p>
    </div>
}