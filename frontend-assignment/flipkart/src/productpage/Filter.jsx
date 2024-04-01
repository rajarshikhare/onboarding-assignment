import { CheckboxGroup, Checkbox, Spacer } from "@nextui-org/react";
import { productCat } from "./Constant";
import { RangeSelector } from "../components/RangeSelector";
import { useDispatch, useSelector } from "react-redux";
import { onChange } from "./filterSlice";

export const Filter = () => {
    const { priceMax, priceMin, category } = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const onChangeValue = name => value => {
        dispatch(onChange({ name, value }))
    }

    const onChangeRange = name => value => {
        if (name == "min") {
            dispatch(onChange({ name: "priceMin", value }))
        } else if (name == "max") {
            dispatch(onChange({ name: "priceMax", value }))
        }
    }

    return <div className="flex flex-col gap-2">
        <div>
            <p className="text-2xl font-medium	">
                Filter
            </p>
        </div>
        <div>
            <CheckboxGroup
                label="Select category"
                value={category}
                onChange={onChangeValue("category")}
            >
                {
                    Object.values(productCat).map(cat => {
                        return <Checkbox value={cat.value} key={cat.value}>{cat.label}</Checkbox>
                    })
                }
            </CheckboxGroup>
        </div>
        <Spacer y={2} />
        <div>
            <RangeSelector label="Price Range" min={priceMin} max={priceMax} defaultMin={0} defaultMax={50000} onChange={onChangeRange} />
        </div>
    </div>
}