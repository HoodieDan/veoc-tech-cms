import CreateArticle from "../components/CreateArticle";
import { Suspense } from "react";

export default function CreateArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateArticle mode="create" />
    </Suspense>
  );
}