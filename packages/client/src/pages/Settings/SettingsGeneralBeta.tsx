import { ChangeEvent, useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import SaveSettings from "components/SaveSettings";
import ApiService from "services/api.service";
import { GenericButton, Input } from "components/Elements";
import { toast } from "react-toastify";
import Timer from "components/Timer";
import { AxiosError } from "axios";
import Modal from "components/Elements/Modal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsGeneralBeta() {
  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    verifyNewPassword: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    verifyNewPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({
    firstName: [],
    lastName: [],
    email: [],
    currentPassword: [],
    newPassword: [],
    verifyNewPassword: [],
  });

  const [showErrors, setShowErrors] = useState(false);

  const [verified, setVerified] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(300);

  const [isLoading, setIsLoading] = useState(false);

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState("");

  useEffect(() => {
    const newErrors: { [key: string]: string[] } = {
      firstName: [],
      lastName: [],
      email: [],
      currentPassword: [],
      newPassword: [],
      verifyNewPassword: [],
    };

    if (
      formData.firstName !== initialData.firstName &&
      formData.firstName.length === 0
    )
      newErrors.firstName.push("First name should be defined");

    if (
      (formData.lastName !== initialData.lastName &&
        formData.lastName.length) === 0
    )
      newErrors.lastName.push("Last name should be defined");

    if (formData.email !== initialData.email) {
      if (formData.email.length === 0)
        newErrors.email.push("Email should be defined");

      if (
        !formData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      )
        newErrors.email.push("Email should be valid");
    }

    if (formData.newPassword !== initialData.newPassword) {
      if (formData.newPassword !== formData.verifyNewPassword)
        newErrors.verifyNewPassword.push("Passwords should match");

      if (formData.newPassword && !formData.currentPassword)
        newErrors.currentPassword.push("Passwords should be provided");

      if (formData.newPassword.length < 8)
        newErrors.newPassword.push(
          "Passwords should have at least 8 characters"
        );
    }

    setErrors(newErrors);
  }, [formData]);

  const isError = Object.values(errors).some((arr) => arr.length > 0);

  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setShowErrors(true);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data } = await ApiService.get({ url: "/accounts" });
      const {
        firstName,
        lastName,
        email,
        verified: verifiedFromRequest,
        secondtillunblockresend,
      } = data;
      setFormData({ ...formData, firstName, lastName, email });
      setInitialData({ ...formData, firstName, lastName, email });
      setVerified(verifiedFromRequest);
      setTimerSeconds(Math.ceil(+secondtillunblockresend || 0));
    } catch (e) {
      toast.error("Error while loading data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await ApiService.patch({
        url: "/accounts",
        options: {
          ...formData,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
          verifyNewPassword: formData.verifyNewPassword || undefined,
        },
      });
      if (formData.email !== initialData.email) {
        toast.info(
          "You need to verify your email. We've sent you a verification email",
          {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
      await loadData();
      toast.success("Data saved sucessfully");
    } catch (e) {
      let message = "Unexpected error!";
      if (e instanceof AxiosError) message = e.response?.data.message;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    await ApiService.patch({ url: "/auth/resend-email", options: {} });
    await loadData();
    toast.info("We have sent you new email", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await ApiService.delete({
        url: "/accounts",
        options: { data: { password: passwordToDelete } },
      });
      window.location.reload();
    } catch (e) {
      let message = "Unexpected error";
      if (e instanceof AxiosError)
        message = e.response?.data.message || message;

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Description list with inline editing */}
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Profile and Security
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            Keep your information up to date.
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="relative">
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={handleFormDataChange}
                  name="firstName"
                  id="firstName"
                  placeholder="Mahamad"
                  className={classNames(
                    errors.firstName.length > 0 && showErrors
                      ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                      : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
                  )}
                />
                {errors.firstName.length > 0 && showErrors && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </dd>
              {showErrors &&
                errors.firstName.map((item) => (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="email-error"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="relative">
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={handleFormDataChange}
                  name="lastName"
                  id="lastName"
                  placeholder="Charawi"
                  className={classNames(
                    errors.lastName.length > 0 && showErrors
                      ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                      : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
                  )}
                />
                {showErrors && errors.lastName.length > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </dd>
              {showErrors &&
                errors.lastName.map((item) => (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="email-error"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                <div>Email</div>
                {verified ? (
                  <div className="text-green-500">Your email is verified</div>
                ) : (
                  <div className="text-red-500">
                    Waiting for verification:{" "}
                    {!timerSeconds ? (
                      <span
                        className="text-black cursor-pointer"
                        onClick={handleResend}
                      >
                        Resend
                      </span>
                    ) : (
                      <Timer
                        seconds={timerSeconds}
                        setSeconds={setTimerSeconds}
                        onFinish={() => setTimerSeconds(0)}
                      />
                    )}
                  </div>
                )}
              </dt>
              <dd>
                <div className="relative">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleFormDataChange}
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    disabled={!!(timerSeconds && !verified)}
                    className={classNames(
                      errors.email.length > 0 && showErrors
                        ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                        : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 ",
                      " disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                    )}
                  />
                  {showErrors && errors.email.length > 0 && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {showErrors &&
                  errors.email.map((item) => (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="email-error"
                      key={item}
                    >
                      {item}
                    </p>
                  ))}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                Current Password
              </dt>
              <dd>
                <div className="relative rounded-md ">
                  <Input
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleFormDataChange}
                    name="currentPassword"
                    id="currentPassword"
                    className={classNames(
                      errors.currentPassword.length > 0
                        ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                        : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
                    )}
                    aria-invalid="true"
                    aria-describedby="password-error"
                  />
                  {errors.currentPassword.length > 0 && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {errors.currentPassword.map((item) => (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="email-error"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                New Password
              </dt>
              <dd>
                <div className="relative rounded-md ">
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={handleFormDataChange}
                    name="newPassword"
                    id="newPassword"
                    className={classNames(
                      errors.newPassword.length > 0
                        ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                        : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
                    )}
                    aria-invalid="true"
                    aria-describedby="password-error"
                  />
                  {errors.newPassword.length > 0 && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {errors.newPassword.map((item) => (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="email-error"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">
                Verify New Password
              </dt>
              <dd>
                <div className="relative rounded-md ">
                  <Input
                    type="password"
                    value={formData.verifyNewPassword}
                    onChange={handleFormDataChange}
                    name="verifyNewPassword"
                    id="verifyNewPassword"
                    className={classNames(
                      errors.verifyNewPassword.length > 0
                        ? "rounded-md sm:text-sm focus:!border-red-500 !border-red-300 shadow-sm focus:!ring-red-500 "
                        : "rounded-md sm:text-sm focus:border-amber-500 border-gray-300 shadow-sm focus:ring-amber-500 "
                    )}
                    aria-invalid="true"
                    aria-describedby="password-error"
                  />
                  {errors.verifyNewPassword.length > 0 && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {errors.verifyNewPassword.map((item) => (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="email-error"
                    key={item}
                  >
                    {item}
                  </p>
                ))}
              </dd>
            </div>
            <SaveSettings
              disabled={isError || isLoading}
              loading={isLoading}
              onClick={handleSubmit}
              additionalButtons={
                <>
                  <GenericButton
                    customClasses="bg-red-600 hover:bg-red-500 focus:ring-red-500"
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Delete
                  </GenericButton>
                </>
              }
            />
          </dl>
        </div>
      </div>
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      >
        <div className="flex flex-col gap-[10px]">
          <div>To delete your account please enter password:</div>
          <Input
            name="password"
            type="password"
            value={passwordToDelete}
            onChange={(e) => setPasswordToDelete(e.target.value)}
          />
          <div>
            <GenericButton
              customClasses="bg-red-600 hover:bg-red-500 focus:ring-red-500"
              onClick={handleDeleteAccount}
              disabled={!passwordToDelete}
            >
              Delete
            </GenericButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
