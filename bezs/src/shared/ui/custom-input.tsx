/* eslint-disable @typescript-eslint/no-explicit-any */

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface InputProps {
  type: "input" | "select" | "checkbox" | "switch" | "radio" | "textarea";
  control: Control<any>;
  name: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "date" | "number";
  selectList?: { label: any; value: string }[];
  defaultValue?: any;
  formItemClassName?: string;
  className?: string;
  dateMin?: string;
  disable?: boolean;
}

const RenderInput = ({ field, props }: { field: any; props: InputProps }) => {
  switch (props.type) {
    case "input":
      return (
        <FormControl>
          <Input
            type={props.inputType}
            placeholder={props.placeholder}
            className={props.className}
            min={props.dateMin}
            disabled={props.disable}
            {...field}
          />
        </FormControl>
      );

    case "select":
      return (
        <Select
          onValueChange={field.onChange}
          value={field?.value}
          defaultValue={props?.defaultValue}
        >
          <FormControl>
            <SelectTrigger className={props.className} disabled={props.disable}>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="max-h-[220px]">
            {props.selectList?.map((i, id) => (
              <SelectItem key={id} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <div className="items-top flex space-x-2">
          <Checkbox
            id={props.name}
            onCheckedChange={(e) => field.onChange(e === true || null)}
            className={props.className}
            disabled={props.disable}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={props.name}
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {props.label}
            </label>
            <p className="text-sm text-muted-foreground">{props.placeholder}</p>
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="w-full">
          <FormLabel>{props.label}</FormLabel>
          <RadioGroup
            defaultValue={props.defaultValue}
            onChange={field.onChange}
            className="flex gap-4"
            disabled={props.disable}
          >
            {props?.selectList?.map((i, id) => (
              <div className="flex items-center w-full" key={id}>
                <RadioGroupItem
                  value={i.value}
                  id={i.value}
                  className="peer sr-only"
                  disabled={props.disable}
                />
                <Label
                  htmlFor={i.value}
                  className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-600"
                >
                  {i.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "textarea":
      return (
        <FormControl>
          <Textarea
            type={props.inputType}
            placeholder={props.placeholder}
            className={props.className}
            disabled={props.disable}
            {...field}
          ></Textarea>
        </FormControl>
      );
  }
};
export const CustomInput = (props: InputProps) => {
  const { name, label, control, type } = props;

  return (
    // <div className="w-full pt-6">
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full ${props.formItemClassName}`}>
          {type !== "radio" && type !== "checkbox" && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
    // </div>
  );
};

type Day = {
  day: string;
  start_time?: string;
  close_time?: string;
};
interface SwitchProps {
  data: { label: string; value: string }[];
  setWorkSchedule: React.Dispatch<React.SetStateAction<Day[]>>;
}

export const SwitchInput = ({ data, setWorkSchedule }: SwitchProps) => {
  const handleChange = (day: string, field: any, value: string) => {
    setWorkSchedule((prevDays) => {
      const dayExist = prevDays.find((d) => d.day === day);

      if (dayExist) {
        return prevDays.map((d) =>
          d.day === day ? { ...d, [field]: value } : d
        );
      } else {
        if (field === true) {
          return [
            ...prevDays,
            { day, start_time: "09:00", close_time: "17:00" },
          ];
        } else {
          return [...prevDays, { day, [field]: value }];
        }
      }
    });
  };

  return (
    <div className="">
      {data?.map((el, id) => (
        <div
          key={id}
          className="w-full  flex items-center space-y-3 border-t border-t-gray-200  py-3"
        >
          <Switch
            id={el.value}
            className="data-[state=checked]:bg-blue-600 peer"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onCheckedChange={(e) => handleChange(el.value, true, "09:00")}
          />
          <Label htmlFor={el.value} className="w-20 capitalize">
            {el.value}
          </Label>

          <Label className="text-gray-400 font-normal italic peer-data-[state=checked]:hidden pl-10">
            Not working on this day
          </Label>

          <div className="hidden peer-data-[state=checked]:flex items-center gap-2 pl-6:">
            <Input
              name={`${el.label}.start_time`}
              type="time"
              defaultValue="09:00"
              onChange={(e) =>
                handleChange(el.value, "start_time", e.target.value)
              }
            />
            <Input
              name={`${el.label}.close_time`}
              type="time"
              defaultValue="17:00"
              onChange={(e) =>
                handleChange(el.value, "close_time", e.target.value)
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};
