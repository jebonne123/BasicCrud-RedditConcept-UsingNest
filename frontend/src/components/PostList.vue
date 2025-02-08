<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import logo from '../../images/reddit.png'

const posts = ref([]);
const newPost = ref({ title: "", content: "", author: "" });
const editingPost = ref(null); // Stores the post being edited
const editedPost = ref({ title: "", content: "", author: "" });

const fetchPosts = async () => {
  const response = await api.get("/");
  posts.value = response.data.reverse();
};

const addPost = async () => {
  if (!newPost.value.title || !newPost.value.content || !newPost.value.author) return;
  await api.post("/", newPost.value);
  newPost.value = { title: "", content: "", author: "" };
  fetchPosts();
};

const deletePost = async (id) => {
  await api.delete(`/${id}`);
  fetchPosts();
};

const startEditing = (post) => {
  editingPost.value = post._id; // Set the post being edited
  editedPost.value = { title: post.title, content: post.content, author: post.author }; // Copy values
};

const updatePost = async () => {
  if (!editingPost.value) return;
  
  await api.patch(`/${editingPost.value}`, editedPost.value);

  // Reset editing state
  editingPost.value = null;
  editedPost.value = { title: "", content: "", author: "" };
  
  fetchPosts(); // Refresh posts
};

const cancelEdit = () => {
  editingPost.value = null;
};

onMounted(fetchPosts);
</script>

<template>
    <div class="min-h-screen bg-[#0E1113] flex flex-col">
      <!-- Header -->
      <!-- Header -->
    <header class="bg-[#0E1113] w-full p-4 shadow-md fixed top-0 left-0 z-50 border-b border-gray-700">
        <div class="flex items-center space-x-2 mt-1">
            <img class="h-10 w-auto" :src="logo"/>
            <h1 class="text-2xl font-bold text-white">Reddit Clone</h1>
            <p class="text-white">by jebskie</p>
        </div>
    </header>
    
      <!-- Main Content -->
      <div class="flex-grow w-screen p-4  bg-[#0E1113] text-white mt-16">
        <div class="max-w-4xl mx-auto flex flex-col gap-6">
          
          <!-- Create Post Section -->
          <div class="bg-gray-100 text-black p-6 rounded-lg shadow-md mt-6">
            <h2 class="text-2xl font-bold mb-4">Create a new Post</h2>
            <input v-model="newPost.title" placeholder="Title" class="border p-2 rounded w-full mb-2" />
            <textarea v-model="newPost.content" placeholder="What's on your mind?" class="border p-2 rounded w-full mb-2"></textarea>
            <input v-model="newPost.author" placeholder="Author" class="border p-2 rounded w-full mb-2"/>
            <button @click="addPost" class="bg-blue-500 text-white p-2 rounded w-full cursor-pointer">Add Post</button>
          </div>
  
          <!-- List Posts Section -->
          <div class="text-black">
            <div v-for="post in posts" :key="post._id" class="mb-6 border border-gray-300 rounded-lg bg-white p-4 shadow">
                
                <!-- Title & Buttons -->
                <div class="flex justify-between items-center mb-2">
                  <h2 class="text-xl font-semibold">Title: {{ post.title }}</h2>

                    <div class="flex gap-2 mr-5">
                        <!-- Edit Button -->
                        <button @click="startEditing(post)" class="cursor-pointer mr-2">
                            <img src="../../images/edit.png" alt="Edit" class="w-6 h-6" />
                        </button>

                        <!-- Delete Button -->
                        <button @click="deletePost(post._id)" class="cursor-pointer">
                            <img src="../../images/delete.png" alt="Delete" class="w-6 h-6" />
                        </button>
                    </div>

                </div>

                <!-- Post Content -->
                <div class="border-t border-gray-300 pt-3" v-if="editingPost !== post._id">
                  <p>{{ post.content }}</p>
                  <p class="text-sm text-gray-500 mt-2">Posted By: {{ post.author }}</p>
                </div>

                <!-- Edit Form -->
                <div v-if="editingPost === post._id" class="bg-white p-4 rounded mt-2">
                  <input v-model="editedPost.title" class="border p-2 rounded w-full mb-2" />
                  <textarea v-model="editedPost.content" class="border p-2 rounded w-full mb-2"></textarea>
                  <input v-model="editedPost.author" class="border p-2 rounded w-full mb-2" />
                  
                  <div class="flex gap-2">
                    <button @click="updatePost" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
                      Save
                    </button>
                    <button @click="cancelEdit" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>

            </div>
          </div>

        </div>
      </div>
    </div>
</template>

  
  
  
  
