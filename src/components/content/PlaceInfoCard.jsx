import {
  Card,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  CardBody,
  Image,
  Chip,
} from "@heroui/react";
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAsiaAustraliaIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

import { HourglassIcon } from "lucide-react";
import { useState } from "react";

const WeekdayChip = ({ day, openTime, isOpen }) => {
  return (
    <Popover placement="top" showArrow={true}>
      <PopoverTrigger>
        <div
          className={`relative inline-flex items-center justify-center p-1 font-bold text-[10px] bg-gray-200 rounded-full text-center w-5.5 h-5.5 overflow-hidden ${
            isOpen ? "text-gray-400" : ""
          }`}
        >
          {day}
          {isOpen && (
            <div className="absolute w-[95%] h-0.5 bg-gray-400 rotate-45"></div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-tiny">{openTime}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const PlaceInfoCard = ({ name, description, imageUrl, location }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="absolute bottom-4 left-4 p-2 w-140 h-auto">
      <CardBody className="overflow-visible">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Old Main</h1>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setIsOpen(!isOpen)}
                className="rounded-full p-1.5"
              >
                {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
              </Button>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <StarIcon className="h-4 w-4 text-[#fbbc04]" />
              5.0
              <div className="w-0.5 h-0.5 bg-subcolor rounded-full shrink-0" />
              47 Reviews
              <div className="w-0.5 h-0.5 bg-subcolor rounded-full shrink-0" />
              State College, Pennsylvania
            </div>
          </div>

          {isOpen && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Image
                  className="h-full w-full object-cover rounded-l-xl"
                  src="/lion inn.jpg"
                  radius="none"
                  isBlurred
                />
                <div className="grid grid-cols-2 gap-2">
                  <Image
                    className="h-full w-full object-cover"
                    src="/old-main.jpg"
                    radius="none"
                    isBlurred
                  />
                  <Image
                    className="h-full w-full object-fill rounded-tr-xl"
                    src="/lion inn.jpg"
                    radius="none"
                    isBlurred
                  />
                  <Image
                    className="h-full w-full object-cover"
                    src="/old-main.jpg"
                    radius="none"
                    isBlurred
                  />
                  <Image
                    className="h-full w-full object-cover rounded-br-xl"
                    src="/old-main.jpg"
                    radius="none"
                    isBlurred
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Chip variant="shadow" className="h-6 text-xs">
                  Bar
                </Chip>
                <Chip variant="shadow" className="h-6 text-xs">
                  Sights & Landmarks
                </Chip>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="h-4.5 aspect-square" />
                <span>101 Old Main, University Park, PA 16802</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <PhoneIcon className="ml-0.5 h-4 aspect-square" />
                <span>+1 (814) 865-4700</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GlobeAsiaAustraliaIcon className="h-4.5 aspect-square" />
                <a
                  href="https://www.psu.edu"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.psu.edu
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HourglassIcon className="h-4.5 w-4.5" />
                {[...Array(7)].map((_, index) => (
                  <WeekdayChip
                    key={index}
                    day={["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][index]}
                    isOpen={index < 5}
                    openTime={index >= 5 ? "9:00 AM - 5:00 PM" : "Closed"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default PlaceInfoCard;
