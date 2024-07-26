import Modal from "@components/common/Modal";
import SliderBar from "@components/common/SliderBar";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { useState } from "react";

const NewPoModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [isExpire, setIsExpire] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="New Pool Operator"
      description="Create a new pool or create a liquidity position on an existing pool."
      className="w-full max-w-[698px] p-6 flex flex-col gap-10"
      closable={true}
    >
      <div className="flex flex-row items-start justify-between">
        <h5>PO Address</h5>
        <div className="w-1/2">
          <Input placeholder="0" type="text" className="p-4 bg-transparent" />
        </div>
      </div>
      <div className="flex flex-row items-start justify-between">
        <h5>Expires</h5>
        <div className="w-1/2">
          <Switch checked={isExpire} onCheckedChange={(e) => setIsExpire(e)} />
        </div>
      </div>
    </Modal>
  );
};

export default NewPoModal;
