import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Form,
  Input,
  DatePicker,
  Textarea,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

import { PlusIcon } from "@heroicons/react/24/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import AutoPlaceInput from "./AutoPlaceInput";

const NumberInput = ({ setNumber, number, max, unit }) => {
  const increment = () => setNumber((c) => Math.min(max, c + 1));
  const decrement = () => setNumber((c) => Math.max(1, c - 1));

  return (
    <div className="min-w-39 flex justify-between items-center gap-2 rounded-xl p-1 py-1 w-fit text-sm font-medium text-[#81818a] bg-gray-100 hover:bg-gray-200">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={decrement}
        className="text-xl text-[#a1a1aa]"
        radius="full"
      >
        −
      </Button>
      <span className="min-w-[24px] text-center">
        {number}{" "}
        {unit === "people"
          ? number === 1
            ? "person"
            : "people"
          : unit === "days"
          ? number === 1
            ? "day"
            : "days"
          : unit}
      </span>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={increment}
        className="text-xl text-[#a1a1aa]"
        radius="full"
      >
        +
      </Button>
    </div>
  );
};

const BudgetInput = ({ budget, setBudget }) => {
  const budgetOptions = {
    Low: "500 - 1000 USD",
    Medium: "1000 - 2500 USD",
    High: "2500+ USD",
  };

  return (
    <div className="w-full grid grid-cols-3 gap-4">
      {Object.keys(budgetOptions).map((option, index) => (
        <div
          key={option}
          className={`w-full flex flex-col gap-1 border-2 rounded-lg p-2 cursor-pointer ${
            budget === option
              ? "bg-gray-200 border-gray-200"
              : "border-gray-200 hover:bg-gray-200"
          }`}
          onClick={() => setBudget(option)}
        >
          <div className="flex items-center justify-center">
            {Array.from({ length: index + 1 }).map((_, i) => (
              <CurrencyDollarIcon
                key={i}
                className="w-[28px] aspect-square text-[#282f32]"
              />
            ))}
          </div>
          <span className="block text-xs font-semibold text-[#282f32]">
            {option}
          </span>
          <span className="text-xs font-medium text-[#81818a]">
            {budgetOptions[option]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function TripForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(today(getLocalTimeZone()));
  const [noOfDays, setNoOfDays] = useState(1);
  const [noOfTravelers, setNoOfTravelers] = useState(1);
  const [budget, setBudget] = useState("Low");
  const [preferences, setPreferences] = useState("");

  const [destinationError, setDestinationError] = useState(false);

  useEffect(() => {
    onOpen();
  }, []);

  const handleTripCreation = () => {
    if (!destination.trim()) {
      setDestinationError(true);
      return;
    }
    setDestinationError(false);

    const tripParams = {
      destination,
      startDate: startDate.toString(),
      noOfDays,
      noOfTravelers,
      budget,
      preferences,
    };

    console.log("Trip created:", tripParams);
    onClose();
  };

  return (
    <div>
      <Button isIconOnly variant="light" onPress={onOpen} className="w-full">
        <PlusIcon className="w-5 h-5" />
      </Button>

      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        isKeyboardDismissDisabled={true}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col gap-1">
                Create a New Trip
              </ModalHeader>

              <ModalBody>
                <Form
                  className="flex flex-col gap-3"
                  validationBehavior="aria"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTripCreation();
                  }}
                >
                  <AutoPlaceInput
                    destination={destination}
                    setDestination={setDestination}
                    destinationError={destinationError}
                    setDestinationError={setDestinationError}
                  />

                  <DatePicker
                    label="When are you planning to travel?"
                    labelPlacement="outside"
                    minValue={today(getLocalTimeZone())}
                    value={startDate}
                    onChange={setStartDate}
                  />

                  <span className="text-sm flex gap-2 w-full justify-between items-center">
                    How many days will you travel?
                    <NumberInput
                      setNumber={setNoOfDays}
                      number={noOfDays}
                      max={7}
                      unit="days"
                    />
                  </span>

                  <span className="text-sm flex gap-2 w-full justify-between items-center">
                    How many people are traveling?
                    <NumberInput
                      setNumber={setNoOfTravelers}
                      number={noOfTravelers}
                      max={10}
                      unit="people"
                    />
                  </span>

                  <span className="text-sm w-full flex flex-col gap-2">
                    What is Your Budget?
                    <BudgetInput budget={budget} setBudget={setBudget} />
                  </span>

                  <Textarea
                    className="w-full"
                    label="What kind of experience do you want? Any preferences?"
                    placeholder="I'd love to visit a local brewery or see a waterfall ...."
                    labelPlacement="outside"
                    isClearable
                    value={preferences}
                    onValueChange={setPreferences}
                  />
                </Form>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="light"
                  className="bg-black px-3 h-auto text-[12px] font-semibold text-white hover:!bg-[#2e2e2e] ml-4"
                  onPress={handleTripCreation}
                >
                  Create Trip
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
