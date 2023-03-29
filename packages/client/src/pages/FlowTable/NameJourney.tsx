import { MouseEvent, useState } from "react";
import { GenericButton, Input } from "components/Elements";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import ApiService from "services/api.service";
import { Workflow } from "types/Workflow";

export interface INameSegmentForm {
  name: string;
  isPrimary: boolean;
}

const NameJourney = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await ApiService.post<Workflow>({
        url: "/workflows",
        options: { name },
      });
      navigate("/flow/" + data.id);
    } catch (err) {
      let message = "Unexpected error";
      if (err instanceof AxiosError) message = err.response?.data.message;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="items-start flex justify-center pt-[18px] mb-[50px]">
        <div className="w-full">
          <h3 className="font-bold text-[25px] font-[Poppins] text-[#28282E] leading-[38px]">
            Name your Journey
          </h3>
          <Input
            isRequired
            value={name}
            placeholder={"Enter name"}
            name="name"
            id="name"
            className="w-full p-[16px] bg-white border-[1px] border-[#D1D5DB] font-[Inter] text-[16px]"
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end mt-[10px]">
            <GenericButton
              id="createJourneySubmit"
              customClasses="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={handleSubmit}
              style={{
                maxWidth: "200px",
              }}
              loading={isLoading}
            >
              Create
            </GenericButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameJourney;
