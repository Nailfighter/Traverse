import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  useDisclosure,
  DropdownItem,
  Button,
  Form,
} from "@heroui/react";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { AppContext } from "../App.jsx";

const Header = () => {
  const navigate = useNavigate();
  const { accessToken, fetchData, currentTrip, setCurrentTrip } =
    useContext(AppContext);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const {
    isOpen: isRenameOpen,
    onOpen: onRenameOpen,
    onClose: onRenameClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleRenameTrip = async () => {
    const response = await fetch(
      `/api/trips/${currentTrip.tripHeader.trip_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title: text }),
      }
    );

    if (response.ok) {
      setTitle(text);
      setText("");
    }
  };

  const handleDeleteTrip = async () => {
    const response = await fetch(
      `/api/trips/${currentTrip.tripHeader.trip_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      await fetchData();
    } else {
      console.error("Failed to delete trip");
    }
  };

  async function handleLogout({ navigate }) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully");
    }
    navigate("/login");
  }

  useEffect(() => {
    if (currentTrip.tripHeader) {
      setTitle(currentTrip.tripHeader.title);
    }
  }, [currentTrip]);

  return (
    <div className="flex flex-grow-0 justify-between h-14 p-[6px] w-auto border-b-1 border-bcolor text-[12px] font-semibold">
      <Dropdown>
        <DropdownTrigger>
          <DropdownTrigger>
            <Button
              variant="light"
              size="sm"
              className="rounded-full p-1.5 px-5 w-auto h-auto text-medium font-semibold shrink-0 flex items-center gap-1"
            >
              <h1>{title}</h1>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownTrigger>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="rename"
            onPress={() => {
              setText(title);
              onRenameOpen();
            }}
          >
            Rename Trip
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            onPress={onDeleteOpen}
          >
            Delete Trip
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <button
        onClick={() => handleLogout({ navigate })}
        className="p-1 hover:cursor-pointer button-animation"
      >
        <img
          src="/My PP.png"
          alt="Profile"
          className="aspect-square h-full rounded-full"
        />
      </button>
      <Modal
        backdrop={"blur"}
        isOpen={isRenameOpen}
        onClose={onRenameClose}
        isKeyboardDismissDisabled={true}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col gap-1">
                Rename Trip
              </ModalHeader>

              <ModalBody>
                <Form
                  className="flex flex-col"
                  validationBehavior="aria"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRenameTrip();
                    onClose();
                  }}
                >
                  <Input
                    placeholder="Enter new trip title"
                    className="w-full"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
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
                  onPress={() => {
                    handleRenameTrip();
                    onClose();
                  }}
                >
                  Rename
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
      <Modal
        backdrop={"blur"}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isKeyboardDismissDisabled={true}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="text-danger">
                Confirm Delete Trip
              </ModalHeader>

              <ModalBody>
                Are you sure you want to delete this trip? This action cannot be
                undone.
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="danger"
                  className="font-semibold hover:text-black"
                  onPress={() => {
                    handleDeleteTrip();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Header;
