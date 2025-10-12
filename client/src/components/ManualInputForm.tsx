import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { manualInputSchema, type ManualInput } from "@shared/schema";

interface ManualInputFormProps {
  onSubmit: (data: ManualInput) => void;
  isSubmitting: boolean;
}

export function ManualInputForm({ onSubmit, isSubmitting }: ManualInputFormProps) {
  const form = useForm<ManualInput>({
    resolver: zodResolver(manualInputSchema),
    defaultValues: {
      companyName: "",
      sector: "",
      geography: "",
      aiUseCase: "",
      productDescription: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., HealthAI Inc."
                  {...field}
                  data-testid="input-company-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-sector">
                    <SelectValue placeholder="Select a sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Healthcare AI">Healthcare AI</SelectItem>
                  <SelectItem value="Financial Services">Financial Services</SelectItem>
                  <SelectItem value="Education Technology">Education Technology</SelectItem>
                  <SelectItem value="Autonomous Systems">Autonomous Systems</SelectItem>
                  <SelectItem value="HR Technology">HR Technology</SelectItem>
                  <SelectItem value="Legal Technology">Legal Technology</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="geography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Market</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-geography">
                    <SelectValue placeholder="Select primary market" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EU">European Union</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="US & EU">US & EU</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiUseCase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Use Case</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-usecase">
                    <SelectValue placeholder="Select AI use case" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Medical Diagnosis">Medical Diagnosis</SelectItem>
                  <SelectItem value="Biometric Identification">Biometric Identification</SelectItem>
                  <SelectItem value="Credit Scoring">Credit Scoring</SelectItem>
                  <SelectItem value="Recruitment Screening">Recruitment Screening</SelectItem>
                  <SelectItem value="Predictive Policing">Predictive Policing</SelectItem>
                  <SelectItem value="Content Moderation">Content Moderation</SelectItem>
                  <SelectItem value="Customer Service Chatbot">Customer Service Chatbot</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the AI product or service..."
                  className="resize-none"
                  rows={4}
                  {...field}
                  data-testid="textarea-product-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
          data-testid="button-submit-manual"
        >
          {isSubmitting ? "Analyzing..." : "Analyze Compliance"}
        </Button>
      </form>
    </Form>
  );
}
