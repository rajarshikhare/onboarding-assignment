import { useEffect, useState } from "react"
import { getOrders } from "../apiservice/FlipkartApi"
import { Chip, Divider } from "@nextui-org/react"
import moment from 'moment';


export const Orders = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        getOrders().then(data => {
            setOrders(data)
        })
    }, [])

    return <div className="flex flex-col gap-8">
        <p className="text-2xl font-bold">Order History</p>
        <div className="flex flex-col gap-8">
            {
                orders.map(order => {
                    return <Item {...order} />
                })
            }
        </div>
    </div>
}

const InfoText = props => {
    const { label, data } = props;
    return <div className="flex flex-col gap-2">
        <div>
            {label}
        </div>
        <div className="font-bold">
            {data}
        </div>
    </div>
}


const Item = props => {
    const { products, paymentStatus, orderStatus, shippingAddress, date } = props
    return <div className="flex w-full flex-col p-8 gap-4 border-2">
        <div className="flex justify-between ">
            <InfoText label="Order Placed" data={moment(date).fromNow()} />
            <InfoText label="Shipping To" data={shippingAddress?.firstName + " " + shippingAddress?.lastName} />
            <InfoText label="Payment Status" data={<Chip color="success">{paymentStatus}</Chip>} />
            <InfoText label="Order Status " data={<Chip color="success">{orderStatus}</Chip>} />

        </div>
        <Divider />
        <div className="flex gap-4">
            Products {products.length}
        </div>
    </div>
}
