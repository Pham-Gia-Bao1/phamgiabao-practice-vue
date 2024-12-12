<template>
  <div class="dictionary-container">
    <h1 class="title">Từ Điển</h1>
    <div class="search-container">
      <input type="text" v-model="translateTerm" placeholder="hello" class="search-input" />
      <button @click="search" class="translate-button">Dịch</button>
    </div>
    <p v-if="translation" class="translation">{{ translation }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: '',
      translation: '',
    }
  },
  methods: {
    search() {
      const url = `http://localhost:8080/api/dictionary?word=${this.translateTerm}`

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          // Try to parse the response as JSON
          return response.json().catch(() => response.text())
        })
        .then((data) => {
          // Check if data is a string or an object
          if (typeof data === 'string') {
            this.translation = data // Handle plain text response
          } else {
            this.translation = data.translation // Access the translation property
          }
        })
        .catch((error) => {
          console.error(error)
          this.translation = 'Error translating text'
        })
    },
  },
}
</script>

<style scoped>
.dictionary-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 70%;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-button {
  width: 30%;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #3e8e41;
}

.translation {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #666;
}
</style>
