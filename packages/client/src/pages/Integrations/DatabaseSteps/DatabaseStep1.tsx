import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Input } from "components/Elements";
import React, { FC } from "react";
import { DatabaseStepProps } from "../Database";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const DatabaseStep1: FC<DatabaseStepProps> = ({
  formData,
  setFormData,
  errors,
  showErrors,
  handleShowErrors,
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
        <dt className="text-sm font-medium text-gray-500">Name</dt>
        <dd className="relative">
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              handleShowErrors("name");
            }}
            onBlur={() => handleShowErrors("name")}
            name="name"
            id="name"
            placeholder="Name your import"
            className={classNames(
              errors.name.length > 0 && showErrors.name
                ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
            )}
          />
          {errors.name.length > 0 && showErrors.name && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </dd>
        {showErrors.name &&
          errors.name.map((item) => (
            <p
              className="mt-2 text-sm text-red-600"
              id="email-error"
              key={item}
            >
              {item}
            </p>
          ))}
      </div>
      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-1">
        <dt className="text-sm font-medium text-gray-500">Description</dt>
        <dd className="relative">
          <Input
            type="text"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              handleShowErrors("description");
            }}
            onBlur={() => handleShowErrors("description")}
            name="description"
            id="description"
            placeholder="Describe your import"
            className={classNames(
              errors.description.length > 0 && showErrors.description
                ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
            )}
          />
          {errors.description.length > 0 && showErrors.description && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </dd>
        {showErrors.description &&
          errors.description.map((item) => (
            <p
              className="mt-2 text-sm text-red-600"
              id="email-error"
              key={item}
            >
              {item}
            </p>
          ))}
      </div>
    </div>
  );
};

export default DatabaseStep1;
