import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, alias: "_id" },
    title: { type: String, required: true, trim: true },
    author: { type: String },
    tags: { type: String },
    coverImage: { type: String }, // Add this line
    content: [{ type: Object, required: true }],
    status: { type: String, default: "published" },
    date: { type: String } // Formatted date stored here
  },
  { timestamps: true } // Enables `createdAt` and `updatedAt`
);


ArticleSchema.pre("save", function (next) {
  this.date = this.updatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  next();
});

ArticleSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as Record<string, unknown>; // Explicitly type as an object
  if (update) {
    update.$set = update.$set || {};
    (update.$set as Record<string, unknown>).date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  next();
});




const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export { Article };
