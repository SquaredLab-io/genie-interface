import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Close } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@lib/utils";
import { FormLabel } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";

interface Props {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string | React.ReactElement;
  description?: string;
  className?: string;
  footer?: React.ReactNode;
  closable?: boolean;
}

/**
 *
 * @param open* Current open state of the modal
 * @param onOpenChange* Callback to change the open state
 * @param trigger Element that triggers the modal
 * @param title Title text for the modal
 * @param description Description text for the modal
 * @param children* Content to be displayed inside the modal
 * @param className Styling for Modal content
 * @param footer Footer content for the modal
 * @param closable Close button state
 */
const Modal: React.FC<Props> = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
  footer,
  closable = false
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)"); // tailwind `md`

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          {closable && (
            <Close className="absolute right-5 top-4 rounded-lg disabled:pointer-events-none ring-1 ring-[#272A2F] ring-offset-[#272A2F] focus:outline-none p-[13.5px] bg-transparent">
              <X className="w-3 h-3 text-[#555555]" aria-label="Close Modal" />
              <span className="sr-only">Close</span>
            </Close>
          )}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        {footer && <DrawerFooter className="pt-2">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
};

export default Modal;
