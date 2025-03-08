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

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Co-Owners must be at least 2 characters." }),
  tags: z
    .string()
    .min(2, { message: "Tags must be at least 2 characters." })
    .refine((value) => value.split(",").every((tag) => tag.trim().length > 0), {
      message: "Each tag must be non-empty and separated by commas.",
    }),

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


const CreateArticle = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [savedDraft, setSavedDraft] = useState<any>({
    title: "",
    author: "",
    tags: "",
    content: [],
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      tags: "",
      content: [],
    },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "content",
  });

  useEffect(() => {
    const draft = localStorage.getItem("create");

    if (draft) {
      reset(JSON.parse(draft));
      setSavedDraft(JSON.parse(draft))
    }
    setLoading(false);
  }, [reset]);

  const onPreview = (values: z.infer<typeof formSchema>) => {
    const updatedDraft = { ...savedDraft, ...values };

    setSavedDraft(() => updatedDraft)
    localStorage.setItem("create", JSON.stringify(updatedDraft));

    router.push("/preview?type=create");
  };


  const onSaveAsDrafts = async (values: z.infer<typeof formSchema>) => {
    const updatedDraft = { ...savedDraft, ...values };
    console.log(updatedDraft);
    console.log(savedDraft);

    setSubmitting(true);
    try {
      const url = updatedDraft.id
        ? `/api/article/${updatedDraft.id}`  // Update existing article
        : "/api/article";  // Create new article

      console.log(updatedDraft.id);


      const method = updatedDraft.id ? "patch" : "post"; // Decide HTTP method

      const { data } = await axios({
        method,
        url,
        data: { ...updatedDraft, status: "drafts" },
        headers: { "Content-Type": "application/json" },
      });

      const article = data.article
      const formattedArticle = { ...article, id: article._id }
      console.log(formattedArticle);

      setSavedDraft(() => formattedArticle)
      localStorage.setItem("create", JSON.stringify(formattedArticle));



    } catch (error) {
      console.error(error);
      alert(error || "Failed to publish article");
    } finally {
      setSubmitting(false);
    }

  };


  const handleImageUpload = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      form.setValue(`content.${index}.imageFile`, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onPreview)} className="space-y-6">
          {/* Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Co-Owners */}
          <FormField
            control={control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Co-Owners</FormLabel>
                <FormControl>
                  <Input placeholder="Enter co-owners" {...field} />
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
                  <Input placeholder="Enter tags separated by comma. e.g. 'life, tech' " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Dynamic Content (Paragraphs & Images) */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex">
              {/* Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:text-white">
                    <GripVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="hover:text-white" onClick={() => insert(index, { type: "paragraph", paragraphTitle: "", paragraphText: "" })}>
                    Add Paragraph Before
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-white" onClick={() => insert(index, { type: "image", imageFile: "" })}>
                    Add Image Before
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-white" onClick={() => insert(index + 1, { type: "paragraph", paragraphTitle: "", paragraphText: "" })}>
                    Add Paragraph After
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-white" onClick={() => insert(index + 1, { type: "image", imageFile: "" })}>
                    Add Image After
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:text-white" onClick={() => remove(index)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Paragraph Fields */}
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

              {/* Image Upload Field */}
              {field.type === "image" && (
                <div className="flex-1">
                  <FormField
                    control={control}
                    name={`content.${index}.imageFile`}
                    render={({ field: { value } }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <div
                          className="relative w-full h-64 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center bg-cover bg-center"
                          style={{ backgroundImage: value ? `url(${value})` : "none" }}
                        >
                          {!value && <span className="text-gray-500">Click to upload an image</span>}
                          <FormControl>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, index);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Button to Add Initial Paragraph or Image */}
          <div className="flex flex-wrap justify-between">
            <div className="flex gap-2">
              <Button className="bg-accent hover:bg-accent/90" type="button" onClick={() => append({ type: "paragraph", paragraphTitle: "", paragraphText: "" })}>
                Add Paragraph
              </Button>
              <Button className="bg-accent hover:bg-accent/90" type="button" onClick={() => append({ type: "image", imageFile: "" })}>
                Add Image
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 items-center">
              {/* <Link href="/preview" className="text-accent" > */}
              <Button
                onClick={handleSubmit(onSaveAsDrafts)}
                className="bg-accent hover:bg-accent/90"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : savedDraft?.status === "drafts"
                    ? "Saved!"
                    : "Save as draft"}
              </Button>

              <Button className="bg-accent hover:bg-accent/90" type="submit">Preview</Button>

              {/* </Link> */}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateArticle;
