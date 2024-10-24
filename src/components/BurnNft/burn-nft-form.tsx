import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BurnNftBurnFormSchema, formSchema } from "./burn-nft-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import SliderBar from "@components/common/slider-bar";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";

const BurnNftForm = () => {
  const form = useForm<BurnNftBurnFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      burnQuantity: 0
    },
    mode: "onChange"
  });

  function onSubmit(values: BurnNftBurnFormSchema) {
    console.log("create pool form", values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full mb-6">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-y-2 w-1/2 max-w-[212px] float-left">
            <h4 className="font-medium text-lg/[18px]">Redeem</h4>
            <span className="text-sm/5 font-normal text-[#94A3B8]">
              Redeem BTC by burning your LP Pool NFT
            </span>
          </div>
          <div className="w-1/2 float-right">
            <FormField
              control={form.control}
              name="burnQuantity"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        placeholder="0"
                        value={field.value}
                        onChange={(e) => {
                          return field.onChange(parseFloat(e.target.value));
                        }}
                        type="number"
                        className={cn(
                          "p-4 bg-transparent mb-4",
                          errors.burnQuantity && "border-negative-points"
                        )}
                      />
                      <FormMessage className="text-negative-points text-sm/5 -mt-2 mb-3" />
                      <SliderBar
                        {...field}
                        value={field.value}
                        setValue={(value) => field.onChange(value)}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-4"
                        indices={[0, 25, 50, 75, 100]}
                        isPerc
                      />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full h-full max-h-fit mt-9">
          <ButtonCTA
            className="w-1/2 rounded-lg float-right capitalize font-medium text-sm/5"
            disabled={!(form.formState.isValid && form.formState.isDirty)}
          >
            Burn NFT
          </ButtonCTA>
        </div>
      </form>
    </Form>
  );
};

export default BurnNftForm;
