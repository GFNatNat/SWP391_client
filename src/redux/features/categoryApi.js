import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "https://swp391serversided-git-main-gfnatnats-projects.vercel.app/api/category/add",
        method: "POST",
        body: data,
      }),
    }),
    getShowCategory: builder.query({
      query: () => `https://swp391serversided-git-main-gfnatnats-projects.vercel.app/api/category/show`
    }),
    getProductTypeCategory: builder.query({
      query: (type) => `https://swp391serversided-git-main-gfnatnats-projects.vercel.app/api/category/show/${type}`
    }),
  }),
});

export const {
 useAddCategoryMutation,
 useGetProductTypeCategoryQuery,
 useGetShowCategoryQuery,
} = categoryApi;
