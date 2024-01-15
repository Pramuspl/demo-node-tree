import React, { useState } from "react";
import { Banner } from "./helpers/Banner.js";
import NestedList from "./NestedList.js";
import SortedArray from "./SortedArray.js";
import { InfoIcon, ListIcon, CPUIcon } from "./helpers/Icons.js";
import "./styles.css";
import "balloon-css";

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="App">
      <Banner
        title="List search"
        message={
          <>
            <p>
              This is an implementation of a nested list filtering. It uses two
              different approaches.
            </p>
            <p>Use the search box to filter the lists.</p>
            <span className="inline-flex items-center">
              Hover over the respective <InfoIcon className="mx-0.5" /> icon to
              learn more about the implementation and{" "}
              <CPUIcon className="mx-0.5" /> for the performance details
            </span>
          </>
        }
        Icon={ListIcon}
      />
      <div className="p-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="search"
          >
            Search term
          </label>
          <input
            className="shadow appearance-none border rounded p-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="search"
            type="text"
            value={search}
            onInput={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 space-x-2">
          <SortedArray search={search} />
          <NestedList search={search} />
        </div>
      </div>
    </div>
  );
}
