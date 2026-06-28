import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { cn } from "../../lib/utils";
import '../../style/timepicker.css'

interface TimeInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimeInput = ({
  label,
  value,
  onChange,
  className,
}: TimeInputProps) => {
  return (
    <div className="w-full h-fit">
      <label className="text text-base text-[#344054] block mb-3">
        {label}
      </label>

      <TimePicker
        value={value}
        onChange={(value) => onChange(value ?? "")}
        disableClock
        clearIcon={null}
        format="h:mm a"
        className={cn("w-full", className)}
       />
    </div>
  );
};