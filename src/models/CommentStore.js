import { types } from "mobx-state-tree";

const CommentStore = types.model("CommentStore", {
  name: types.optional(types.string, ""),
  body: types.optional(types.string, ""),
  id: types.optional(types.number, 0),
});

export default CommentStore;
