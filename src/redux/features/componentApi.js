import { apiSlice } from "../api/apiSlice";

export const componentApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addComponent: builder.mutation({
      query: (data) => ({
        url: "/component/add",
        method: "POST",
        body: data,
      }),
    }),
    updateComponent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/component/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    getComponentById: builder.query({
      query: (id) => `/component/${id}`,
    }),
    deleteComponent: builder.mutation({
      query: (id) => ({
        url: `/component/${id}`,
        method: "DELETE",
      }),
    }),
    getComponentByName: builder.query({
      query: (name) => `/component/name/${name}`,
    }),
  }),
});

export const {
  useAddComponentMutation,
  useUpdateComponentMutation,
  useGetComponentByIdQuery,
  useDeleteComponentMutation,
  useGetComponentByNameQuery,
} = componentApi;
