"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { globalDraft, DraftData } from "@/lib/globalDraft";
import axios from "axios";

// Define the Articles type
export type Articles = {
  id: string;
  title: string;
  author: string;
  date: string;
  tags: string;
  coverImage: string;
  status: "drafts" | "published";
  content: { type: "image" | "paragraph"; paragraphTitle?: string; paragraphText?: string; imageFile?: string }[];
};

// Component for the actions cell
function ActionsCell({ article, onDeleteArticle }: { article: Articles; onDeleteArticle: (id: string) => void }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = () => {
    try {
      // Map Articles to DraftData, ensuring content compatibility
      const draftData: DraftData = {
        id: article.id,
        title: article.title || "",
        author: article.author || "",
        tags: article.tags || "",
        coverImage: article.coverImage || "",
        content: Array.isArray(article.content)
          ? article.content.map(item =>
              item.type === "paragraph"
                ? {
                    type: "paragraph",
                    paragraphTitle: item.paragraphTitle || "",
                    paragraphText: item.paragraphText || "",
                  }
                : item.type === "image"
                ? {
                    type: "image",
                    imageFile: item.imageFile || "",
                  }
                : null
            ).filter((item): item is { type: "paragraph"; paragraphTitle: string; paragraphText: string; } | { type: "image"; imageFile: string; } => item !== null)
          : [],
      };
      globalDraft.data = draftData; // Set global draft
      router.push(`/edit-article/${article.id}`);
    } catch (error) {
      console.error("Navigation failed:", error);
      alert("Failed to navigate to edit page.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/article/${article.id}`);
      onDeleteArticle(article.id);
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreview = () => {
    try {
      // Map Articles to DraftData, ensuring content compatibility
      // const draftData: DraftData = {
      //   id: article.id,
      //   title: article.title || "",
      //   author: article.author || "",
      //   tags: article.tags || "",
      //   coverImage: article.coverImage || "",
      //   status : article.status || "drafts",
      //   content: Array.isArray(article.content)
      //     ? article.content
      //         .map(item => {
      //           if (item.type === "paragraph") {
      //             return {
      //               type: "paragraph",
      //               paragraphTitle: item.paragraphTitle || "",
      //               paragraphText: item.paragraphText || "",
      //             };
      //           } else if (item.type === "image") {
      //             return {
      //               type: "image",
      //               imageFile: item.imageFile || "",
      //             };
      //           } else {
      //             return null;
      //           }
      //         })
      //         .filter((item): item is { type: "paragraph"; paragraphTitle: string; paragraphText: string; } | { type: "image"; imageFile: string; } => item !== null)
      //     : [],
      // };
      globalDraft.data = article as DraftData; // Set global draft
      router.push("/preview?type=view");
    } catch (error) {
      console.error("Navigation failed:", error);
      alert("Failed to navigate to preview page.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 p-0 hover:text-white"
          aria-label="Open article actions menu"
          disabled={isDeleting}
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>Edit Article</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Article"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePreview}>Preview Article</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Define the columns
export const columns = (
  onDeleteArticle: (id: string) => void
): ColumnDef<Articles>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        className="hover:bg-gray/80 hover:text-black"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <Button
        className="hover:bg-gray/80 hover:text-black"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Author
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("author")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`uppercase px-0 py-1 rounded-3xl text-center font-medium ${status === "drafts" ? "bg-black/40 text-white" : "bg-green-200 text-green-500"}`}
        >
          {status}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell article={row.original} onDeleteArticle={onDeleteArticle} />,
  },
];

interface DataTableProps {
  data: Articles[];
  onDeleteArticle: (id: string) => void;
}

export default function DataTable({ data, onDeleteArticle }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const memoizedColumns = React.useMemo(() => columns(onDeleteArticle), [onDeleteArticle]);

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter articles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm bg-white"
        />
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:bg-gray hover:text-white" variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:bg-gray hover:text-white" variant="outline">
                Filter <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("")}>
                Show All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("published")}>
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("drafts")}>
                Drafts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-gray">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}