"use client";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- 1. Update Schema ---
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Co-Owners must be at least 2 characters." }),
  tags: z
    .string()
    .min(2, { message: "Tags must be at least 2 characters." })
    .refine((value) => value.split(",").every((tag) => tag.trim().length > 0), {
      message: "Each tag must be non-empty and separated by commas.",
    }),
  // Add coverImage field - assuming it will store a URL or data URL string
  coverImage: z.string().min(1, { message: "Cover image is required." }), // Or use .optional() if it's not required
  content: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("paragraph"),
        paragraphTitle: z.string().min(1, { message: "Paragraph title is required." }),
        paragraphText: z.string().min(1, { message: "Paragraph text is required." }),
      }),
      z.object({
        type: z.literal("image"),
        // Consider if this should store the actual File object initially,
        // then upload and store the URL before submitting to the API.
        // For simplicity now, keeping as string (assuming data URL or final URL).
        imageFile: z.string().min(1, { message: "Image file URL is required." }),
      }),
    ])
  ),
});

// --- Define the type for the draft state ---
type DraftData = z.infer<typeof formSchema> & { id?: string }; // Add optional id

const CreateArticle = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- 5. Update savedDraft state type and initial value ---
  const [savedDraft, setSavedDraft] = useState<DraftData>({
    title: "",
    author: "",
    tags: "",
    coverImage: "", // Add coverImage here
    content: [],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // --- 2. Update Default Values ---
    defaultValues: {
      title: "",
      author: "",
      tags: "",
      coverImage: "", // Add coverImage here
      content: [],
    },
  });

  const { control, handleSubmit, reset, setValue, watch } = form; // Add setValue and watch
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "content",
  });

  // Watch the coverImage field to display the preview
  const coverImageValue = watch("coverImage");

  useEffect(() => {
    const draft = localStorage.getItem("create");

    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Ensure the parsed draft conforms to the expected structure
        const validatedDraft: DraftData = {
          title: parsedDraft.title || "",
          author: parsedDraft.author || "",
          tags: parsedDraft.tags || "",
          coverImage: parsedDraft.coverImage || "", // Load coverImage
          content: Array.isArray(parsedDraft.content) ? parsedDraft.content : [],
          id: parsedDraft.id, // Load id if present
        };
        reset(validatedDraft);
        setSavedDraft(validatedDraft);
      } catch (error) {
        console.error("Failed to parse draft from local storage:", error);
        localStorage.removeItem("create"); // Clear invalid draft
      }
    }
    setLoading(false);
  }, [reset]);

  // --- 5. Update Local Storage Logic ---
  const updateLocalStorage = (data: DraftData) => {
    localStorage.setItem("create", JSON.stringify(data));
  };

  const onPreview = (values: z.infer<typeof formSchema>) => {
    // Merge current form values with existing draft data (like ID)
    const updatedDraft: DraftData = { ...savedDraft, ...values };
    setSavedDraft(updatedDraft);
    updateLocalStorage(updatedDraft);
    router.push("/preview?type=create");
  };

  const onSaveAsDrafts = async (values: z.infer<typeof formSchema>) => {
    // Merge current form values with existing draft data (like ID)
    const updatedDraft: DraftData = { ...savedDraft, ...values };
    console.log("Saving draft:", updatedDraft);

    setSubmitting(true);
    try {
      const url = updatedDraft.id
        ? `/api/article/${updatedDraft.id}`
        : "/api/article";
      const method = updatedDraft.id ? "patch" : "post";

      // --- 6. Ensure coverImage is included in the payload ---
      const payload = { ...updatedDraft, status: "drafts" };

      const { data } = await axios({
        method,
        url,
        data: payload,
        headers: { "Content-Type": "application/json" },
      });

      const article = data.article;
      // Assuming API returns _id, map it to id for consistency
      const formattedArticle: DraftData = { ...article, id: article._id || updatedDraft.id };
      console.log("Saved article data:", formattedArticle);

      setSavedDraft(formattedArticle); // Update state with potentially new ID
      updateLocalStorage(formattedArticle); // Save updated draft with ID

    } catch (error) {
      console.error("Failed to save draft:", error);
      // Consider showing a user-friendly error message (e.g., using a toast notification library)
      alert(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoverImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Set the form value with the data URL
      setValue("coverImage", reader.result as string, { shouldValidate: true, shouldDirty: true });
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      // Handle error (e.g., show message to user)
      form.setError("coverImage", { type: "manual", message: "Failed to read image file." });
    };
    reader.readAsDataURL(file);
  };

  // Handler for content images (unchanged, but ensure it uses setValue correctly)
  const handleContentImageUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      setValue(`content.${index}.imageFile`, reader.result as string, { shouldValidate: true, shouldDirty: true });
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      form.setError(`content.${index}.imageFile`, { type: "manual", message: "Failed to read image file." });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    // Optional: Add a loading indicator
    return <div>Loading editor...</div>;
  }

  return (
    <div className="mx-auto p-6 max-w-4xl"> {/* Added max-width for better layout */}
      <Form {...form}>
        {/* Use onSaveAsDrafts for the form's onSubmit, handle preview separately */}
        <form onSubmit={handleSubmit(onSaveAsDrafts)} className="space-y-6">
          {/* Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the main title for your article" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- 3. Add Cover Image FormField --- */}
          <FormField
            control={control}
            name="coverImage"
            render={({ }) => ( // Destructure field but don't spread it onto the input directly
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <div
                  className="relative w-full h-64 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center bg-cover bg-center text-gray-500"
                  style={{ backgroundImage: coverImageValue ? `url(${coverImageValue})` : "none" }} // Use watched value for preview
                >
                  {!coverImageValue && <span>Click or drag file to upload cover image</span>}
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCoverImageUpload(file); // Use the specific handler
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author (Consider renaming label if it's not "Co-Owners") */}
          <FormField
            control={control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author / Co-Owners</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name(s)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tags */}
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tags separated by comma. e.g. 'life, tech'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="text-lg font-semibold pt-4 border-t mt-6">Article Content</h3>
          {/* Dynamic Content (Paragraphs & Images) */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2 p-4 border rounded-md relative group"> {/* Added styling */}
              {/* Dropdown Menu - Consider making it more visually distinct */}
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring"> {/* Improved focus */}
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => insert(index, { type: "paragraph", paragraphTitle: "", paragraphText: "" })}>
                      Add Paragraph Before
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insert(index, { type: "image", imageFile: "" })}>
                      Add Image Before
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insert(index + 1, { type: "paragraph", paragraphTitle: "", paragraphText: "" })}>
                      Add Paragraph After
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insert(index + 1, { type: "image", imageFile: "" })}>
                      Add Image After
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => remove(index)}>
                      Delete Section
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content Fields */}
              <div className="flex-1 space-y-4"> {/* Added space-y */}
              {field.type === "paragraph" && (
                <div className="space-y-2 flex-1">
                  <FormField
                    control={control}
                    name={`content.${index}.paragraphTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paragraph Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter paragraph title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`content.${index}.paragraphText`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paragraph Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter paragraph text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}


                {field.type === "image" && (
                  <FormField
                    control={control}
                    name={`content.${index}.imageFile`}
                    render={({ field: { value } }) => ( // Only need value here
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Content Image</FormLabel>
                        <div
                          className="relative w-full h-64 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center bg-cover bg-center text-gray-500"
                          style={{ backgroundImage: value ? `url(${value})` : "none" }}
                        >
                          {!value && <span>Click or drag file to upload content image</span>}
                          <FormControl>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleContentImageUpload(file, index); // Use correct handler
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Buttons to Add Content Sections */}
          <div className="flex gap-2 pt-4 border-t mt-6">
            <Button variant="outline" type="button" onClick={() => append({ type: "paragraph", paragraphTitle: "", paragraphText: "" })}>
              Add Paragraph Section
            </Button>
            <Button variant="outline" type="button" onClick={() => append({ type: "image", imageFile: "" })}>
              Add Image Section
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-4 pt-6 border-t mt-6">
            {/* Preview Button - Triggers validation and local storage save */}
            <Button
              variant="outline"
              type="button" // Change type to button to prevent form submission
              onClick={handleSubmit(onPreview)} // Use handleSubmit to ensure validation before preview
            >
              Preview
            </Button>

            {/* Save Draft Button (Primary Submit) */}
            <Button
              type="submit" // This is the main submit button now
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground" // Use primary color
            >
              {submitting
                ? "Saving..."
                : savedDraft.id ? "Update Draft" : "Save as Draft"}
            </Button>
            {/* Optional: Add a "Publish" button here later */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateArticle;
