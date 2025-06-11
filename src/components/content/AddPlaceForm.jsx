import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Form,
} from "@heroui/react";
import { MapPinPlus } from "lucide-react";

import AutoPlaceInput from "../AutoPlaceInput";
import { AppContext } from "../../App";

export default function AddPlaceForm({ dayNumber }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [destination, setDestination] = useState("");
  const { accessToken, currentTrip, fetchData } = useContext(AppContext);

  const [destinationError, setDestinationError] = useState(false);

  const handleAddingPlace = async () => {
    if (!destination) {
      setDestinationError(true);
      return;
    }

    try {
      const response = await fetch(
        `/api/trips/${currentTrip.tripHeader.trip_id}/itinerary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            destination: currentTrip.tripHeader.destination,
            place_name: destination,
            day_number: dayNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add place");
      }

      fetchData();
      onClose();
    } catch (error) {
      console.error("Error adding place:", error);
    }
  };

  return (
    <div>
      <Button
        variant="bordered"
        className="flex items-center text-sm font-medium p-3 border border-bcolor rounded-full "
        onPress={onOpen}
      >
        <MapPinPlus className="h-5 w-5 mr-1" />
        Add Place
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
                Add a New Place
              </ModalHeader>

              <ModalBody className="h-23">
                <Form
                  className="flex flex-col gap-4"
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
                    noOfPredictions={2}
                    includeLocality={false}
                    label="Enter a place"
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
                  onPress={handleAddingPlace}
                >
                  Add Place
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

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
