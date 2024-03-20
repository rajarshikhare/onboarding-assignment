import { Card, CardBody, CardFooter, Image, Skeleton } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export const ProductList = props => {
    const { loading, products = [] } = props;
    let content = null
    if (loading) {
        content = Array(10).fill().map((_, i) => <ProductCardDummy key={i} />)
    } else {
        content = products.map(product => {
            return <ProductCard product={product} key={product.id} />
        })
    }

    return <div className="gap-8 grid grid-cols-4" >
        {content}
    </div>

}


const ProductCard = props => {
    const { product } = props;
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/product/${product.id}`)
    }
    return <Card isHoverable shadow="sm" key={product.id} isPressable onPress={onClick} className="w-[200px]">
        <CardBody className="overflow-visible p-0">
            <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={product.title}
                className="w-full object-cover h-[140px]"
                src={"/images/hero-card-complete.jpg"}
            />
        </CardBody>
        <CardFooter className="pt-2 px-4 flex-col items-start">
            <small className="text-default-500">{product.category}</small>
            <h4 className="font-bold text-large line-clamp-1">{product.title}</h4>
        </CardFooter>
    </Card>
}

const ProductCardDummy = props => {
    return (
        <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
            </div>
        </Card>
    );
}