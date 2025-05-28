import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useMemo, useState } from "react";

const TimeSetter = ({ time }) => {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const minuteStr = m < 10 ? `0${m}` : `${m}`;
        const ampm = h < 12 ? "AM" : "PM";
        slots.push(`${hour12}:${minuteStr} ${ampm}`);
      }
    }
    return slots;
  }, []);

  const [curentTime, setCurrentTime] = useState(time);

  return (
    <Dropdown className="min-w-25">
      <DropdownTrigger className="mt-0.5">
        <span className="text-[14px] text-subcolor hover:text-black font-medium">
          {curentTime}
        </span>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Select a time slot"
        onAction={(key) => setCurrentTime(key)}
        classNames={{
          list: "max-h-[168px] overflow-y-auto scrollbar-hide",
        }}
      >
        {timeSlots.map((time) => (
          <DropdownItem key={time} textValue={time}>
            {time}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default TimeSetter;
