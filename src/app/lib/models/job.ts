import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    checked: { type: Boolean, default: false },
    title: { type: String, required: true },
    dept: { type: String, required: true },
    location: { type: String, required: true },
    desc: { type: String, required: true },
    status: { type: String, required: true },
    job_type: { type: String, default: "" },
    submission_link: { type: String, default: "" },
    experience: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, default: "" },

}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export { Job };
