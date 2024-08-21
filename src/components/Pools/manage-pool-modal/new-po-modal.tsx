import { useState } from "react";
import Modal from "@components/common/Modal";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import ButtonCTA from "@components/common/button-cta";
import SelectDate from "./select-date";
import notification from "@components/common/notification";
import { isValidAddress } from "@lib/utils/checkVadility";

const NewPoModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [isExpire, setIsExpire] = useState(false);

  const [poAddr, setPoAddr] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date());
  const isValid = isValidAddress(poAddr);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="New Pool Operator"
      description="Create a new pool or create a liquidity position on an existing pool."
      className="w-full max-w-[698px] p-6 flex flex-col gap-10 sm:rounded-lg"
      closable={true}
    >
      <div className="flex flex-row items-start justify-between">
        <h5>PO Address</h5>
        <div className="w-1/2">
          <Input
            placeholder="0"
            type="text"
            value={poAddr}
            onChange={(e) => setPoAddr(e.target.value)}
            className="p-4 bg-transparent"
          />
        </div>
      </div>
      <div className="flex flex-row items-start justify-between">
        <h5>Expires</h5>
        <div className="w-1/2">
          <Switch checked={isExpire} onCheckedChange={(e) => setIsExpire(e)} />
        </div>
      </div>
      {isExpire && (
        <div className="flex flex-row items-start justify-between">
          <h5>Valid Till</h5>
          <SelectDate date={expiryDate} setDate={setExpiryDate} />
        </div>
      )}
      <div>
        <ButtonCTA
          className="w-1/2 rounded-lg float-right"
          onClick={() => {
            console.log("create new po!");
            // notification.info({
            //   title: "Creating new Pool operator.",
            //   description: "Wait for few seconds while we're processing"
            // });
          }}
          disabled={!isValid || !expiryDate}
        >
          Create
        </ButtonCTA>
      </div>
    </Modal>
  );
};

export default NewPoModal;
