// src/components/DoubleField.jsx
import React from "react";
import TextField from "./TextField";

export default function DoubleField({
  legend,
  fields = [],
  gap = "sm:gap-4",
}) {
  return (
    <fieldset className="mb-4" aria-label={`${legend} fields`}>
      {/* Legend / Group Title */}
      {legend && (
        <legend className="text-blue-900 font-semibold mb-1 select-none">
          {legend}
        </legend>
      )}

      {/* Two side-by-side fields */}
      <div className={`flex flex-col sm:flex-row ${gap}`}>
        {fields.map((field, index) => (
          <div
            key={index}
            className={`flex flex-col w-full sm:w-1/2 ${
              index === 0 ? "mb-4 sm:mb-0" : ""
            }`}
          >
            <TextField {...field} />
          </div>
        ))}
      </div>
    </fieldset>
  );
}
