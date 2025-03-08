import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    coOwners: [{ type: String }], 
    tags: [{ type: String }], 
    content: [{ type: Object, required: true }], 
    published: { type: Boolean, default: false },
  },
  { timestamps: true } 
);



const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export { Article };
