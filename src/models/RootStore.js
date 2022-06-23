import axios from "axios";
import { types, flow } from "mobx-state-tree";
import CommentStore from "./CommentStore";

const COMMENT_URL = "https://jsonplaceholder.typicode.com/comments";

const getComments = async () => {
  let res = await axios.get(COMMENT_URL);
  let comment = res.data;
  return comment;
};

const RootStore = types
  .model("RootStore", {
    comments: types.optional(types.array(CommentStore), []),
    loading: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setComments(newComments) {
      self.comments = newComments;
    },
    // getComments: flow(function* () {
    //   const commentData = yield getComments();

    //   const newComments = commentData.map((self) => ({
    //     name: self.name,
    //     body: self.body,
    //     id: self.id,
    //   }));

    //   self.setComments(newComments);
    //   self.loading = false;
    // }),
    async getComments() {
      const commentData = await getComments();
      const newComments = commentData.map((self) => ({
        name: self.name,
        body: self.body,
        id: self.id,
      }));

      self.setComments(newComments);
      self.setLoading();
    },
    addComment(x) {
      self.comments.unshift(x);
    },
    setLoading() {
      self.loading = false;
    },
  }));

export default RootStore;
