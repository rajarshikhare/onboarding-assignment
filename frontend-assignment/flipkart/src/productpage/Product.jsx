import { useEffect, useState } from "react"
import { getProducts } from "../apiservice/FlipkartApi"
import { ProductList } from "./ProductList"
import { Pagination, Select, SelectItem } from "@nextui-org/react";
import { sortBy } from "./Constant";
import { Filter } from "./Filter";
import { useDispatch, useSelector } from "react-redux";
import { onChange } from "./filterSlice";
import { debounce } from 'lodash'

const useDebouncedEffect = (effect, deps, delay) => {
    useEffect(() => {
        const handler = debounce(() => effect(), delay);

        handler();
        return () => handler.cancel();
    }, [...deps]); // Dependencies array
};

export const Product = () => {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const { sort, priceMax, priceMin, category } = useSelector(state => state.filter)
    const dispatch = useDispatch()

    useDebouncedEffect(() => {
        setLoading(true);
        getProducts(Array.from(sort)[0], priceMax, priceMin, category, currentPage).then(json => {
            setProducts(json.products);
            setTotalPage(json.totalPages)
            setLoading(false);
        });
    }, [sort, priceMax, priceMin, category, currentPage], 500);

    const onChangeValue = name => value => {
        dispatch(onChange({ name, value }))
    }

    const onChangePage = value => {
        setCurrentPage(value)
    }

    return <div className="flex flex-col w-full" >
        <div className="flex flex-col w-full gap-2">
            <div>
                <p className="text-2xl">Flipkart</p>
            </div>
            <div>
                <p className="text-gray-500">
                    Flipkart Private Limited is an Indian e-commerce company, headquartered in Bangalore, and incorporated in Singapore as a private limited company. The company initially focused on online book sales before expanding into other product categories such as consumer electronics, fashion, home essentials, groceries, and lifestyle products.
                </p>
            </div>
        </div>
        <div className="flex-row w-full flex gap-8 pt-8">
            <div className="w-1/4">
                <Filter />
            </div>
            <div className="w-3/4 flex flex-col gap-6">
                <div className="flex justify-end">
                    <Select
                        label="Sort By"
                        className="max-w-xs"
                        selectionMode="single"
                        onSelectionChange={onChangeValue("sort")}
                        selectedKeys={sort}
                    >
                        {Object.values(sortBy).map((sort) => (
                            <SelectItem key={sort.value} value={sort.value}>
                                {sort.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <ProductList products={products} loading={loading} />
                <div className="w-full flex justify-center">
                    <Pagination total={totalPage}
                        color="secondary"
                        page={currentPage}
                        onChange={onChangePage} />
                </div>
            </div>
        </div>
    </div>
}