import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    active: { type: Boolean, required: true },
    color: { type: String, required: true },
});

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: TagSchema },
    division: { type: [String], required: true, default: [] },
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export { Category };
