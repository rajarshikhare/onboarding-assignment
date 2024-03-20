import { Input } from "@nextui-org/react"
import { Slider } from "@nextui-org/react";

export const RangeSelector = props => {
    const { label, defaultMin, defaultMax, max, min, onChange, startLimit = 0, endLimit = 20000 } = props

    const onChangeValue = name => event => {
        onChange(name)(event.target.value)
    }
    const onChangeSlider = value => {
        onChange("min")(value[0])
        onChange("max")(value[1])
    }

    return <div className="flex flex-col gap-4">
        <div>
            <p>
                {label}
            </p>
        </div>
        <div className="flex flex-row gap-4">
            <div>
                <Input label="Min" size="sm" defaultValue={defaultMin} value={min} onChange={onChangeValue("min")} />
            </div>
            <div>
                <Input label="Max" size="sm" defaultValue={defaultMax} value={max} onChange={onChangeValue("max")} />
            </div>
        </div>
        <div>
            <Slider
                step={10}
                maxValue={endLimit}
                minValue={startLimit}
                value={[min, max]}
                onChange={onChangeSlider}
                className="max-w-md"
            />
        </div>

    </div>
}