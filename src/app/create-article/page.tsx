"use client";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
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
import { globalDraft, DraftData } from "@/lib/globalDraft";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Co-Owners must be at least 2 characters." }),
  tags: z
    .string()
    .min(2, { message: "Tags must be at least 2 characters." })
    .refine((value) => value.split(",").every((tag) => tag.trim().length > 0), {
      message: "Each tag must be non-empty and separated by commas.",
    }),
  coverImage: z.string().min(1, { message: "Cover image is required." }),
  content: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("paragraph"),
        paragraphTitle: z.string().min(1, { message: "Paragraph title is required." }),
        paragraphText: z.string().min(1, { message: "Paragraph text is required." }),
      }),
      z.object({
        type: z.literal("image"),
        imageFile: z.string().min(1, { message: "Image file URL is required." }),
      }),
    ])
  ),
});

type Props = {
  mode?: "create" | "edit";
  article?: DraftData;
};

const CreateArticle: React.FC<Props> = ({ mode = "create", article }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [savedDraft, setSavedDraft] = useState<DraftData>(globalDraft.data);

  // --- Define initial draft for fallback ---
  const initialDraft: DraftData = {
    title: "",
    author: "",
    tags: "",
    coverImage: "",
    content: [],
  };

  const defaultValues: DraftData = (() => {
    if (mode === "edit" && article) {
      console.log("Edit mode: Using article prop", article);
      const draft = {
        title: article.title || "",
        author: article.author || "",
        tags: article.tags || "",
        coverImage: article.coverImage || "",
        content: Array.isArray(article.content) ? article.content : [],
        id: article.id,
      };
      globalDraft.data = draft;
      globalDraft.fromPreview = false; // Reset flag
      console.log("Edit mode: globalDraft.data set to", globalDraft.data);
      return draft;
    } else {
      console.log("Create mode");
      const isFromPreview = searchParams.get("from") === "preview" || globalDraft.fromPreview;
      console.log("Query param 'from':", searchParams.get("from"), "globalDraft.fromPreview:", globalDraft.fromPreview, "isFromPreview:", isFromPreview);
      if (!isFromPreview) {
        globalDraft.data = initialDraft;
        globalDraft.fromPreview = false; // Reset flag
      }
      console.log("Returning globalDraft.data:", globalDraft.data);
      return globalDraft.data;
    }
  })();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { control, handleSubmit, reset, setValue, watch, formState: { isDirty } } = form;
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "content",
  });

  // Watch form values to sync with globalDraft.data in real-time
  const formValues = watch();

  // Sync globalDraft.data with form changes in edit mode
  useEffect(() => {
    if (mode === "edit") {
      console.log("Syncing globalDraft.data with form values:", formValues);
      globalDraft.data = { ...formValues, id: article?.id }; // Preserve id in edit mode
    }
  }, [formValues, mode, article?.id]);

  // Watch the coverImage field to display the preview
  const coverImageValue = watch("coverImage");

  // --- Add beforeunload event listener for unsaved changes ---
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "Changes may be lost. Are you sure you want to refresh?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // --- Update globalDraft logic ---
  const updateGlobalDraft = (data: DraftData) => {
    globalDraft.data = { ...data };
    setSavedDraft(globalDraft.data);
  };

  const onPreview = (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form values for preview:", values);
      globalDraft.data = { ...values, id: mode === "edit" ? article?.id : undefined }; // Preserve id in edit mode
      globalDraft.fromPreview = true;
      console.log("globalDraft.data set to:", globalDraft.data);
      console.log("globalDraft.fromPreview set to:", globalDraft.fromPreview);
      router.push("/preview?type=create");
    } catch (error) {
      console.error("Navigation failed:", error);
      alert("Failed to navigate to preview page.");
    }
  };

  const onSaveAsDrafts = async (values: z.infer<typeof formSchema>) => {
    const updatedDraft: DraftData = { ...savedDraft, ...values, id: mode === "edit" ? article?.id : savedDraft.id };
    console.log("Saving draft:", updatedDraft);

    setSubmitting(true);
    try {
      const url = updatedDraft.id ? `/api/article/${updatedDraft.id}` : "/api/article";
      const method = updatedDraft.id ? "patch" : "post";
      const payload = { ...updatedDraft, status: "drafts" };

      const { data } = await axios({
        method,
        url,
        data: payload,
        headers: { "Content-Type": "application/json" },
      });

      const article = data.article;
      const formattedArticle: DraftData = { ...article, id: article._id || updatedDraft.id };
      console.log("Saved article data:", formattedArticle);

      updateGlobalDraft(formattedArticle);
      globalDraft.fromPreview = false; // Reset flag
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoverImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setValue("coverImage", reader.result as string, { shouldValidate: true, shouldDirty: true });
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      form.setError("coverImage", { type: "manual", message: "Failed to read image file." });
    };
    reader.readAsDataURL(file);
  };

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

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <Form {...form}>
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

          {/* Cover Image */}
          <FormField
            control={control}
            name="coverImage"
            render={() => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <div
                  className="relative w-full h-64 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center bg-cover bg-center text-gray-500"
                  style={{ backgroundImage: coverImageValue ? `url(${coverImageValue})` : "none" }}
                >
                  {!coverImageValue && <span>Click or drag file to upload cover image</span>}
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCoverImageUpload(file);
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

          {/* Author */}
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
            <div key={field.id} className="flex items-start gap-2 p-4 border rounded-md relative group">
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring">
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

              <div className="flex-1 space-y-4">
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
                    render={({ field: { value } }) => (
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
                                  handleContentImageUpload(file, index);
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
            <Button
              variant="outline"
              type="button"
              className="hover:text-white"
              onClick={handleSubmit(onPreview)}
            >
              Preview
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting
                ? "Saving..."
                : savedDraft.id ? "Update Draft" : "Save as Draft"}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                globalDraft.data = initialDraft;
                globalDraft.fromPreview = false;
                reset({
                  title: "",
                  author: "",
                  tags: "",
                  coverImage: "",
                  content: [],
                });
                setSavedDraft(initialDraft);
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateArticle;