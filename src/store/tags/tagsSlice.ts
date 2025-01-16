import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 } from "uuid";

interface Tag {
  tag: string;
  id: string;
}

const getStoredTags = (): Tag[] => {
  const storedData = localStorage.getItem("tagsList");
  return storedData
    ? JSON.parse(storedData)
    : [
        { tag: "coding", id: v4() },
        { tag: "exercise", id: v4() },
        { tag: "quotes", id: v4() },
      ];
};

const saveToLocalStorage = (tagsList: Tag[]) => {
  localStorage.setItem("tagsList", JSON.stringify(tagsList));
};

const initialState: { tagsList: Tag[] } = {
  tagsList: getStoredTags(),
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    addTags: (state, { payload }: { payload: Tag }) => {
      if (state.tagsList.find(({ tag }: Tag) => tag === payload.tag)) {
        toast.warning("이미 존재하는 태그입니다.");
      } else {
        state.tagsList.push(payload);
        saveToLocalStorage(state.tagsList);
        toast.info("새로운 태그가 등록되었습니다.");
      }
    },
    deleteTags: (state, { payload }: { payload: string }) => {
      state.tagsList = state.tagsList.filter(({ id }: Tag) => id !== payload);
      saveToLocalStorage(state.tagsList);
      toast.info("태그가 삭제되었습니다.");
    },
  },
});

export const { addTags, deleteTags } = tagsSlice.actions;

export default tagsSlice.reducer;
