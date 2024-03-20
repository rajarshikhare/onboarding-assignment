import { useEffect, useState } from "react"
import { getProduct } from "../apiservice/FlipkartApi"
import { useParams } from "react-router-dom"
import { Button, Image } from "@nextui-org/react"
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../cartdetails/cartSlice';

export const ProductDetails = () => {
    const [product, setProduct] = useState(null)
    const dispatch = useDispatch();

    const { id } = useParams()

    useEffect(() => {
        getProduct(id).then(json => {
            setProduct(json)
        })
    }, [])
    if (!product) {
        return <div />
    }

    const handleAddItem = () => {
        dispatch(addItem(product));
    };

    return <div>
        <div className="flex flex-row w-full">
            <div className="flex w-1/2 p-8">
                <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={product.title}
                    className="w-full"
                    src={"/images/hero-card-complete.jpg"}
                />
            </div>
            <div className="flex w-1/2 p-8 flex-col gap-2">
                <div>
                    <p className="text-3xl font-semibold">
                        {product.title}
                    </p>
                    <p>
                        {product.price} $
                    </p>
                </div>
                <div>
                    {product.description}
                </div>
                <div className="flex-grow" />
                <div>
                    <div>
                        <Button onClick={handleAddItem}>
                            Add to cart
                        </Button>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}