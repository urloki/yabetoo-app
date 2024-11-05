import { FileUploader } from "@/components/file-uploader";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import {Product} from "@/src/shemas/product/product.schema";

function ProductMediaModule({ form }: { form: UseFormReturn<Product> }) {
  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="files"
        render={({ field }) => (
          <div className="space-y-6">
            <FormItem className="w-full">
              <FormLabel>Supports multimédia</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  maxFiles={4}
                  maxSize={4 * 1024 * 1024}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        )}
      />
    </div>
  );
}

export default ProductMediaModule;
