import React, { useEffect, useRef, useState } from "react";
import { Input, Listbox, ListboxItem } from "@heroui/react";

const AutoPlaceInput = ({
  destination,
  setDestination,
  destinationError,
  setDestinationError,
}) => {
  const [predictions, setPredictions] = useState([]);
  const [token, setToken] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const requestIdRef = useRef(0);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);

  useEffect(() => {
    const loadGoogleLibs = async () => {
      const { AutocompleteSessionToken } = await google.maps.importLibrary(
        "places"
      );
      setToken(new AutocompleteSessionToken());
    };
    loadGoogleLibs();
  }, []);

  const handleInputChange = async (value) => {
    setDestination(value);
    setActiveIndex(-1);

    if (!value.trim()) {
      setPredictions([]);
      return;
    }

    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;

    const { AutocompleteSuggestion } = await google.maps.importLibrary(
      "places"
    );

    const request = {
      input: value,
      language: "en-US",
      sessionToken: token,
      includedPrimaryTypes: ["locality"],
    };

    const { suggestions } =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    if (requestIdRef.current === currentRequestId) {
      setPredictions(suggestions);
    }
  };

  const handlePredictionClick = async (placePrediction) => {
    const place = placePrediction.toPlace();
    await place.fetchFields({
      fields: ["formattedAddress"],
    });
    setDestination(`${place.formattedAddress}`);
    setPredictions([]);
    setDestinationError(false);
    setActiveIndex(-1);

    const { AutocompleteSessionToken } = await google.maps.importLibrary(
      "places"
    );
    setToken(new AutocompleteSessionToken());

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (predictions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % predictions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? predictions.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handlePredictionClick(predictions[activeIndex].placePrediction);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setPredictions([]);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[activeIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full">
      <Input
        name="destination"
        label="Where are you going?"
        labelPlacement="outside"
        placeholder="Eg. New York, Paris, Tokyo"
        isClearable
        isRequired
        showRequiredIcon={false}
        value={destination}
        onValueChange={handleInputChange}
        isInvalid={destinationError}
        errorMessage={destinationError ? "Destination is required" : ""}
        onFocus={() => setDestinationError(false)}
        ref={inputRef}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />

      {predictions.length > 0 && (
        <Listbox
          aria-label="Autocomplete suggestions"
          className="absolute z-10 w-full max-h-60 mt-overflow-y-auto bg-white border border-gray-300 rounded-xl shadow-lg"
          items={predictions}
          ref={listboxRef}
          tabIndex={-1}
        >
          {predictions.map((suggestion, index) => (
            <ListboxItem
              key={suggestion.key}
              onAction={() => handlePredictionClick(suggestion.placePrediction)}
              className={
                index === activeIndex ? "bg-[#d4d4d8]" : "cursor-pointer"
              }
            >
              {suggestion.placePrediction.text
                .toString()
                .split(":")[1]
                ?.trim() || suggestion.placePrediction.text.toString()}
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </div>
  );
};

export default AutoPlaceInput;
