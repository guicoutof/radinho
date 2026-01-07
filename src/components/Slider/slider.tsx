import { cn } from "@/lib/utils";
import { Slider as BaseSlider } from "@/components/ui/slider";

type SliderProps = {
  value: number[];
  className?: string;
  onValueChange: (value: number[]) => void;
};

export function Slider({ className, ...props }: SliderProps) {
  return (
    <BaseSlider
      {...props}
      value={props.value}
      onValueChange={props.onValueChange}
      max={100}
      step={1}
      className={cn("w-64", className)}
    />
  );
}
