"use client";
import { z } from "zod";
import React, { } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  coOwners: z.string().min(2, { message: "Co-Owners must be at least 2 characters." }),
  tags: z.string().min(2, { message: "Tags must be at least 2 characters." }),
  content: z.array(
    z.object({
      type: z.enum(["paragraph", "image"]),
      paragraphTitle: z.string().optional(),
      paragraphText: z.string().optional(),
      imageFile: z.string().optional(),
    })
  ),
});

const CreateArticle = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      coOwners: "",
      tags: "",
      content: [],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "content",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const jsonData = JSON.stringify(values, null, 2); // Convert to formatted JSON
    console.log(jsonData); // Log the JSON (optional)
  
    // Example: Copy JSON to clipboard
    navigator.clipboard.writeText(jsonData).then(() => {
      alert("Form data copied to clipboard!");
    });
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            name="coOwners"
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
              <Link href="/preview" className="text-accent" >Save as draft</Link>
              {/* <Link href="/preview" className="text-accent" > */}
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
